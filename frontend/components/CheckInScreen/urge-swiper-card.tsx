import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { HabitatColors } from '@/constants/theme';

type Props = {
  onStrongUrge?: () => void;
  onNoUrge?: () => void;
};

export default function UrgeButtons({ onStrongUrge, onNoUrge }: Props) {
  return (
    <View className="flex-row px-5 mt-5" style={{ gap: 10 }}>
      <Pressable
        onPress={onStrongUrge}
        accessibilityRole="button"
        className="min-h-14 flex-1 flex-row items-center justify-center border-2 px-2"
        style={{ borderColor: HabitatColors.ink, backgroundColor: HabitatColors.surface }}
      >
        <ArrowLeft size={15} color={HabitatColors.ink} />
        <Text className="ml-2 text-sm font-black uppercase" style={{ color: HabitatColors.ink }}>
          Strong urge
        </Text>
      </Pressable>
      <Pressable
        onPress={onNoUrge}
        accessibilityRole="button"
        className="min-h-14 flex-1 flex-row items-center justify-center border-2 px-2"
        style={{ borderColor: HabitatColors.ink, backgroundColor: HabitatColors.lime }}
      >
        <Text className="mr-2 text-sm font-black uppercase" style={{ color: HabitatColors.ink }}>
          No urge
        </Text>
        <ArrowRight size={15} color={HabitatColors.ink} />
      </Pressable>
    </View>
  );
}
