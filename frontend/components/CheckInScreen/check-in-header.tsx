import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

type Props = {
  onBack?: () => void;
};

export default function CheckInHeader({ onBack }: Props) {
  return (
    <View className="px-5 pt-4">
      <Pressable
        onPress={onBack}
        hitSlop={10}
        className="flex-row items-center self-start py-2"
      >
        <ChevronLeft size={24} color="#a9b8a9" />
        <Text className="text-[#a9b8a9] text-xl ml-1">Back</Text>
      </Pressable>

      <Text className="text-[#f3efe3] text-3xl font-serif mt-2">
        Daily Check-in
      </Text>
      <Text className="text-[#8a9a8a] text-base mt-1">
        Swipe right if yes, left if no
      </Text>

      <View className="h-px bg-[#3a4a3a] mt-5" />
    </View>
  );
}