import { View, Text } from 'react-native';
import { Shield } from 'lucide-react-native';
import { HabitatColors } from '@/constants/theme';

type EmptyStateProps = {
  title?: string;
  subtitle?: string;
};

export default function EmptyState({
  title = 'No triggers logged yet.',
  subtitle = 'When urges arise, log them here. Awareness heals.',
}: EmptyStateProps) {
  return (
    <View className="mx-6 mt-10 items-center rounded-2xl border px-6 py-10" style={{ backgroundColor: HabitatColors.surface, borderColor: HabitatColors.border }}>
      <Shield size={32} color={HabitatColors.accent} strokeWidth={1.5} />

      <Text className="mt-5 text-center text-base font-semibold" style={{ color: HabitatColors.text }}>
        {title}
      </Text>
      <Text className="mt-2 text-center text-sm leading-6" style={{ color: HabitatColors.muted }}>
        {subtitle}
      </Text>
    </View>
  );
}
