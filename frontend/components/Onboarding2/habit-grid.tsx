import { TouchableOpacity, View, Text } from 'react-native';

export const DEFAULT_HABITS = [
  'Smoking',
  'Social media',
  'Alcohol',
  'Sugar',
  'Gambling',
  'Shopping',
  'Nail biting',
  'Caffeine',
  'Procrastinating',
  'Vaping',
];

type HabitGridProps = {
  habits?: string[];
  selected: string | null;
  onSelect: (habit: string) => void;
};

export default function HabitGrid({
  habits = DEFAULT_HABITS,
  selected,
  onSelect,
}: HabitGridProps) {
  return (
    <View className="px-6 mt-6 flex-row flex-wrap" style={{ gap: 10 }}>
      {habits.map((habit) => {
        const isSelected = selected === habit;
        return (
          <TouchableOpacity
            key={habit}
            onPress={() => onSelect(habit)}
            activeOpacity={0.85}
            className={`rounded-2xl py-4 items-center justify-center ${
              isSelected ? 'bg-lime-600' : 'bg-[#a9b596]'
            }`}
            style={{ width: '47%' }}
          >
            <Text
              className={`text-base font-medium ${
                isSelected ? 'text-emerald-950' : 'text-[#2f3a2a]'
              }`}
            >
              {habit}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
