import { TouchableOpacity, View, Text } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { Typography } from '@/constants/typography';
import { HabitatColors } from '@/constants/theme';

type ProgressHeaderProps = {
  onBack?: () => void;
  subtitle?: string;
};

export default function ProgressHeader({
  onBack,
  subtitle = 'A clear view of the work. Missing a day is information, not failure.',
}: ProgressHeaderProps) {
  return (
    <View className="px-6">
      <TouchableOpacity onPress={onBack} activeOpacity={0.7} className="flex-row items-center self-start">
        <ChevronLeft size={17} color={HabitatColors.text} />
        <Text className="ml-1 text-sm font-bold" style={{ color: HabitatColors.text }}>Back</Text>
      </TouchableOpacity>
      <Text className="mt-4" style={[Typography.title, { color: HabitatColors.text }]}>
        Your progress.
      </Text>
      <Text className="mt-2" style={[Typography.subtitle, { color: HabitatColors.muted }]}>
        {subtitle}
      </Text>
    </View>
  );
}
