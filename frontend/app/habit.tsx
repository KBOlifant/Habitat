import { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Gradients } from '@/constants/theme';

import './global.css';
import HabitSelectHeader from '@/components/Onboarding2/habit-select-header';
import HabitGrid from '@/components/Onboarding2/habit-grid';
import OtherHabitInput from '@/components/Onboarding2/other-habit-input';
import PlantSeedButton from '@/components/Onboarding2/plant-seed-button';
import { getCurrentUser } from '../functions/auth';
import { createHabit } from '../functions/users';
import { goBackOrHome } from '../lib/navigation';

export default function HabitSelectScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [otherHabit, setOtherHabit] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const isOtherSelected = selected === 'other';
  const canContinue = !isSaving && (isOtherSelected ? otherHabit.trim().length > 0 : !!selected);

  const handlePlantSeed = async () => {
    if (isSaving) {
      return;
    }

    setSaveError(null);

    const habit = isOtherSelected ? otherHabit.trim() : selected;

    if (!habit) {
      setSaveError('Please choose a habit before continuing.');
      console.log('No habit selected; aborting Firestore write.');
      return;
    }

    const user = getCurrentUser();
    console.log('Attempting to save habit for uid:', user?.uid ?? 'none');

    if (!user) {
      setSaveError('You need to be signed in before saving a habit.');
      console.warn('No authenticated user found. Redirecting to auth.');
      router.replace('/auth');
      return;
    }

    setIsSaving(true);

    try {
      console.log('Writing to Firestore:', {
        uid: user.uid,
        addiction: habit,
        collectionPath: `users/${user.uid}/addiction_record`,
      });

      await createHabit(user.uid, habit);
      router.replace('/home');
    } catch (error) {
      const err = error as { code?: string; message?: string };
      const message =
        err?.message ?? 'Something went wrong while saving your habit. Please try again.';

      setSaveError(message);

      console.error('Error adding document: ', {
        code: err?.code,
        message: err?.message,
        raw: error,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <LinearGradient colors={Gradients.dark.darkGradient} style={{ flex: 1 }}>
      <ScrollView
        className="px-6"
        contentContainerStyle={{ paddingTop: 64, paddingBottom: 40, flexGrow: 1 }}
      >
        <HabitSelectHeader onBack={() => goBackOrHome(router)} />

        <HabitGrid
          selected={isOtherSelected ? null : selected}
          onSelect={(habit) => setSelected(habit)}
        />

        <OtherHabitInput
          isSelected={isOtherSelected}
          value={otherHabit}
          onChangeText={setOtherHabit}
          onSelect={() => setSelected('other')}
        />

        <View className="flex-1" />

        <PlantSeedButton
          onPress={handlePlantSeed}
          disabled={!canContinue}
          label={isSaving ? 'Saving...' : 'Plant my seed'}
        />

        {saveError ? (
          <Text className="mt-4 text-center text-sm text-red-200">{saveError}</Text>
        ) : null}

        <View className="h-10" />
      </ScrollView>
    </LinearGradient>
  );
}
