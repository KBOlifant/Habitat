import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View, useColorScheme } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import '../global.css';
import { Gradients } from '@/constants/theme';
import { auth, db } from '../lib/firebase';
import { goBackOrHome } from '../lib/navigation';
import CheckInNotesHeader from '../../components/CheckInScreen/check-in-notes-header';
import CheckInNoteListItem from '../../components/CheckInScreen/check-in-note-list-item';
import ScreenTransition from '../../components/General/screen-transition';
import { getTriggers, deleteTriggerFollowUp, type Trigger } from '../lib/storage/trigger-storage';

type CheckInNote = {
  id: string;
  note: string;
  completedAt: string;
  source: 'check-in' | 'trigger';
};

export default function CheckInNotesScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<CheckInNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotes = useCallback(async () => {
    if (!user) {
      setNotes([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const [checkInSnapshot, triggers] = await Promise.all([
        getDocs(collection(db, 'users', user.uid, 'check_in_record')),
        getTriggers(),
      ]);
      const checkInNotes = checkInSnapshot.docs
        .map((document) => {
          const data = document.data();
          return {
            id: document.id,
            note: typeof data.note === 'string' ? data.note.trim() : '',
            completedAt: typeof data.completedAt === 'string' ? data.completedAt : '',
            source: 'check-in' as const,
          };
        })
        .filter((record) => record.note.length > 0);
      const triggerNotes: CheckInNote[] = triggers
        .filter((trigger): trigger is Trigger & { followUp: NonNullable<Trigger['followUp']> } =>
          typeof trigger.followUp?.note === 'string' && trigger.followUp.note.trim().length > 0,
        )
        .map((trigger) => ({
          id: trigger.id,
          note: trigger.followUp!.note!.trim(),
          completedAt: trigger.loggedAt,
          source: 'trigger',
        }));
      setNotes(
        [...checkInNotes, ...triggerNotes].sort(
          (first, second) =>
            new Date(second.completedAt).getTime() - new Date(first.completedAt).getTime(),
        ),
      );
    } catch (error) {
      console.error('Unable to load check-in notes from Firestore', error);
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const handleDelete = async (note: CheckInNote) => {
    if (!user) return;

    if (note.source === 'trigger') {
      await deleteTriggerFollowUp(note.id);
    } else {
      await deleteDoc(doc(db, 'users', user.uid, 'check_in_record', note.id));
    }
    setNotes((existingNotes) =>
      existingNotes.filter((existingNote) => existingNote.id !== note.id),
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [loadNotes]),
  );

  useFocusEffect(
    useCallback(() => onAuthStateChanged(auth, setUser), []),
  );

  const scheme = useColorScheme() ?? 'light';
  const gradientColors =
    scheme === 'dark' ? Gradients.dark.darkGradient : Gradients.light.lightGradient;

  return (
    <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
      <ScreenTransition>
        <ScrollView
          contentContainerStyle={{ paddingTop: 64, paddingBottom: 120, flexGrow: 1 }}
          className="px-6"
        >
        <CheckInNotesHeader onBack={() => goBackOrHome(router)} />

        {isLoading ? (
          <View className="items-center mt-24">
            <ActivityIndicator color="#4ade80" />
          </View>
        ) : notes.length === 0 ? (
          <View className="items-center px-10 mt-24">
            <Text className="text-white text-base font-semibold text-center">No notes yet.</Text>
            <Text className="text-emerald-100/40 text-sm mt-2 text-center leading-6">
              Add an optional note at the end of a check-in to see it here.
            </Text>
          </View>
        ) : (
          <View className="mt-6" style={{ gap: 10 }}>
            {notes.map((note) => (
              <CheckInNoteListItem
                key={note.id}
                note={note.note}
                completedAt={note.completedAt}
                onDelete={() => handleDelete(note)}
              />
            ))}
          </View>
        )}
        </ScrollView>
      </ScreenTransition>
    </LinearGradient>
  );
}
