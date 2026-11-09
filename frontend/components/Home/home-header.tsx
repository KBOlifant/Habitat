import { View, Text, Pressable, Image } from 'react-native';
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
      router.replace({ pathname: '/auth', params: { mode: 'signIn' } });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View className="flex-row items-start">
      <View className="flex-1 pr-3">
        <View
          className="flex-row items-center justify-between border-b pb-3"
          style={{ borderColor: HabitatColors.border }}
        >
          <View className="flex-row items-center">
            <Image
              source={require('../../assets/images/HabitatIcon.png')}
              accessibilityLabel="Habitat logo"
              className="mr-2.5 rounded-xl"
              style={{ width: 36, height: 36 }}
            />
            <Text style={{ color: HabitatColors.text, fontSize: 19, fontWeight: '600', letterSpacing: 0.5 }}>
              Habitat
            </Text>
          </View>
          <View className="flex-row items-center">
            <Flame size={16} color={HabitatColors.text} fill={HabitatColors.primary} />
            <Text className="ml-1.5" style={{ color: HabitatColors.text, fontSize: 12, fontWeight: '600' }}>
              {streakDays} day{streakDays === 1 ? '' : 's'}
            </Text>
          </View>
        </View>
        <Text
          className="mt-5 uppercase"
          style={{ color: HabitatColors.accent, fontSize: 12, fontWeight: '600', letterSpacing: 2 }}
        >
          {greeting}
        </Text>
        <Text
          className="mt-1"
          style={[Typography.title, { color: HabitatColors.text, maxWidth: 280 }]}
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
        className="mt-1 h-10 w-10 items-center justify-center rounded-full border active:opacity-60"
        style={{ borderColor: HabitatColors.border, backgroundColor: HabitatColors.surface }}
      >
        <LogOut size={16} color={HabitatColors.text} />
      </Pressable>
    </View>
  );
}
