import { ScrollView, TouchableOpacity, View, Text } from 'react-native';

const SCALE = Array.from({ length: 5 }, (_, i) => i + 1);

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
        <Text className="text-emerald-100/50 text-xs font-semibold tracking-[2px] uppercase">
          {label}
        </Text>
        <Text className="text-white text-sm font-semibold">
          {value ?? '—'} / 5
        </Text>
      </View>

      <View
        className='justify-between flex-row pt-2'
      >
        {SCALE.map((n) => {
          const isSelected = value === n;
          return (
            <TouchableOpacity
              key={n}
              onPress={() => onChange(n)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={`Intensity ${n} out of 10`}
              accessibilityState={{ selected: isSelected }}
              className={`w-16 h-10 rounded-full items-center justify-center ${
                isSelected ? 'bg-lime-600' : 'bg-emerald-900/60 border border-emerald-800/60'
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  isSelected ? 'text-emerald-950' : 'text-emerald-100/70'
                }`}
              >
                {n}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
