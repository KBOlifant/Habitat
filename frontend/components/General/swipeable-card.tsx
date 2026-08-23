import React from 'react';
import { Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');
const swipeThreshold = screenWidth * 0.3;

type SwipeableCardProps = {
  children: React.ReactNode;
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  animationSpeed?: number;
};

export default function SwipeableCard({
  children,
  onSwipeRight,
  onSwipeLeft,
  animationSpeed = 1,
}: SwipeableCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  const springConfig = (velocity: number) => ({
    velocity,
    stiffness: 260 * animationSpeed,
    damping: 18,
    mass: 0.9,
  });

  const gesture = Gesture.Pan()
    .onUpdate(event => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      rotate.value = interpolate(
        translateX.value,
        [-screenWidth / 2, screenWidth / 2],
        [-10, 10],
        Extrapolation.CLAMP
      );
    })
    .onEnd(event => {
      const isSwipeRight = translateX.value > swipeThreshold;
      const isSwipeLeft = translateX.value < -swipeThreshold;

      if (isSwipeRight) {
        translateX.value = withSpring(screenWidth * 1.2, springConfig(event.velocityX), () => {
          if (onSwipeRight) {
            runOnJS(onSwipeRight)();
          }
          translateX.value = withSpring(0, springConfig(0));
          translateY.value = withSpring(0, springConfig(0));
          rotate.value = withSpring(0, springConfig(0));
        });
      } else if (isSwipeLeft) {
        translateX.value = withSpring(-screenWidth * 1.2, springConfig(event.velocityX), () => {
          if (onSwipeLeft) {
            runOnJS(onSwipeLeft)();
          }
          translateX.value = withSpring(0, springConfig(0));
          translateY.value = withSpring(0, springConfig(0));
          rotate.value = withSpring(0, springConfig(0));
        });
      } else {
        translateX.value = withSpring(0, springConfig(0));
        translateY.value = withSpring(0, springConfig(0));
        rotate.value = withSpring(0, springConfig(0));
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[animatedStyle]}>{children}</Animated.View>
    </GestureDetector>
  );
}