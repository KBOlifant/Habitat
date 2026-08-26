import { TouchableOpacity, View, Text } from 'react-native';
import { Sparkles, ChevronRight } from 'lucide-react-native';
import { Link } from 'expo-router';

type CheckInButtonProps = {
  cardsAwait?: number;
  href?: string;
};

export default function CheckInButton({
  cardsAwait = 5,
  href = '/check-in',
}: CheckInButtonProps) {
  return (
    <Link href={href as any} asChild>
      <TouchableOpacity
        activeOpacity={0.85}
        className="mt-5 bg-[#c9a281] rounded-2xl px-5 py-4 flex-row items-center justify-between"
      >
        <View className="flex-row items-center flex-1">
          <View className="w-9 h-9 rounded-full bg-black/10 items-center justify-center mr-3">
            <Sparkles size={18} color="#2f2a24" />
          </View>
          <View>
            <Text className="text-[#2f2a24] font-bold text-base">
              Daily Check-in
            </Text>
            <Text className="text-[#2f2a24]/70 text-sm mt-0.5">
              {cardsAwait} mindfulness cards await
            </Text>
          </View>
        </View>

        <ChevronRight size={20} color="#2f2a24" />
      </TouchableOpacity>
    </Link>
  );
}