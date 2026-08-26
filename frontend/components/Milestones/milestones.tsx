// Target path: components/Milestones/milestones.tsx
import { View, Text } from 'react-native';
import { CircleCheck, Sprout, Leaf } from 'lucide-react-native';
import { Typography } from '@/constants/typography';

const HARDCODED_MILESTONES = [
  { title: 'First day', days: 1 },
  { title: '3 days', days: 3 },
  { title: 'One week', days: 7 },
  { title: 'Three weeks', days: 21 },
  { title: 'One Month', days: 30 },
  { title: '3 Months', days: 90 },
  { title: '6 Months', days: 180 },
  { title: '1 Year', days: 365 },
  { title: '3 Years', days: 1095 },
  { title: '5 Years', days: 1825 },
];

function formatDaysAway(days: number): string {
  if (days <= 1) return '1 day away';
  if (days < 30) return `${days} days away`;
  if (days < 365) return `${Math.round(days / 30)} months away`;
  return `${(days / 365).toFixed(1).replace('.0', '')} years away`;
}

type MilestonesProps = {
  /** Current unbroken streak in days — same number shown in StatsRow/Tree Growth. */
  streakDays?: number;
};

export default function Milestones({ streakDays = 0 }: MilestonesProps) {
  return (
    <View className="mx-6 mt-5 mb-6 bg-emerald-900/40 border border-emerald-800/50 rounded-2xl p-5">
      <Text className="text-emerald-100/50 uppercase mb-3" style={Typography.sectionLabel}>
        Milestones
      </Text>

      {HARDCODED_MILESTONES.map((milestone) => {
        const isAchieved = streakDays >= milestone.days;
        const daysRemaining = milestone.days - streakDays;
        const subtitle = isAchieved
          ? undefined
          : formatDaysAway(Math.max(1, daysRemaining));

        return (
          <View
            key={milestone.title}
            className="flex-row items-center justify-between bg-emerald-950/40 rounded-2xl px-4 py-3.5 mb-3 last:mb-0"
          >
            <View className="flex-row items-center flex-1">
              {isAchieved ? (
                <Sprout size={16} color="#4ade80" />
              ) : (
                <Leaf size={16} color="#3f5a44" />
              )}

              <View className="ml-3 flex-1 pr-2">
                <Text
                  className={`text-base font-semibold ${
                    isAchieved ? 'text-white' : 'text-emerald-100/70'
                  }`}
                >
                  {milestone.title}
                </Text>
                {subtitle && (
                  <Text className="text-emerald-100/40 text-sm mt-0.5">
                    {subtitle}
                  </Text>
                )}
              </View>
            </View>

            {isAchieved && <CircleCheck size={18} color="#4ade80" />}
          </View>
        );
      })}
    </View>
  );
}
