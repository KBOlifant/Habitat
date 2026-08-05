import { View, Text } from 'react-native';

type TodaysReflectionProps = {
  quote?: string;
};

export default function TodaysReflection({
  quote = 'Patience is not passive waiting. It is active acceptance of the process required to attain your goals.',
}: TodaysReflectionProps) {
  return (
    <View className="mt-4 bg-emerald-900/40 border border-emerald-800/50 rounded-2xl p-5">
      <Text className="text-emerald-100/50 text-xs font-semibold tracking-[2px] uppercase">
        Today&apos;s Reflection
      </Text>
      <Text className="text-white italic text-[15px] leading-6 mt-3">
        {quote}
      </Text>
    </View>
  );
}