import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';

export type Trigger = {
  id: string;
  name: string;
  reason: string;
  intensity: number;
  relapsed: boolean;
  loggedAt: string;
};

export type NewTriggerInput = {
  name: string;
  reason: string;
  intensity: number;
  relapsed: boolean;
};

async function getTriggerLogCollection() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('You must be signed in to access trigger logs.');
  }

  const addictionRecords = await getDocs(
    collection(db, 'users', user.uid, 'addiction_record')
  );
  const addictionRecord = addictionRecords.docs[0];

  if (!addictionRecord) {
    throw new Error('No addiction record found for this user.');
  }

  return collection(
    db,
    'users',
    user.uid,
    'addiction_record',
    addictionRecord.id,
    'triggerLog'
  );
}

export async function getTriggers(): Promise<Trigger[]> {
  const triggerLogs = await getDocs(await getTriggerLogCollection());

  return triggerLogs.docs
    .map((triggerDoc) => ({
      id: triggerDoc.id,
      ...(triggerDoc.data() as Omit<Trigger, 'id'>),
    }))
    .sort(
      (a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
    );
}

export async function addTrigger(input: NewTriggerInput): Promise<Trigger> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('You must be signed in to save a trigger.');
  }

  const addictionRecords = await getDocs(
    collection(db, 'users', user.uid, 'addiction_record')
  );
  const addictionRecord = addictionRecords.docs[0];

  if (!addictionRecord) {
    throw new Error('No addiction record found for this user.');
  }

  const loggedAt = new Date().toISOString();
  const docRef = await addDoc(
    collection(
      db,
      'users',
      user.uid,
      'addiction_record',
      addictionRecord.id,
      'triggerLog'
    ),
    { addictionRecordID: addictionRecord.id, ...input, loggedAt }
  );

  return { id: docRef.id, loggedAt, ...input };
}

export async function deleteTrigger(id: string): Promise<void> {
  const triggerLog = await getTriggerLogCollection();
  await deleteDoc(doc(triggerLog, id));
}
