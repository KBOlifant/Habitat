import { View, Text } from 'react-native';
import { Typography } from '@/constants/typography';
import { Check } from 'lucide-react-native';
import { HabitatColors } from '@/constants/theme';

export type TreeStageState = 'complete' | 'current' | 'locked';

export type TreeStage = {
  title: string;
  subtitle: string;
  state: TreeStageState;
};

const STAGE_DEFINITIONS: { title: string; subtitle: string; threshold: number }[] = [
  { title: 'Dormant seed', subtitle: 'Starting point', threshold: 0 },
  { title: 'First sprout', subtitle: '1+ days', threshold: 1 },
  { title: 'Taking root', subtitle: '3+ days', threshold: 3 },
  { title: 'Young sapling', subtitle: '7+ days', threshold: 7 },
  { title: 'Growing bonsai', subtitle: '14+ days', threshold: 14 },
  { title: 'Formed bonsai', subtitle: '30+ days', threshold: 30 },
  { title: 'Ancient wisdom', subtitle: '60+ days', threshold: 60 },
];

function computeStages(streakDays: number): TreeStage[] {
  let currentIndex = 0;
  STAGE_DEFINITIONS.forEach((stage, index) => {
    if (streakDays >= stage.threshold) currentIndex = index;
  });
  return STAGE_DEFINITIONS.map((stage, index) => ({
    title: stage.title,
    subtitle: stage.subtitle,
    state: index < currentIndex ? 'complete' : index === currentIndex ? 'current' : 'locked',
  }));
}

type TreeGrowthProps = {
  streakDays?: number;
  stages?: TreeStage[];
};

export default function TreeGrowth({ streakDays = 0, stages }: TreeGrowthProps) {
  const resolvedStages = stages ?? computeStages(streakDays);

  return (
    <View className="mx-6 mt-5">
      <Text className="uppercase" style={[Typography.sectionLabel, { color: HabitatColors.green }]}>
        Tree growth
      </Text>
      <Text className="mb-3 mt-1 text-xl font-black uppercase" style={{ color: HabitatColors.ink }}>
        Seven forms.
      </Text>
      <View className="border-2" style={{ borderColor: HabitatColors.ink }}>
        {resolvedStages.map((stage, index) => {
          const isCurrent = stage.state === 'current';
          const isComplete = stage.state === 'complete';
          return (
            <View
              key={stage.title}
              className="flex-row items-center px-3 py-3"
              style={{
                minHeight: 62,
                backgroundColor: isCurrent ? HabitatColors.lime : HabitatColors.surface,
                borderBottomWidth: index === resolvedStages.length - 1 ? 0 : 2,
                borderColor: HabitatColors.ink,
              }}
            >
              <View
                className="mr-3 h-8 w-8 items-center justify-center border-2"
                style={{
                  backgroundColor: isComplete ? HabitatColors.green : 'transparent',
                  borderColor: HabitatColors.ink,
                }}
              >
                {isComplete ? (
                  <Check size={17} color={HabitatColors.surface} strokeWidth={3} />
                ) : (
                  <Text className="text-xs font-black" style={{ color: HabitatColors.ink }}>
                    {index + 1}
                  </Text>
                )}
              </View>
              <View className="flex-1">
                <Text className="text-sm font-black uppercase" style={{ color: HabitatColors.ink }}>
                  {stage.title}
                </Text>
                <Text className="mt-0.5 text-xs" style={{ color: HabitatColors.muted }}>
                  {stage.subtitle}
                </Text>
              </View>
              {isCurrent && (
                <Text className="ml-2 text-[9px] font-black uppercase" style={{ color: HabitatColors.ink }}>
                  Current
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
