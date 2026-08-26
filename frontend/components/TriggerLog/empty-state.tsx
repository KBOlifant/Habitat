import { View, Text } from 'react-native';
import { Shield } from 'lucide-react-native';

type EmptyStateProps = {
  title?: string;
  subtitle?: string;
};

export default function EmptyState({
  title = 'No triggers logged yet.',
  subtitle = 'When urges arise, log them here. Awareness heals.',
}: EmptyStateProps) {
  return (
    <View className="items-center px-10 mt-24">
      <Shield size={32} color="#5c6b52" strokeWidth={1.5} />

      <Text className="text-white text-base font-semibold mt-5 text-center">
        {title}
      </Text>
      <Text className="text-emerald-100/40 text-sm mt-2 text-center leading-6">
        {subtitle}
      </Text>
    </View>
  );
}
