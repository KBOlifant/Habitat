import { View, Text, Pressable } from 'react-native';
import { Flame, LogOut } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { signOutUser } from '@/functions/auth';
import { Typography } from '@/constants/typography';
import { HabitatColors } from '@/constants/theme';

type HomeHeaderProps = {
  userName?: string;
  streakDays?: number;
  habitFreeDays?: number;
  habitName?: string;
};

export default function HomeHeader({
  userName = 'Friend',
  streakDays = 0,
  habitFreeDays = streakDays,
  habitName = 'your habit',
}: HomeHeaderProps) {
  const router = useRouter();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const handleLogout = async () => {
    try {
      await signOutUser();
      router.replace('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View className="flex-row items-start">
      <View className="flex-1 pr-3">
        <View
          className="flex-row items-center justify-between border-b-2 pb-3"
          style={{ borderColor: HabitatColors.ink }}
        >
          <Text style={{ color: HabitatColors.ink, fontSize: 19, fontWeight: '900', letterSpacing: 0.5 }}>
            ROOTS.
          </Text>
          <View className="flex-row items-center">
            <Flame size={16} color={HabitatColors.ink} fill={HabitatColors.lime} />
            <Text className="ml-1.5" style={{ color: HabitatColors.ink, fontSize: 12, fontWeight: '900' }}>
              {streakDays} DAY{streakDays === 1 ? '' : 'S'}
            </Text>
          </View>
        </View>
        <Text
          className="mt-5 uppercase"
          style={{ color: HabitatColors.green, fontSize: 12, fontWeight: '900', letterSpacing: 2 }}
        >
          {greeting}
        </Text>
        <Text
          className="mt-1 uppercase"
          style={[Typography.title, { color: HabitatColors.ink, maxWidth: 280 }]}
        >
          {userName.split(' ')[0]}, stay with it.
        </Text>
        <Text className="mt-2" style={[Typography.subtitle, { color: HabitatColors.muted }]}>
          Day {habitFreeDays} without {habitName || 'your habit'}.
        </Text>
      </View>

      <Pressable
        onPress={handleLogout}
        accessibilityRole="button"
        accessibilityLabel="Log out"
        className="mt-1 h-10 w-10 items-center justify-center border-2 active:opacity-60"
        style={{ borderColor: HabitatColors.ink, backgroundColor: HabitatColors.surface }}
      >
        <LogOut size={16} color={HabitatColors.ink} />
      </Pressable>
    </View>
  );
}
