import { TouchableOpacity, View, Text } from 'react-native';
import { Typography } from '@/constants/typography';
import { HabitatColors } from '@/constants/theme';

const SCALE = Array.from({ length: 5 }, (_, index) => index + 1);

type IntensitySelectorProps = {
  value: number | null;
  onChange: (value: number) => void;
  label?: string;
};

export default function IntensitySelector({
  value,
  onChange,
  label = 'Intensity',
}: IntensitySelectorProps) {
  return (
    <View className="mt-5">
      <View className="flex-row items-baseline justify-between">
        <Text className="uppercase" style={[Typography.sectionLabel, { color: HabitatColors.accent }]}>
          {label}
        </Text>
        <Text className="text-sm font-bold" style={{ color: HabitatColors.text }}>
          {value ?? '—'} / 5
        </Text>
      </View>
      <View className="flex-row pt-2" style={{ gap: 7 }}>
        {SCALE.map((number) => {
          const isSelected = value === number;
          return (
            <TouchableOpacity
              key={number}
              onPress={() => onChange(number)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={`Intensity ${number} out of 5`}
              accessibilityState={{ selected: isSelected }}
              className="h-10 flex-1 items-center justify-center rounded-full border"
              style={{
                backgroundColor: isSelected ? HabitatColors.highlight : HabitatColors.surface,
                borderColor: HabitatColors.border,
              }}
            >
              <Text className="text-sm font-bold" style={{ color: isSelected ? HabitatColors.onHighlight : HabitatColors.text }}>
                {number}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
