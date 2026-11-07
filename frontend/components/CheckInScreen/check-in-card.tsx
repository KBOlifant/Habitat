import React from 'react';
import { View, Text } from 'react-native';
import { Wind, ArrowLeft, ArrowRight } from 'lucide-react-native';
import { Typography } from '@/constants/typography';
import { HabitatColors } from '@/constants/theme';

type Props = {
  step: number;
  totalSteps: number;
  title: string;
  question: string;
};

export default function CheckInCard({ step, totalSteps, title, question }: Props) {
  return (
    <View
      className="mx-5 mt-5 border-2 p-5"
      style={{
        minHeight: 350,
        backgroundColor: HabitatColors.surface,
        borderColor: HabitatColors.ink,
        shadowColor: HabitatColors.ink,
        shadowOffset: { width: 3, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="h-10 w-10 items-center justify-center border-2" style={{ backgroundColor: HabitatColors.pale, borderColor: HabitatColors.ink }}>
          <Wind size={20} color={HabitatColors.ink} />
        </View>
        <Text className="text-xs font-black" style={{ color: HabitatColors.ink }}>
          {String(step).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
        </Text>
      </View>

      <Text className="mt-8 uppercase" style={[Typography.sectionLabel, { color: HabitatColors.green }]}>
        Body scan
      </Text>
      <Text className="mt-2 uppercase" style={[Typography.title, { color: HabitatColors.ink }]}>
        {title}
      </Text>
      <Text className="mt-4 text-base leading-7" style={{ color: HabitatColors.muted }}>
        {question}
      </Text>

      <View className="mt-auto flex-row items-center justify-between border-t-2 pt-4" style={{ borderColor: HabitatColors.ink }}>
        <View className="flex-row items-center">
          <ArrowLeft size={14} color={HabitatColors.ink} />
          <Text className="ml-1 text-[10px] font-black uppercase" style={{ color: HabitatColors.ink }}>
            Swipe to reflect
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="mr-1 text-[10px] font-black uppercase" style={{ color: HabitatColors.ink }}>
            Keep going
          </Text>
          <ArrowRight size={14} color={HabitatColors.ink} />
        </View>
      </View>
    </View>
  );
}
