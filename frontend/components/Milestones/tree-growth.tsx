import { View, Text } from 'react-native';
import { Typography } from '@/constants/typography';
import {
  Bean,
  Check,
  Leaf,
  Lock,
  Shrub,
  Sprout,
  TreeDeciduous,
  TreePine,
  Trees,
  type LucideIcon,
} from 'lucide-react-native';
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

const STAGE_ICONS: LucideIcon[] = [Bean, Sprout, Leaf, Shrub, TreePine, TreeDeciduous, Trees];

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
      <View className="flex-row items-center">
        <TreeDeciduous size={14} color={HabitatColors.accent} />
        <Text className="ml-2 uppercase" style={[Typography.sectionLabel, { color: HabitatColors.accent }]}>
          Tree growth
        </Text>
      </View>
      <Text className="mb-3 mt-1 text-xl font-semibold" style={{ color: HabitatColors.text }}>
        Seven forms.
      </Text>
      <View className="overflow-hidden rounded-2xl border" style={{ borderColor: HabitatColors.border }}>
        {resolvedStages.map((stage, index) => {
          const isCurrent = stage.state === 'current';
          const isComplete = stage.state === 'complete';
          const StageIcon = STAGE_ICONS[index] ?? Leaf;
          const tileColor = isCurrent
            ? HabitatColors.onHighlight
            : isComplete
              ? HabitatColors.primary
              : HabitatColors.raised;
          const iconColor = isCurrent
            ? HabitatColors.highlight
            : isComplete
              ? HabitatColors.onPrimary
              : HabitatColors.muted;

          return (
            <View
              key={stage.title}
              className="flex-row items-center px-3 py-3"
              style={{
                minHeight: 62,
                backgroundColor: isCurrent ? HabitatColors.highlight : HabitatColors.surface,
                borderBottomWidth: index === resolvedStages.length - 1 ? 0 : 1,
                borderColor: HabitatColors.border,
              }}
            >
              <View
                className="mr-3 h-9 w-9 items-center justify-center rounded-full"
                style={{ backgroundColor: tileColor }}
              >
                <StageIcon size={18} color={iconColor} />
              </View>
              <View className="flex-1">
                <Text
                  className="text-sm font-semibold"
                  style={{ color: isCurrent ? HabitatColors.onHighlight : HabitatColors.text }}
                >
                  {stage.title}
                </Text>
                <Text
                  className="mt-0.5 text-xs"
                  style={{ color: isCurrent ? HabitatColors.onHighlight : HabitatColors.muted }}
                >
                  {stage.subtitle}
                </Text>
              </View>
              {isCurrent && (
                <View className="ml-2 rounded-full px-2.5 py-1" style={{ backgroundColor: HabitatColors.onHighlight }}>
                  <Text className="text-xs font-semibold" style={{ color: HabitatColors.highlight }}>
                    Current
                  </Text>
                </View>
              )}
              {isComplete && <Check size={18} color={HabitatColors.accent} strokeWidth={2.5} />}
              {stage.state === 'locked' && <Lock size={15} color={HabitatColors.muted} />}
            </View>
          );
        })}
      </View>
    </View>
  );
}
