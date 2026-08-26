import { TouchableOpacity, View, Text } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { Typography } from '@/constants/typography';

type HabitSelectHeaderProps = {
  onBack?: () => void;
  userName?: string;
  subtitle?: string;
};

export default function HabitSelectHeader({
  onBack,
  userName = 'User',
  subtitle = 'Your bonsai will grow as you stay free.',
}: HabitSelectHeaderProps) {
  return (
    <View className="px-6">
      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.7}
        className="flex-row items-center self-start"
      >
        <ChevronLeft size={16} color="#d1e7d4" />
        <Text className="text-emerald-100/80 text-sm ml-0.5">Back</Text>
      </TouchableOpacity>

      <Text className="text-white mt-4" style={Typography.title}>
        What habit are{'\n'}you breaking, {userName}?
      </Text>
      <Text className="text-emerald-100/60 mt-2" style={Typography.subtitle}>{subtitle}</Text>
    </View>
  );
}
