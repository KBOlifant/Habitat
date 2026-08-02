import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { X, Check } from 'lucide-react-native';

type Props = {
  onStrongUrge?: () => void;
  onNoUrge?: () => void;
};

export default function UrgeButtons({ onStrongUrge, onNoUrge }: Props) {
  return (
    <View className="flex-row px-5 mt-10 gap-3">
      <Pressable
        onPress={onStrongUrge}
        className="flex-1 flex-row items-center justify-center bg-[#182518] border border-[#3a4a3a] rounded-2xl py-4 active:opacity-80"
      >
        <X size={16} color="#c96b5f" />
        <Text className="text-[#e8e4d8] text-base ml-2">Strong urge</Text>
      </Pressable>

      <Pressable
        onPress={onNoUrge}
        className="flex-1 flex-row items-center justify-center bg-[#e9c9b3] rounded-2xl py-4 active:opacity-80"
      >
        <Check size={16} color="#2b2118" />
        <Text className="text-[#2b2118] text-base ml-2 font-medium">No urge</Text>
      </Pressable>
    </View>
  );
}