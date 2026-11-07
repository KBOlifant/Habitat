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
        <Text className="uppercase" style={[Typography.sectionLabel, { color: HabitatColors.green }]}>
          {label}
        </Text>
        <Text className="text-sm font-bold" style={{ color: HabitatColors.ink }}>
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
              className="h-10 flex-1 items-center justify-center border-2"
              style={{
                backgroundColor: isSelected ? HabitatColors.green : HabitatColors.surface,
                borderColor: HabitatColors.ink,
              }}
            >
              <Text className="text-sm font-black" style={{ color: isSelected ? HabitatColors.surface : HabitatColors.ink }}>
                {number}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
