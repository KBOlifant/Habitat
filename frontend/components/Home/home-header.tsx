import { View, Text } from 'react-native';
import { Flame } from 'lucide-react-native';

type HomeHeaderProps = {
  userName?: string;
  streakDays?: number;
  smokeFreeDays?: number;
};

export default function HomeHeader({
  userName = 'User',
  streakDays = 3,
  smokeFreeDays = 3,
}: HomeHeaderProps) {
  return (
    <View className="flex-row items-start justify-between">
      <View>
        <Text className="text-emerald-100/60 text-xs font-semibold tracking-[3px] uppercase">
          Good Evening
        </Text>
        <Text className="text-white text-3xl font-bold mt-1">{userName}</Text>
        <Text className="text-emerald-100/70 text-sm mt-1">
          {smokeFreeDays} Days Free From Smoking
        </Text>
      </View>

      <View className="flex-row items-center bg-emerald-900/70 border border-emerald-800 rounded-full px-3 py-1.5 mt-1">
        <Flame size={14} color="#fb923c" fill="#fb923c" />
        <Text className="text-white text-xs font-semibold ml-1.5">
          Day {streakDays}
        </Text>
      </View>
    </View>
  );
}