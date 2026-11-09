import { TouchableOpacity, View, Text } from 'react-native';
import { ChevronLeft, Plus } from 'lucide-react-native';
import { Typography } from '@/constants/typography';
import { HabitatColors } from '@/constants/theme';

type TriggerLogHeaderProps = {
  onBack?: () => void;
  onAdd?: () => void;
  subtitle?: string;
};

export default function TriggerLogHeader({
  onBack,
  onAdd,
  subtitle = 'Record what happened without shame. Patterns get easier to change when visible.',
}: TriggerLogHeaderProps) {
  return (
    <View>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <TouchableOpacity onPress={onBack} activeOpacity={0.7} className="flex-row items-center self-start">
            <ChevronLeft size={17} color={HabitatColors.text} />
            <Text className="ml-1 text-sm font-bold" style={{ color: HabitatColors.text }}>Back</Text>
          </TouchableOpacity>
          <Text className="mt-4" style={[Typography.title, { color: HabitatColors.text }]}>
            Trigger log.
          </Text>
          <Text className="mt-2" style={[Typography.subtitle, { color: HabitatColors.muted }]}>
            {subtitle}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onAdd}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Log a new trigger"
          className="h-11 w-11 items-center justify-center rounded-full"
          style={{ backgroundColor: HabitatColors.primary }}
        >
          <Plus size={22} color={HabitatColors.onPrimary} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
      <View className="mt-5 h-px" style={{ backgroundColor: HabitatColors.border }} />
    </View>
  );
}
