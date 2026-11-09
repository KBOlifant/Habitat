import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { Typography } from '@/constants/typography';
import { HabitatColors } from '@/constants/theme';

type CheckInNotesHeaderProps = { onBack: () => void };

export default function CheckInNotesHeader({ onBack }: CheckInNotesHeaderProps) {
  return (
    <View>
      <TouchableOpacity
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        className="flex-row items-center self-start"
      >
        <ChevronLeft size={16} color={HabitatColors.text} />
        <Text className="ml-0.5 text-sm font-bold" style={{ color: HabitatColors.text }}>Back</Text>
      </TouchableOpacity>
      <Text className="mt-3" style={[Typography.title, { color: HabitatColors.text }]}>Field notes.</Text>
      <Text className="mt-1" style={[Typography.subtitle, { color: HabitatColors.muted }]}>
        A record of what you noticed.
      </Text>
    </View>
  );
}