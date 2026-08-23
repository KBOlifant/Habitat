import { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { Gradients } from '@/constants/theme';
import { auth } from './lib/firebase';

export default function IndexRedirectScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const gradientColors =
    scheme === 'dark' ? Gradients.dark.darkGradient : Gradients.light.lightGradient;
  const [isLoggedIn, setAuthState] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const loggedIn = !!user;
      setAuthState(loggedIn);
      console.log(loggedIn ? `User is logged in: ${user?.uid}` : 'User is logged out.');
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoggedIn === null) {
      return;
    }

    try {
      if (!isLoggedIn) {
        router.replace('/auth');
        return;
      }

      router.replace('/home');
    } catch {
      router.replace('/auth');
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, router]);

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
