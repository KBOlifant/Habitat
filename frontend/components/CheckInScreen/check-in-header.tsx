import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

type Props = {
  onBack?: () => void;
};

export default function CheckInHeader({ onBack }: Props) {
  return (
    <View className="px-6 pt-12">
      <TouchableOpacity
                    onPress={onBack}
                    activeOpacity={0.7}
                    className="flex-row items-center self-start"
            >
        <ChevronLeft size={16} color="#d1e7d4" />
        <Text className="text-emerald-100/80 text-sm ml-0.5">Back</Text>
      </TouchableOpacity>

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