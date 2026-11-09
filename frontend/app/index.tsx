import { useEffect, useRef, useState } from 'react';
import { Animated, View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { observeAuthState } from '../functions/auth';
import { Gradients } from '@/constants/theme';
import HabitatLogo from '@/components/Onboarding1/habitat-logo1-small.png';

const SPLASH_DURATION = 1200;
const EXIT_DURATION = 240;

export default function IndexRedirectScreen() {
  const router = useRouter();
  const [isLoggedIn, setAuthState] = useState<boolean | null>(null);
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.2)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 7,
        tension: 45,
        useNativeDriver: true,
      }),
    ]).start();

    const unsubscribe = observeAuthState((user) => {
      setAuthState(!!user);
    });

    return () => unsubscribe();
  }, [logoOpacity, logoScale]);

  useEffect(() => {
    if (isLoggedIn === null) {
      return;
    }

    const redirectTimer = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: EXIT_DURATION,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          router.replace(isLoggedIn ? '/home' : '/auth');
        }
      });
    }, SPLASH_DURATION);

    return () => clearTimeout(redirectTimer);
  }, [isLoggedIn, router, screenOpacity]);

  return (
    <Animated.View style={{ flex: 1, opacity: screenOpacity }}>
      <LinearGradient colors={Gradients.dark.darkGradient} style={{ flex: 1 }}>
        <View className="flex-1 items-center justify-center px-6">
          <Animated.View
            style={{
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            }}
          >
            <Image
              source={HabitatLogo}
              resizeMode="contain"
              style={{ width: 160, height: 160 }}
            />
          </Animated.View>

          <Text className="mt-10 text-sm font-semibold uppercase tracking-[4px] text-emerald-100/50">
            Break Habits. Grow Your Inner Bonsai.
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}
