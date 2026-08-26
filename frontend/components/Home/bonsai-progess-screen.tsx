import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { BonsaiCanvas } from '../../app/Bonsai';

type BonsaiScreenProps = {
  progress?: number; // Optional, default to 0
};

export default function BonsaiScreen({ progress = 0 }: BonsaiScreenProps) {
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const progressRef = useRef(progress);
  const [visibleProgress, setVisibleProgress] = useState(0);

  progressRef.current = Math.min(Math.max(progress, 0), 1);

  useEffect(() => {
    const listenerId = animatedProgress.addListener(({ value }) => {
      setVisibleProgress(value);
    });

    return () => animatedProgress.removeListener(listenerId);
  }, [animatedProgress]);

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progressRef.current,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [animatedProgress, progress]);

  useFocusEffect(
    useCallback(() => {
      animatedProgress.stopAnimation();
      animatedProgress.setValue(0);
      setVisibleProgress(0);

      const animationFrame = requestAnimationFrame(() => {
        Animated.timing(animatedProgress, {
          toValue: progressRef.current,
          duration: 900,
          useNativeDriver: false,
        }).start();
      });

      return () => {
        cancelAnimationFrame(animationFrame);
        animatedProgress.stopAnimation();
      };
    }, [animatedProgress]),
  );

  return (
    <View>
      <BonsaiCanvas growth={visibleProgress} />
    </View>
  );
}
