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
      className="mx-5 mt-5 rounded-2xl border p-5"
      style={{
        minHeight: 350,
        backgroundColor: HabitatColors.surface,
        borderColor: HabitatColors.border,
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="h-10 w-10 items-center justify-center rounded-full border" style={{ backgroundColor: HabitatColors.raised, borderColor: HabitatColors.border }}>
          <Wind size={20} color={HabitatColors.text} />
        </View>
        <Text className="text-xs font-bold" style={{ color: HabitatColors.text }}>
          {String(step).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
        </Text>
      </View>

      <Text className="mt-8 uppercase" style={[Typography.sectionLabel, { color: HabitatColors.accent }]}>
        Body scan
      </Text>
      <Text className="mt-2" style={[Typography.title, { color: HabitatColors.text }]}>
        {title}
      </Text>
      <Text className="mt-4 text-base leading-7" style={{ color: HabitatColors.muted }}>
        {question}
      </Text>

      <View className="mt-auto flex-row items-center justify-between border-t pt-4" style={{ borderColor: HabitatColors.border }}>
        <View className="flex-row items-center">
          <ArrowLeft size={14} color={HabitatColors.text} />
          <Text className="ml-1 text-xs font-semibold" style={{ color: HabitatColors.text }}>
            Swipe to reflect
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="mr-1 text-xs font-semibold" style={{ color: HabitatColors.text }}>
            Keep going
          </Text>
          <ArrowRight size={14} color={HabitatColors.text} />
        </View>
      </View>
    </View>
  );
}
