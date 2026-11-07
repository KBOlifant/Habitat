import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export type CheckRecord = {
  step: number;
  title: string;
  action: 'checked' | 'swiped';
  answer?: 'strongUrge' | 'noUrge';
  completedAt: string;
};

export type CheckInNoteRecord = {
  id: string;
  note: string;
  completedAt: string;
};

export async function saveCheckIn(
  uid: string,
  checks: CheckRecord[],
  note?: string,
): Promise<void> {
  await addDoc(collection(db, 'users', uid, 'check_in_record'), {
    daily_check: true,
    has_relapsed: false,
    checks,
    ...(note ? { note, noteDate: getLocalDate(new Date()) } : {}),
    uid,
    completedAt: new Date().toISOString(),
  });
}

export async function saveDevelopmentCheckIn(
  uid: string,
  date: string,
  checks: CheckRecord[],
): Promise<void> {
  const completedAt = new Date(`${date}T12:00:00`).toISOString();
  await addDoc(collection(db, 'users', uid, 'check_in_record'), {
    daily_check: true,
    has_relapsed: false,
    checks,
    uid,
    completedAt,
    completedDate: date,
    devGenerated: true,
  });
}

export async function getCheckInNotes(uid: string): Promise<CheckInNoteRecord[]> {
  const snapshot = await getDocs(collection(db, 'users', uid, 'check_in_record'));
  return snapshot.docs
    .map((record) => {
      const data = record.data();
      return {
        id: record.id,
        note: typeof data.note === 'string' ? data.note.trim() : '',
        completedAt: typeof data.completedAt === 'string' ? data.completedAt : '',
      };
    })
    .filter((record) => record.note.length > 0);
}

export async function getCheckIns(
  uid: string,
): Promise<Array<{ id: string } & Record<string, unknown>>> {
  const snapshot = await getDocs(collection(db, 'users', uid, 'check_in_record'));
  return snapshot.docs.map((record) => ({ id: record.id, ...record.data() }));
}

export async function deleteCheckIn(uid: string, checkInId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid, 'check_in_record', checkInId));
}

export async function deleteAllCheckIns(uid: string): Promise<number> {
  const records = await getDocs(collection(db, 'users', uid, 'check_in_record'));
  await Promise.all(records.docs.map((record) => deleteDoc(record.ref)));
  return records.size;
}

function getLocalDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
