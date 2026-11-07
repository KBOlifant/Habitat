import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { getPrimaryHabit } from '../users';

export type TriggerFollowUp = {
  wasTriggered: boolean;
  note?: string;
  createdAt: string;
};

export type Trigger = {
  id: string;
  name: string;
  reason: string;
  intensity: number;
  relapsed: boolean;
  loggedAt: string;
  followUp?: TriggerFollowUp;
};

export type NewTriggerInput = {
  name: string;
  reason: string;
  intensity: number;
  relapsed: boolean;
};

export type TriggerFollowUpInput = {
  wasTriggered: boolean;
  note?: string;
};

async function getTriggerLogCollection(uid: string) {
  const habit = await getPrimaryHabit(uid);
  if (!habit) throw new Error('No addiction record found for this user.');
  return {
    collection: collection(db, 'users', uid, 'addiction_record', habit.id, 'triggerLog'),
    habitId: habit.id,
  };
}

export async function getTriggers(uid: string): Promise<Trigger[]> {
  const { collection: triggerLog } = await getTriggerLogCollection(uid);
  const snapshot = await getDocs(triggerLog);
  return snapshot.docs
    .map((triggerDoc) => ({
      id: triggerDoc.id,
      ...(triggerDoc.data() as Omit<Trigger, 'id'>),
    }))
    .sort((first, second) =>
      new Date(second.loggedAt).getTime() - new Date(first.loggedAt).getTime(),
    );
}

export async function addTrigger(uid: string, input: NewTriggerInput): Promise<Trigger> {
  const { collection: triggerLog, habitId } = await getTriggerLogCollection(uid);
  const loggedAt = new Date().toISOString();
  const createdTrigger = await addDoc(triggerLog, {
    addictionRecordID: habitId,
    ...input,
    loggedAt,
  });
  return { id: createdTrigger.id, loggedAt, ...input };
}

export async function deleteTrigger(uid: string, id: string): Promise<void> {
  const { collection: triggerLog } = await getTriggerLogCollection(uid);
  await deleteDoc(doc(triggerLog, id));
}

export async function updateTriggerFollowUp(
  uid: string,
  id: string,
  input: TriggerFollowUpInput,
): Promise<void> {
  const { collection: triggerLog } = await getTriggerLogCollection(uid);
  await updateDoc(doc(triggerLog, id), {
    followUp: {
      wasTriggered: input.wasTriggered,
      ...(input.note?.trim() ? { note: input.note.trim() } : {}),
      createdAt: new Date().toISOString(),
    } satisfies TriggerFollowUp,
  });
}

export async function deleteTriggerFollowUp(uid: string, id: string): Promise<void> {
  const { collection: triggerLog } = await getTriggerLogCollection(uid);
  await updateDoc(doc(triggerLog, id), { followUp: deleteField() });
}
