import { TouchableOpacity, View, Text } from 'react-native';
import { Link } from 'expo-router';
import { ArrowRight, CircleCheck, Sparkles } from 'lucide-react-native';
import { HabitatColors } from '@/constants/theme';

type CheckInButtonProps = {
  completed?: boolean;
  cardsAwait?: number;
  href?: string;
};

export default function CheckInButton({
  completed = false,
  cardsAwait = 4,
  href = '/check-in',
}: CheckInButtonProps) {
  return (
    <Link href={href as never} asChild>
      <TouchableOpacity
        activeOpacity={0.85}
        className="mt-4 flex-row items-center justify-between rounded-full px-5 py-4"
        style={{
          backgroundColor: HabitatColors.highlight,
        }}
      >
        <View className="flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(43, 47, 34, 0.12)' }}>
            {completed ? (
              <CircleCheck size={21} color={HabitatColors.onHighlight} />
            ) : (
              <Sparkles size={20} color={HabitatColors.onHighlight} />
            )}
          </View>
          <View>
            <Text className="text-base font-semibold" style={{ color: HabitatColors.onHighlight }}>
              {completed ? 'Check-in complete' : 'Daily check-in'}
            </Text>
            <Text className="mt-0.5 text-sm font-medium" style={{ color: HabitatColors.onHighlight }}>
              {completed ? 'Your tree has what it needs today.' : `${cardsAwait} minutes to pause`}
            </Text>
          </View>
        </View>
        <ArrowRight size={20} color={HabitatColors.onHighlight} />
      </TouchableOpacity>
    </Link>
  );
}
