import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'react-native';
import { Gradients } from '@/constants/theme';

import './global.css';
import HabitSelectHeader from '@/components/Onboarding2/habit-select-header';
import HabitGrid from '@/components/Onboarding2/habit-grid';
import OtherHabitInput from '@/components/Onboarding2/other-habit-input';
import PlantSeedButton from '@/components/Onboarding2/plant-seed-button';

const HABIT_KEY = 'habitat_user_habit';

export default function HabitSelectScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [otherHabit, setOtherHabit] = useState('');
  const scheme = useColorScheme() ?? 'light';
  const gradientColors =
    scheme === 'dark' ? Gradients.dark.darkGradient : Gradients.light.lightGradient;

  const isOtherSelected = selected === 'other';
  const canContinue = isOtherSelected ? otherHabit.trim().length > 0 : !!selected;

  const handlePlantSeed = async () => {
    const habit = isOtherSelected ? otherHabit.trim() : selected;

    if (!habit) {
      return;
    }

    await SecureStore.setItemAsync(HABIT_KEY, habit);
    router.replace('/home');
  };

  return (
    <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
      <ScrollView
        className="px-6"
        contentContainerStyle={{ paddingTop: 64, paddingBottom: 40, flexGrow: 1 }}
      >
        <HabitSelectHeader onBack={() => router.back()} />

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

        <PlantSeedButton onPress={handlePlantSeed} disabled={!canContinue} />

        <View className="h-10" />
      </ScrollView>
    </LinearGradient>
  );
}
