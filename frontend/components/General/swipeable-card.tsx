import React, { useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
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
const CARD_WIDTH = 400;
const swipeThreshold = CARD_WIDTH * 0.35;

type SwipeableCardProps = {
  children: React.ReactNode;
  nextCard?: React.ReactNode;
  nextCardKey?: string | number;
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  animationSpeed?: number;
};

export default function SwipeableCard({
  children,
  nextCard,
  nextCardKey,
  onSwipeRight,
  onSwipeLeft,
  animationSpeed = 1,
}: SwipeableCardProps) {
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const currentCardScale = useSharedValue(1);
  const hasMounted = useRef(false);

  const springConfig = (velocity: number) => {
    'worklet';
    return {
      velocity,
      stiffness: 260 * animationSpeed,
      damping: 18,
      mass: 0.9,
    };
  };

  useEffect(() => {
    if (nextCardKey === undefined || !hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    translateX.value = 0;
    rotate.value = 0;
    currentCardScale.value = 0;
    currentCardScale.value = withSpring(1, {
      stiffness: 260 * animationSpeed,
      damping: 18,
      mass: 0.9,
    });
  }, [animationSpeed, currentCardScale, nextCardKey, rotate, translateX]);

  const gesture = Gesture.Pan()
    // Activates gesture only when dragged horizontally past 10px, letting vertical swipes fall through to scroll views
    .activeOffsetX([-10, 10])
    .onUpdate(event => {
      translateX.value = event.translationX;
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
        });
      } else if (isSwipeLeft) {
        translateX.value = withSpring(-screenWidth * 1.2, springConfig(event.velocityX), () => {
          if (onSwipeLeft) {
            runOnJS(onSwipeLeft)();
          }
        });
      } else {
        translateX.value = withSpring(0, springConfig(0));
        rotate.value = withSpring(0, springConfig(0));
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: currentCardScale.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <View style={styles.outerContainer}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={styles.cardContainer}>
          {nextCard && (
            <Animated.View
              pointerEvents="none"
              style={[StyleSheet.absoluteFillObject, styles.nextCard]}
            >
              {nextCard}
            </Animated.View>
          )}
          <Animated.View style={[animatedStyle, styles.currentCard]}>
            {children}
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  cardContainer: {
    width: CARD_WIDTH,
    maxWidth: '100%', // Prevents overflow on screen sizes narrower than 400px
    alignItems: 'center',
  },
  nextCard: {
    transform: [{ scale: 0 }],
  },
  currentCard: {
    width: '100%',
    zIndex: 1,
  },
});