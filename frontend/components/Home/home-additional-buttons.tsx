import { TouchableOpacity, View, Text } from 'react-native';
import { Link } from 'expo-router';
import { TriangleAlert, BarChart3 } from 'lucide-react-native';

type HomeAdditionalButtonsProps = {
  triggerStreakDays?: number;
};

export default function AdditionalButtons({
  triggerStreakDays = 1,
}: HomeAdditionalButtonsProps) {
  return (
    <View className="mt-5">
      {/* Log Trigger / Progress row */}
      <View className="flex-row" style={{ gap: 12 }}>
        <Link href="/triggers" asChild>
          <TouchableOpacity
            activeOpacity={0.85}
            className="flex-1 bg-emerald-900/60 border border-emerald-800/60 rounded-2xl p-4"
          >
            <TriangleAlert size={18} color="#eab308" />
            <Text className="text-white font-semibold text-sm mt-2">
              Log Trigger
            </Text>
            <Text className="text-emerald-100/60 text-xs mt-0.5">
              Track what sets you off
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/" asChild>
          <TouchableOpacity
            activeOpacity={0.85}
            className="flex-1 bg-emerald-900/60 border border-emerald-800/60 rounded-2xl p-4"
          >
            <BarChart3 size={18} color="#a3e635" />
            <Text className="text-white font-semibold text-sm mt-2">
              Progress
            </Text>
            <Text className="text-emerald-100/60 text-xs mt-0.5">
              {triggerStreakDays}-day streak
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

    </View>
  );
}