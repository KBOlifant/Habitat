import { TouchableOpacity, View, Text } from 'react-native';
import { ChevronLeft, Plus } from 'lucide-react-native';

type TriggerLogHeaderProps = {
  onBack?: () => void;
  onAdd?: () => void;
  subtitle?: string;
};

export default function TriggerLogHeader({
  onBack,
  onAdd,
  subtitle = 'Awareness is the first step.',
}: TriggerLogHeaderProps) {
  return (
    <View className="">
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            className="flex-row items-center self-start"
          >
            <ChevronLeft size={16} color="#d1e7d4" />
            <Text className="text-emerald-100/80 text-sm ml-0.5">Back</Text>
          </TouchableOpacity>

          <Text className="text-white text-3xl font-bold mt-3">
            Trigger Log
          </Text>
          <Text className="text-emerald-100/60 text-sm mt-1">{subtitle}</Text>
        </View>

        <TouchableOpacity
          onPress={onAdd}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Log a new trigger"
          className="w-11 h-11 rounded-full bg-lime-600 items-center justify-center"
        >
          <Plus size={22} color="#052e16" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
}