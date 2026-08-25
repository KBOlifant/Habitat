import React, { createContext, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, forwardRef } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

/**
 * SwipeableModal
 * ---------------
 * A universal bottom/top/left/right sheet you can drag on/off screen.
 *
 * npm i react-native-gesture-handler react-native-reanimated
 * (make sure your app root is wrapped in <GestureHandlerRootView style={{flex:1}}>
 *  and babel.config.js has 'react-native-reanimated/plugin' as the LAST plugin)
 *
 * Usage:
 *   const modalRef = useRef<SwipeableModalRef>(null);
 *   <SwipeableModal ref={modalRef} direction="bottom">
 *     <Text className="text-white">Hello</Text>
 *   </SwipeableModal>
 *   modalRef.current?.open();
 *   modalRef.current?.close();
 */

const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get('window');

export type SwipeDirection = 'bottom' | 'top' | 'left' | 'right';

export type SwipeableModalRef = {
  open: () => void;
  close: () => void;
};

type SwipeableModalProps = {
  children: React.ReactNode;
  /** Which edge the modal slides in from / is dismissed towards. Default 'bottom'. */
  direction?: SwipeDirection;
  /** Called after the close animation finishes (state should be updated here if controlled). */
  onClose?: () => void;
  /** Called after the open animation finishes. */
  onOpen?: () => void;
  /** Fraction (0-1) of the panel's size the user must drag before it snaps closed. Default 0.3 */
  dismissThreshold?: number;
  /** Velocity (px/s) that force-dismisses regardless of distance dragged. Default 800 */
  velocityThreshold?: number;
  /** Tailwind classes for the panel itself. */
  className?: string;
  /** Tailwind classes for the backdrop. */
  backdropClassName?: string;
  /** Disable swipe-to-dismiss, keep only programmatic open/close. */
  swipeEnabled?: boolean;
  /** Tap outside to dismiss. Default true. */
  dismissOnBackdropPress?: boolean;
  /** Show the little grabber bar (only rendered for top/bottom directions). */
  showHandle?: boolean;
};

const SPRING_CONFIG = { duration: 280, easing: Easing.out(Easing.cubic) };

function getAxisConfig(direction: SwipeDirection) {
  switch (direction) {
    case 'bottom':
      return { axis: 'y' as const, sign: 1, size: SCREEN_H };
    case 'top':
      return { axis: 'y' as const, sign: -1, size: SCREEN_H };
    case 'left':
      return { axis: 'x' as const, sign: -1, size: SCREEN_W };
    case 'right':
      return { axis: 'x' as const, sign: 1, size: SCREEN_W };
  }
}

export const SwipeableModal = forwardRef<SwipeableModalRef, SwipeableModalProps>(
  (
    {
      children,
      direction = 'bottom',
      onClose,
      onOpen,
      dismissThreshold = 0.3,
      velocityThreshold = 800,
      className = '',
      backdropClassName = '',
      swipeEnabled = true,
      dismissOnBackdropPress = true,
      showHandle = true,
    },
    ref
  ) => {
    const [visible, setVisible] = React.useState(false);
    const { axis, sign, size } = useMemo(() => getAxisConfig(direction), [direction]);

    // Offscreen starting position, animates to 0 when open.
    const translate = useSharedValue(sign * size);
    const backdropOpacity = useSharedValue(0);

    const animateIn = useCallback(() => {
      translate.value = withTiming(0, SPRING_CONFIG);
      backdropOpacity.value = withTiming(1, { duration: 220 });
      onOpen?.();
    }, [translate, backdropOpacity, onOpen]);

    const animateOut = useCallback(
      (finished?: boolean) => {
        translate.value = withTiming(sign * size, SPRING_CONFIG, (isFinished) => {
          if (isFinished) {
            runOnJS(setVisible)(false);
            if (onClose) runOnJS(onClose)();
          }
        });
        backdropOpacity.value = withTiming(0, { duration: 220 });
      },
      [translate, backdropOpacity, sign, size, onClose]
    );

    const open = useCallback(() => {
      setVisible(true);
    }, []);

    const close = useCallback(() => {
      animateOut();
    }, [animateOut]);

    // Once the Modal has mounted (visible=true) kick off the entrance animation.
    useEffect(() => {
      if (visible) {
        translate.value = sign * size;
        requestAnimationFrame(animateIn);
      }
    }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

    useImperativeHandle(ref, () => ({ open, close }), [open, close]);

    const pan = Gesture.Pan()
      .enabled(swipeEnabled)
      .onUpdate((e) => {
        const raw = axis === 'y' ? e.translationY : e.translationX;
        // Only allow dragging in the "closing" direction (same sign as sign).
        const clamped = sign > 0 ? Math.max(0, raw) : Math.min(0, raw);
        translate.value = clamped;
        // Fade backdrop proportionally to how far it's dragged.
        const progress = Math.min(Math.abs(clamped) / size, 1);
        backdropOpacity.value = 1 - progress;
      })
      .onEnd((e) => {
        const velocity = axis === 'y' ? e.velocityY : e.velocityX;
        const dragged = Math.abs(translate.value);
        const shouldClose =
          dragged > size * dismissThreshold || Math.abs(velocity) > velocityThreshold;

        if (shouldClose) {
          runOnJS(animateOut)();
        } else {
          translate.value = withTiming(0, SPRING_CONFIG);
          backdropOpacity.value = withTiming(1, { duration: 200 });
        }
      });

    const panelStyle = useAnimatedStyle(() => ({
      transform:
        axis === 'y' ? [{ translateY: translate.value }] : [{ translateX: translate.value }],
    }));

    const backdropStyle = useAnimatedStyle(() => ({
      opacity: backdropOpacity.value,
    }));

    if (!visible) return null;

    const positionClass = {
      bottom: 'justify-end',
      top: 'justify-start',
      left: 'justify-start flex-row',
      right: 'justify-end flex-row',
    }[direction];

    const roundedClass = {
      bottom: 'rounded-t-3xl',
      top: 'rounded-b-3xl',
      left: 'rounded-r-3xl',
      right: 'rounded-l-3xl',
    }[direction];

    const sizeClass =
      axis === 'y' ? 'w-full max-h-[85%]' : 'h-full max-w-[85%]';

    return (
      <Modal
        visible={visible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={close}
      >
        <View className={`flex-1 ${positionClass}`}>
          {/* Backdrop */}
          <Animated.View style={[StyleSheet.absoluteFill, backdropStyle]}>
            <Pressable
              className={`flex-1 bg-black/50 ${backdropClassName}`}
              onPress={dismissOnBackdropPress ? close : undefined}
            />
          </Animated.View>

          {/* Panel */}
          <GestureDetector gesture={pan}>
            <Animated.View
              className={`bg-white ${roundedClass} ${sizeClass} ${className}`}
              style={panelStyle}
            >
              {showHandle && (axis === 'y') && (
                <View className="items-center pt-2 pb-1">
                  <View className="w-10 h-1.5 rounded-full bg-gray-300" />
                </View>
              )}
              {children}
            </Animated.View>
          </GestureDetector>
        </View>
      </Modal>
    );
  }
);

SwipeableModal.displayName = 'SwipeableModal';

export default SwipeableModal;
