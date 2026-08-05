import { View, Text } from 'react-native';
import { CircleCheck, Sprout, Leaf } from 'lucide-react-native';

export type Milestone = {
  title: string;
  subtitle?: string;
  achieved: boolean;
};

type MilestonesProps = {
  milestones?: Milestone[];
};

const DEFAULT_MILESTONES: Milestone[] = [
  { title: 'First day', achieved: true },
  { title: '3 days', subtitle: '2 days away', achieved: false },
  { title: 'One week', subtitle: '6 days away', achieved: false },
];

export default function Milestones({
  milestones = DEFAULT_MILESTONES,
}: MilestonesProps) {
  return (
    <View className="mx-6 mt-5 mb-6 bg-emerald-900/40 border border-emerald-800/50 rounded-2xl p-5">
      <Text className="text-emerald-100/50 text-xs font-semibold tracking-[2px] uppercase mb-3">
        Milestones
      </Text>

      {milestones.map((milestone, index) => (
        <View
          key={milestone.title}
          className={`flex-row items-center justify-between bg-emerald-950/40 rounded-2xl px-4 py-3.5 ${
            index === 0 ? '' : 'mt-3'
          }`}
        >
          <View className="flex-row items-center flex-1">
            {milestone.achieved ? (
              <Sprout size={16} color="#4ade80" />
            ) : (
              <Leaf size={16} color="#3f5a44" />
            )}

            <View className="ml-3">
              <Text
                className={`text-sm font-semibold ${
                  milestone.achieved ? 'text-white' : 'text-emerald-100/70'
                }`}
              >
                {milestone.title}
              </Text>
              {milestone.subtitle && (
                <Text className="text-emerald-100/40 text-xs mt-0.5">
                  {milestone.subtitle}
                </Text>
              )}
            </View>
          </View>

          {milestone.achieved && <CircleCheck size={18} color="#4ade80" />}
        </View>
      ))}
    </View>
  );
}
