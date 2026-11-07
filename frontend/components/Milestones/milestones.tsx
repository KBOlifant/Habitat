import { ScrollView, View, Text } from 'react-native';
import { Award, Check } from 'lucide-react-native';
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
        <Text className="uppercase" style={[Typography.sectionLabel, { color: HabitatColors.green }]}>
          Milestones
        </Text>
        <Text className="mb-3 mt-1 text-xl font-black uppercase" style={{ color: HabitatColors.ink }}>
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
              className="h-[116px] w-[148px] justify-between border-2 p-3"
              style={{
                backgroundColor: reached ? HabitatColors.lime : HabitatColors.pale,
                borderColor: HabitatColors.ink,
              }}
            >
              {reached ? (
                <Check size={19} color={HabitatColors.green} strokeWidth={3} />
              ) : (
                <Award size={19} color={HabitatColors.muted} />
              )}
              <View>
                <Text className="text-sm font-black uppercase" style={{ color: HabitatColors.ink }}>
                  {milestone.title}
                </Text>
                <Text className="mt-1 text-xs" style={{ color: HabitatColors.muted }}>
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
