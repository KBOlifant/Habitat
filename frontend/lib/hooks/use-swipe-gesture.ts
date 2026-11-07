import { useRef } from 'react';
import { PanResponder, type PanResponderGestureState } from 'react-native';

type SwipeDirection = 'up' | 'down' | 'left' | 'right';

type UseSwipeGestureOptions = {
  direction: SwipeDirection;
  onSwipe: () => void;
  /** Minimum drag distance (px) to count as a swipe. */
  distanceThreshold?: number;
  /** Minimum release velocity to count as a swipe (catches quick flicks that don't travel far). */
  velocityThreshold?: number;
  /** Set to false to temporarily disable the gesture (e.g. while a modal is closing). */
  enabled?: boolean;
};

/**
 * Detects a single-direction swipe and calls `onSwipe` on release.
 * Built on React Native's built-in PanResponder — no extra dependency
 * (e.g. react-native-gesture-handler) required.
 *
 * Usage: spread the returned handlers onto the View you want to make
 * swipeable — `<View {...useSwipeGesture({ direction: 'up', onSwipe })} />`.
 */
export function useSwipeGesture({
  direction,
  onSwipe,
  distanceThreshold = 40,
  velocityThreshold = 0.35,
  enabled = true,
}: UseSwipeGestureOptions) {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => enabled,
      onMoveShouldSetPanResponder: (_, gesture) =>
        enabled && (Math.abs(gesture.dy) > 8 || Math.abs(gesture.dx) > 8),
      onPanResponderRelease: (_, gesture) => {
        if (enabled && didSwipe(direction, gesture, distanceThreshold, velocityThreshold)) {
          onSwipe();
        }
      },
    })
  ).current;

  return panResponder.panHandlers;
}

function didSwipe(
  direction: SwipeDirection,
  gesture: PanResponderGestureState,
  distanceThreshold: number,
  velocityThreshold: number
): boolean {
  const { dx, dy, vx, vy } = gesture;

  switch (direction) {
    case 'up':
      return dy < -distanceThreshold || vy < -velocityThreshold;
    case 'down':
      return dy > distanceThreshold || vy > velocityThreshold;
    case 'left':
      return dx < -distanceThreshold || vx < -velocityThreshold;
    case 'right':
      return dx > distanceThreshold || vx > velocityThreshold;
    default:
      return false;
  }
}
