import React from 'react';
import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { Typography } from '@/constants/typography';

type Props = {
  onBack?: () => void;
};

export default function TriggerHeader({ onBack }: Props) {
  return (
    <View className="px-5 pt-16">
      <TouchableOpacity
              onPress={onBack}
              activeOpacity={0.7}
              className="flex-row items-center self-start"
      >
        <ChevronLeft size={16} color="#d1e7d4" />
        <Text className="text-emerald-100/80 text-sm ml-0.5">Back</Text>
      </TouchableOpacity>

      <Text className="text-[#f3efe3] mt-2" style={Typography.title}>
        Trigger Log
      </Text>
      <Text className="text-[#8a9a8a] mt-1" style={Typography.subtitle}>
        Awareness is the first step.
      </Text>

      <View className="h-px bg-[#3a4a3a] mt-5" />
    </View>
  );
}