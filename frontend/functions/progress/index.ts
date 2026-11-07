import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getPrimaryHabit } from '../users';

export type DayStatus = 'checked-in' | 'relapsed' | 'missed';

export type ProgressStats = {
  streak: number;
  resisted: number;
  relapses: number;
  checkIns: number;
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

export async function fetchProgressStats(
  uid: string,
  asOfDate: string = getLocalDate(new Date()),
): Promise<ProgressStats> {
  const checkInSnapshot = await getDocs(collection(db, 'users', uid, 'check_in_record'));
  const checkIns = checkInSnapshot.docs.map((record) => record.data() as CheckInRecord);
  const habit = await getPrimaryHabit(uid);
  const triggerSnapshot = habit
    ? await getDocs(
        collection(db, 'users', uid, 'addiction_record', habit.id, 'triggerLog'),
      )
    : null;
  const triggers = triggerSnapshot
    ? triggerSnapshot.docs.map((record) => record.data() as TriggerRecord)
    : [];

  const checkedInDates = new Set(
    checkIns
      .filter((record) => record.completedAt)
      .map((record) => getLocalDate(record.completedAt as string)),
  );
  const relapseDates = new Set(
    triggers
      .filter((trigger) => trigger.relapsed && trigger.loggedAt)
      .map((trigger) => getLocalDate(trigger.loggedAt as string)),
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

  const relapses = triggers.filter((trigger) => trigger.relapsed).length;
  const resisted = triggers.length - relapses;
  const last30Days: DayStatus[] = Array.from({ length: 30 }, (_, index) => {
    const date = new Date(`${asOfDate}T00:00:00`);
    date.setDate(date.getDate() - (29 - index));
    const localDate = getLocalDate(date);
    if (relapseDates.has(localDate)) return 'relapsed';
    if (checkedInDates.has(localDate)) return 'checked-in';
    return 'missed';
  });

  return { streak, resisted, relapses, checkIns: checkIns.length, last30Days, streakStartDate };
}

export async function syncPlantState(uid: string, stats: ProgressStats): Promise<void> {
  try {
    const plantState = doc(db, 'users', uid, 'plant_state', 'current');
    const existing = await getDoc(plantState);
    const previousLongest = existing.exists()
      ? (existing.data().longestStreakDays as number) ?? 0
      : 0;

    await setDoc(
      plantState,
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

export async function getCachedPlantState(uid: string) {
  const snapshot = await getDoc(doc(db, 'users', uid, 'plant_state', 'current'));
  return snapshot.exists() ? snapshot.data() : null;
}
