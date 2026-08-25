import { View, Text, Pressable } from 'react-native';
import { Flame, LogOut } from 'lucide-react-native';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { auth } from '@/app/lib/firebase';

type HomeHeaderProps = {
  userName?: string;
  streakDays?: number;
  habitFreeDays?: number;
  habitName?: string;
};

export default function HomeHeader({
  userName = 'User',
  streakDays = 3,
  habitFreeDays = 3,
  habitName = 'Smoking',
}: HomeHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View className="flex-row items-start justify-between">
      <View>
        <Text className="text-emerald-100/60 text-xs font-semibold tracking-[3px] uppercase">
          Good Evening
        </Text>
        <Text className="mt-1 text-3xl font-bold text-white">{userName}</Text>
        <Text className="mt-1 text-sm text-emerald-100/70">
          {habitFreeDays} Days Free From {habitName}
        </Text>
      </View>

      <View className="flex-row items-center gap-3">
        <View className="mt-1 flex-row items-center rounded-full border border-emerald-800 bg-emerald-900/70 px-3 py-1.5">
          <Flame size={14} color="#fb923c" fill="#fb923c" />
          <Text className="ml-1.5 text-xs font-semibold text-white">Day {streakDays}</Text>
        </View>

        <Pressable
          onPress={handleLogout}
          accessibilityRole="button"
          accessibilityLabel="Log out"
          className="mt-1 flex-row items-center rounded-full border border-rose-300/30 bg-rose-500/15 px-3 py-1.5 active:opacity-80"
        >
          <LogOut size={14} color="#f8d7d7" />
          <Text className="ml-1.5 text-xs font-semibold text-rose-100">Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}