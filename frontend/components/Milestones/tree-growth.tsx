// Target path: components/Milestones/tree-growth.tsx
import { View, Text } from 'react-native';
import { Typography } from '@/constants/typography';
import { Check, Circle } from 'lucide-react-native';

export type TreeStageState = 'complete' | 'current' | 'locked';

export type TreeStage = {
  title: string;
  subtitle: string;
  state: TreeStageState;
};

const STAGE_DEFINITIONS: { title: string; subtitle: string; threshold: number }[] = [
  { title: 'Dormant seed', subtitle: 'Day 0', threshold: 0 },
  { title: 'First sprout', subtitle: '1+ days', threshold: 1 },
  { title: 'Young sapling', subtitle: '7+ days', threshold: 7 },
  { title: 'Juvenile bonsai', subtitle: '14+ days', threshold: 14 },
  { title: 'Mature bonsai', subtitle: '30+ days', threshold: 30 },
  { title: 'Ancient wisdom', subtitle: '90+ days', threshold: 90 },
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
  /** Current unbroken streak in days — same number shown in StatsRow/Milestones. Drives which stage is "current". */
  streakDays?: number;
  /** Escape hatch to render an explicit set of stages instead of deriving them from streakDays. */
  stages?: TreeStage[];
};

function StageIcon({ state }: { state: TreeStage['state'] }) {
  if (state === 'complete' || state === 'current') {
    return (
      <View className="w-6 h-6 rounded-full bg-emerald-500 items-center justify-center">
        <Check size={14} color="#052e16" strokeWidth={3} />
      </View>
    );
  }
  return (
    <View className="w-6 h-6 rounded-full border border-emerald-800/60 items-center justify-center">
      <Circle size={8} color="#3f5a44" fill="#3f5a44" />
    </View>
  );
}

export default function TreeGrowth({ streakDays = 0, stages }: TreeGrowthProps) {
  const resolvedStages = stages ?? computeStages(streakDays);

  return (
    <View className="mx-6 mt-5 bg-emerald-900/40 border border-emerald-800/50 rounded-2xl p-5">
      <Text className="text-emerald-100/50 uppercase mb-4" style={Typography.sectionLabel}>
        Tree Growth
      </Text>

      {resolvedStages.map((stage, index) => {
        const isLocked = stage.state === 'locked';
        return (
          <View
            key={stage.title}
            className={`flex-row items-center ${index === 0 ? '' : 'mt-4'}`}
          >
            <StageIcon state={stage.state} />

            <View className="flex-1 ml-3">
              <Text
                className={`text-base font-semibold ${
                  isLocked ? 'text-emerald-100/35' : 'text-white'
                }`}
              >
                {stage.title}
              </Text>
              <Text
                className={`text-sm mt-0.5 ${
                  isLocked ? 'text-emerald-100/25' : 'text-emerald-100/50'
                }`}
              >
                {stage.subtitle}
              </Text>
            </View>

            {stage.state === 'current' && (
              <View className="bg-emerald-700/50 border border-emerald-600/50 rounded-full px-2.5 py-1">
                <Text className="text-emerald-200 text-xs font-semibold">
                  Current
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}
