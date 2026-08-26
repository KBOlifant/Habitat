// Target path: components/Milestones/stats-row.tsx
import { View, Text } from 'react-native';
import { Droplet, Circle, Triangle } from 'lucide-react-native';

type StatsRowProps = {
  streak?: number;
  resisted?: number;
  relapses?: number;
};

export default function StatsRow({
  streak = 0,
  resisted = 0,
  relapses = 0,
}: StatsRowProps) {
  return (
    <View className="flex-row px-6 mt-5" style={{ gap: 10 }}>
      <View className="flex-1 bg-emerald-900/50 border border-emerald-800/50 rounded-2xl py-4 items-center">
        <Droplet size={16} color="#4ade80" />
        <Text className="text-white text-xl font-bold mt-2">{streak}</Text>
        <Text className="text-emerald-100/50 text-xs mt-0.5">Streak</Text>
      </View>

      <View className="flex-1 bg-emerald-900/50 border border-emerald-800/50 rounded-2xl py-4 items-center">
        <Circle size={16} color="#34d399" />
        <Text className="text-white text-xl font-bold mt-2">{resisted}</Text>
        <Text className="text-emerald-100/50 text-xs mt-0.5">Resisted</Text>
      </View>

      <View className="flex-1 bg-emerald-900/50 border border-emerald-800/50 rounded-2xl py-4 items-center">
        <Triangle size={16} color="#f97316" />
        <Text className="text-white text-xl font-bold mt-2">{relapses}</Text>
        <Text className="text-emerald-100/50 text-xs mt-0.5">Relapses</Text>
      </View>
    </View>
  );
}
