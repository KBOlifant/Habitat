import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { useFocusEffect } from 'expo-router';

const CONTENT_FADE_DELAY = 340;
const CONTENT_FADE_DURATION = 240;

type ScreenTransitionProps = {
  children: React.ReactNode;
};

export default function ScreenTransition({ children }: ScreenTransitionProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      let isCancelled = false;
      opacity.stopAnimation();
      opacity.setValue(0);

      const fadeInTimer = setTimeout(() => {
        if (isCancelled) return;

        Animated.timing(opacity, {
          toValue: 1,
          duration: CONTENT_FADE_DURATION,
          useNativeDriver: true,
        }).start();
      }, CONTENT_FADE_DELAY);

      return () => {
        isCancelled = true;
        clearTimeout(fadeInTimer);
        opacity.stopAnimation();
        opacity.setValue(0);
      };
    }, [opacity]),
  );

  return <Animated.View style={{ flex: 1, opacity }}>{children}</Animated.View>;
}
