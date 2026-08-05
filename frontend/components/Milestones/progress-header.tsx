import { TouchableOpacity, View, Text } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

type ProgressHeaderProps = {
  onBack?: () => void;
  subtitle?: string;
};

export default function ProgressHeader({
  onBack,
  subtitle = 'Your journey, made visible.',
}: ProgressHeaderProps) {
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

      <Text className="text-white text-3xl font-bold mt-3">Progress</Text>
      <Text className="text-emerald-100/60 text-sm mt-1">{subtitle}</Text>
    </View>
  );
}
