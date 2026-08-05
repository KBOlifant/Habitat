import { View, Text } from 'react-native';
import { Check, Circle } from 'lucide-react-native';

export type TreeStage = {
  title: string;
  subtitle: string;
  state: 'complete' | 'current' | 'locked';
};

type TreeGrowthProps = {
  stages?: TreeStage[];
};

const DEFAULT_STAGES: TreeStage[] = [
  { title: 'Dormant seed', subtitle: 'Day 0', state: 'complete' },
  { title: 'First sprout', subtitle: '1+ days', state: 'current' },
  { title: 'Taking root', subtitle: '3+ days', state: 'locked' },
  { title: 'Young sapling', subtitle: '7+ days', state: 'locked' },
  { title: 'Growing bonsai', subtitle: '14+ days', state: 'locked' },
  { title: 'Formed bonsai', subtitle: '30+ days', state: 'locked' },
  { title: 'Ancient wisdom', subtitle: '60+ days', state: 'locked' },
];

function StageIcon({ state }: { state: TreeStage['state'] }) {
  if (state === 'complete') {
    return (
      <View className="w-6 h-6 rounded-full bg-emerald-500 items-center justify-center">
        <Check size={14} color="#052e16" strokeWidth={3} />
      </View>
    );
  }
  if (state === 'current') {
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

export default function TreeGrowth({ stages = DEFAULT_STAGES }: TreeGrowthProps) {
  return (
    <View className="mx-6 mt-5 bg-emerald-900/40 border border-emerald-800/50 rounded-2xl p-5">
      <Text className="text-emerald-100/50 text-xs font-semibold tracking-[2px] uppercase mb-4">
        Tree Growth
      </Text>

      {stages.map((stage, index) => {
        const isLocked = stage.state === 'locked';
        return (
          <View
            key={stage.title}
            className={`flex-row items-center ${index === 0 ? '' : 'mt-4'}`}
          >
            <StageIcon state={stage.state} />

            <View className="flex-1 ml-3">
              <Text
                className={`text-sm font-semibold ${
                  isLocked ? 'text-emerald-100/35' : 'text-white'
                }`}
              >
                {stage.title}
              </Text>
              <Text
                className={`text-xs mt-0.5 ${
                  isLocked ? 'text-emerald-100/25' : 'text-emerald-100/50'
                }`}
              >
                {stage.subtitle}
              </Text>
            </View>

            {stage.state === 'current' && (
              <View className="bg-emerald-700/50 border border-emerald-600/50 rounded-full px-2.5 py-1">
                <Text className="text-emerald-200 text-[10px] font-semibold">
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
