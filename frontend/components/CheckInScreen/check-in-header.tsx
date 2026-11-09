import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { Typography } from '@/constants/typography';
import { HabitatColors } from '@/constants/theme';

type Props = {
  onBack?: () => void;
};

export default function CheckInHeader({ onBack }: Props) {
  return (
    <View className="px-6 pt-10">
      <TouchableOpacity onPress={onBack} activeOpacity={0.7} className="flex-row items-center self-start">
        <ChevronLeft size={17} color={HabitatColors.text} />
        <Text className="ml-1 text-sm font-bold" style={{ color: HabitatColors.text }}>Back</Text>
      </TouchableOpacity>
      <Text className="mt-4" style={[Typography.title, { color: HabitatColors.text }]}>
        Check in.
      </Text>
      <Text className="mt-2" style={[Typography.subtitle, { color: HabitatColors.muted }]}>
        Swipe the card or use the buttons. There are no wrong answers.
      </Text>
      <View className="mt-5 h-px" style={{ backgroundColor: HabitatColors.border }} />
    </View>
  );
}
