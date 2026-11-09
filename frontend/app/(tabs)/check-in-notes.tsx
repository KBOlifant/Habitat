import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import '../global.css';
import { HabitatColors } from '@/constants/theme';
import { observeAuthState, type AuthUser } from '../../functions/auth';
import { getCheckInNotes, deleteCheckIn } from '../../functions/swipes';
import { goBackOrHome } from '../../lib/navigation';
import CheckInNotesHeader from '../../components/CheckInScreen/check-in-notes-header';
import CheckInNoteListItem from '../../components/CheckInScreen/check-in-note-list-item';
import ScreenTransition from '../../components/General/screen-transition';
import { getTriggers, deleteTriggerFollowUp, type Trigger } from '../../functions/triggers';

type CheckInNote = {
  id: string;
  note: string;
  completedAt: string;
  source: 'check-in' | 'trigger';
};

export default function CheckInNotesScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [user, setUser] = useState<AuthUser | null>(null);
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
        getCheckInNotes(user.uid),
        getTriggers(user.uid),
      ]);
      const checkInNotes: CheckInNote[] = checkInSnapshot.map((record) => ({
        ...record,
        source: 'check-in',
      }));
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
      await deleteTriggerFollowUp(user.uid, note.id);
    } else {
      await deleteCheckIn(user.uid, note.id);
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
    useCallback(() => observeAuthState(setUser), []),
  );

  return (
    <View style={{ flex: 1, backgroundColor: HabitatColors.canvas }}>
      <ScreenTransition>
        <ScrollView
          contentContainerStyle={{ paddingTop: isLandscape ? 24 : 64, paddingBottom: isLandscape ? 24 : 120, flexGrow: 1 }}
          className="px-6"
        >
        <View style={{ flex: 1, flexDirection: isLandscape ? 'row' : 'column', gap: 24 }}>
          <View style={isLandscape ? { width: '32%' } : undefined}>
            <CheckInNotesHeader onBack={() => goBackOrHome(router)} />
          </View>

          <View style={isLandscape ? { flex: 1 } : undefined}>
            {isLoading ? (
              <View className="items-center mt-24">
                <ActivityIndicator color={HabitatColors.accent} />
              </View>
            ) : notes.length === 0 ? (
              <View className="items-center px-10 mt-24">
                <Text className="text-center text-base font-semibold" style={{ color: HabitatColors.text }}>No notes yet.</Text>
                <Text className="mt-2 text-center text-sm leading-6" style={{ color: HabitatColors.muted }}>
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
          </View>
        </View>
        </ScrollView>
      </ScreenTransition>
    </View>
  );
}
