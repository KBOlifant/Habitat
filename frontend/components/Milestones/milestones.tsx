import { ScrollView, View, Text } from 'react-native';
import { Award, CircleCheck, Leaf, Sprout } from 'lucide-react-native';
import { Typography } from '@/constants/typography';
import { HabitatColors } from '@/constants/theme';

const MILESTONES = [
  { title: 'One week', days: 7 },
  { title: 'Two weeks', days: 14 },
  { title: 'Three weeks', days: 21 },
  { title: 'One month', days: 30 },
  { title: 'Two months', days: 60 },
  { title: 'Three months', days: 90 },
];

type MilestonesProps = {
  streakDays?: number;
};

export default function Milestones({ streakDays = 0 }: MilestonesProps) {
  return (
    <View className="mt-5">
      <View className="px-6">
        <View className="flex-row items-center">
          <Award size={14} color={HabitatColors.accent} />
          <Text className="ml-2 uppercase" style={[Typography.sectionLabel, { color: HabitatColors.accent }]}>
            Milestones
          </Text>
        </View>
        <Text className="mb-3 mt-1 text-xl font-semibold" style={{ color: HabitatColors.text }}>
          Proof of practice.
        </Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 10 }}>
        {MILESTONES.map((milestone) => {
          const reached = streakDays >= milestone.days;
          const daysAway = Math.max(0, milestone.days - streakDays);
          return (
            <View
              key={milestone.days}
              className="h-[116px] w-[148px] justify-between rounded-2xl border p-3"
              style={{
                backgroundColor: reached ? HabitatColors.highlight : HabitatColors.surface,
                borderColor: reached ? HabitatColors.highlight : HabitatColors.border,
              }}
            >
              <View className="flex-row items-center justify-between">
                {reached ? (
                  <Sprout size={20} color={HabitatColors.onHighlight} />
                ) : (
                  <Leaf size={20} color={HabitatColors.muted} />
                )}
                {reached && <CircleCheck size={18} color={HabitatColors.onHighlight} />}
              </View>
              <View>
                <Text
                  className="text-sm font-semibold"
                  style={{ color: reached ? HabitatColors.onHighlight : HabitatColors.text }}
                >
                  {milestone.title}
                </Text>
                <Text
                  className="mt-1 text-xs"
                  style={{ color: reached ? HabitatColors.onHighlight : HabitatColors.muted }}
                >
                  {reached ? 'Achieved' : `${daysAway} days away`}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
