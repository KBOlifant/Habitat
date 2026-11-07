import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../app/lib/firebase';

export type PrimaryHabit = {
  id: string;
  name: string;
};

export async function getPrimaryHabit(uid: string): Promise<PrimaryHabit | null> {
  const habits = await getDocs(collection(db, 'users', uid, 'addiction_record'));
  const firstHabit = habits.docs[0];
  if (!firstHabit) return null;

  const name = firstHabit.data().addiction;
  return {
    id: firstHabit.id,
    name: typeof name === 'string' ? name : '',
  };
}

export async function createHabit(uid: string, habit: string): Promise<string> {
  const createdHabit = await addDoc(collection(db, 'users', uid, 'addiction_record'), {
    uid,
    addiction: habit,
    avg_daily_time_spent: '',
  });
  return createdHabit.id;
}
