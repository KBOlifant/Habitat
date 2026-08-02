import React from 'react';
import { View, Text } from 'react-native';
import { Wind, X, Check } from 'lucide-react-native';

type Props = {
  step: number;
  totalSteps: number;
  title: string;
  question: string;
};

export default function CheckInCard({ step, totalSteps, title, question }: Props) {
  return (
    <View className="mx-5 mt-8 bg-[#182518] border border-[#2f3f2f] rounded-3xl p-5">
      {/* Top row: progress + icon */}
      <View className="flex-row items-center justify-between">
        <Text className="text-[#8a9a8a] text-sm">
          {step} / {totalSteps}
        </Text>
        <View className="w-11 h-11 rounded-full bg-[#3d5a44] items-center justify-center">
          <Wind size={20} color="#cfe0cf" />
        </View>
      </View>

      {/* Title + question */}
      <Text className="text-[#f3efe3] text-2xl font-serif mt-5">{title}</Text>
      <Text className="text-[#b9c7b9] text-base leading-6 mt-3">
        {question}
      </Text>

      {/* Bottom hint row */}
      <View className="flex-row items-center justify-between mt-32">
        <View className="flex-row items-center">
          <X size={14} color="#6f8a6f" />
          <Text className="text-[#6f8a6f] text-sm ml-1.5">Strong urge</Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-[#6f8a6f] text-sm mr-1.5">No urge</Text>
          <Check size={14} color="#6f8a6f" />
        </View>
      </View>
    </View>
  );
}