import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';

import '../global.css';
import HabitSelectHeader from '../../components/Onboarding2/habit-select-header';
import HabitGrid from '../../components/Onboarding2/habit-grid';
import OtherHabitInput from '../../components/Onboarding2/other-habit-input';
import PlantSeedButton from '../../components/Onboarding2/plant-seed-button';

export default function HabitSelectScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [otherHabit, setOtherHabit] = useState('');

  const isOtherSelected = selected === 'other';
  const canContinue = isOtherSelected ? otherHabit.trim().length > 0 : !!selected;

  const handlePlantSeed = () => {
    const habit = isOtherSelected ? otherHabit.trim() : selected;
    // persist `habit`, then advance to the next onboarding step
    // router.push('/onboarding/next-step');
  };

  return (
    <ScrollView
      className="bg-emerald-950"
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
  );
}
