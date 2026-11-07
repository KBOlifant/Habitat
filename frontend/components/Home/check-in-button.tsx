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
        className="mt-4 flex-row items-center justify-between border-2 px-4 py-4"
        style={{
          backgroundColor: HabitatColors.lime,
          borderColor: HabitatColors.ink,
          shadowColor: HabitatColors.ink,
          shadowOffset: { width: 3, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 0,
        }}
      >
        <View className="flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center border-2" style={{ borderColor: HabitatColors.ink }}>
            {completed ? (
              <CircleCheck size={21} color={HabitatColors.ink} />
            ) : (
              <Sparkles size={20} color={HabitatColors.ink} />
            )}
          </View>
          <View>
            <Text className="text-sm font-black uppercase" style={{ color: HabitatColors.ink }}>
              {completed ? 'Check-in complete' : 'Daily check-in'}
            </Text>
            <Text className="mt-0.5 text-xs font-medium" style={{ color: HabitatColors.ink }}>
              {completed ? 'Your tree has what it needs today.' : `${cardsAwait} minutes to pause`}
            </Text>
          </View>
        </View>
        <ArrowRight size={20} color={HabitatColors.ink} />
      </TouchableOpacity>
    </Link>
  );
}
