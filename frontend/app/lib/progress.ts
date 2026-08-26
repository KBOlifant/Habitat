// Target path: app/lib/progress.ts
//
// Central place for computing a user's recovery "progress" from Firestore,
// and for keeping a lightweight cache (`plant_state`) of the derived numbers
// so screens don't all have to re-scan check_in_record + triggerLog history
// on every render.
//
// Firestore layout assumed (existing):
//   users/{uid}
//   users/{uid}/addiction_record/{recordId}            { uid, addiction, avg_daily_time_spent }
//   users/{uid}/addiction_record/{recordId}/triggerLog { name, reason, intensity, relapsed, loggedAt }
//   users/{uid}/check_in_record/{id}                   { completedAt }
//
// New, added by this file:
//   users/{uid}/plant_state/current   { currentStreakDays, longestStreakDays, streakStartDate, lastSyncedAt }
//
// plant_state is a cache, not a source of truth — it's derived from the
// collections above and is safe to delete/rebuild at any time.

import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export type DayStatus = 'checked-in' | 'relapsed' | 'missed';

export type ProgressStats = {
  streak: number;
  resisted: number;
  relapses: number;
  last30Days: DayStatus[];
  streakStartDate: string | null;
};

type CheckInRecord = { completedAt?: string };
type TriggerRecord = { relapsed?: boolean; loggedAt?: string };

export const getLocalDate = (value: string | Date): string => {
  const date = value instanceof Date ? value : new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

async function getFirstAddictionRecordId(uid: string): Promise<string | null> {
  const snapshot = await getDocs(collection(db, 'users', uid, 'addiction_record'));
  return snapshot.docs[0]?.id ?? null;
}

/**
 * Pulls check-ins + trigger logs and derives everything Home and Progress
 * need: current streak, resisted/relapse counts, and a 30-day status grid.
 * `asOfDate` lets DevTimeTravel simulate "today" for testing.
 */
export async function fetchProgressStats(
  uid: string,
  asOfDate: string = getLocalDate(new Date()),
): Promise<ProgressStats> {
  const checkInSnapshot = await getDocs(collection(db, 'users', uid, 'check_in_record'));
  const checkIns = checkInSnapshot.docs.map((d) => d.data() as CheckInRecord);

  const addictionRecordId = await getFirstAddictionRecordId(uid);
  let triggers: TriggerRecord[] = [];
  if (addictionRecordId) {
    const triggerSnapshot = await getDocs(
      collection(db, 'users', uid, 'addiction_record', addictionRecordId, 'triggerLog'),
    );
    triggers = triggerSnapshot.docs.map((d) => d.data() as TriggerRecord);
  }

  const checkedInDates = new Set(
    checkIns.filter((c) => c.completedAt).map((c) => getLocalDate(c.completedAt as string)),
  );
  const relapseDates = new Set(
    triggers.filter((t) => t.relapsed && t.loggedAt).map((t) => getLocalDate(t.loggedAt as string)),
  );

  let streak = 0;
  let streakStartDate: string | null = null;
  if (checkedInDates.has(asOfDate) && !relapseDates.has(asOfDate)) {
    const cursor = new Date(`${asOfDate}T00:00:00`);
    while (checkedInDates.has(getLocalDate(cursor)) && !relapseDates.has(getLocalDate(cursor))) {
      streak += 1;
      streakStartDate = getLocalDate(cursor);
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  const relapses = triggers.filter((t) => t.relapsed).length;
  const resisted = triggers.length - relapses;

  const last30Days: DayStatus[] = Array.from({ length: 30 }, (_, index) => {
    const date = new Date(`${asOfDate}T00:00:00`);
    date.setDate(date.getDate() - (29 - index));
    const local = getLocalDate(date);
    if (relapseDates.has(local)) return 'relapsed';
    if (checkedInDates.has(local)) return 'checked-in';
    return 'missed';
  });

  return { streak, resisted, relapses, last30Days, streakStartDate };
}

/**
 * Upserts users/{uid}/plant_state/current so any screen can read "where's
 * my bonsai at" without re-scanning full check-in/trigger history. Tracks
 * longestStreakDays too, which can't be derived from a single fetch once a
 * user has relapsed and started a new streak. Best-effort: logs, doesn't throw.
 */
export async function syncPlantState(uid: string, stats: ProgressStats): Promise<void> {
  try {
    const ref = doc(db, 'users', uid, 'plant_state', 'current');
    const existing = await getDoc(ref);
    const previousLongest = existing.exists() ? (existing.data().longestStreakDays as number) ?? 0 : 0;

    await setDoc(
      ref,
      {
        currentStreakDays: stats.streak,
        longestStreakDays: Math.max(stats.streak, previousLongest),
        streakStartDate: stats.streakStartDate,
        lastSyncedAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (error) {
    console.error('Unable to sync plant_state', error);
  }
}

/** Reads the cached plant_state doc directly, e.g. for a fast initial paint before the full fetch resolves. */
export async function getCachedPlantState(uid: string) {
  const snapshot = await getDoc(doc(db, 'users', uid, 'plant_state', 'current'));
  return snapshot.exists() ? snapshot.data() : null;
}
