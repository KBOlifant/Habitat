import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { Typography } from '@/constants/typography';

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
        <ChevronLeft size={16} color="#d1e7d4" />
        <Text className="ml-0.5 text-sm text-emerald-100/80">Back</Text>
      </TouchableOpacity>
      <Text className="mt-3 text-white" style={Typography.title}>Check-In Notes</Text>
      <Text className="mt-1 text-emerald-100/60" style={Typography.subtitle}>
        A record of what you noticed.
      </Text>
    </View>
  );
}