import { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'react-native';
import { Gradients } from '@/constants/theme';

const NAME_KEY = 'habitat_user_name';
const HABIT_KEY = 'habitat_user_habit';

export default function IndexRedirectScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const gradientColors =
    scheme === 'dark' ? Gradients.dark.darkGradient : Gradients.light.lightGradient;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreState() {
      try {
        const name = await SecureStore.getItemAsync(NAME_KEY);
        const habit = await SecureStore.getItemAsync(HABIT_KEY);

        if (!name) {
          router.replace('/welcome');
          return;
        }

        if (!habit) {
          router.replace('/habit');
          return;
        }

        router.replace('/home');
      } catch {
        router.replace('/welcome');
      } finally {
        setLoading(false);
      }
    }

    restoreState();
  }, [router]);

  if (!loading) {
    return null;
  }

  return (
    <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
      <View className="flex-1 items-center justify-center px-6">
        <ActivityIndicator size="large" color="#f8fafc" />
        <Text className="mt-4 text-base text-slate-100">Preparing your experience…</Text>
      </View>
    </LinearGradient>
  );
}
