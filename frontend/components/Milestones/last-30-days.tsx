import { View, Text } from 'react-native';
import { Typography } from '@/constants/typography';
import { HabitatColors } from '@/constants/theme';

export type DayStatus = 'checked-in' | 'relapsed' | 'missed';

type Last30DaysProps = {
  days?: DayStatus[];
};

const STATUS_COLOR: Record<DayStatus, string> = {
  'checked-in': HabitatColors.green,
  relapsed: HabitatColors.ink,
  missed: HabitatColors.pale,
};

const LEGEND: { status: DayStatus; label: string }[] = [
  { status: 'checked-in', label: 'Checked in' },
  { status: 'relapsed', label: 'Relapse' },
  { status: 'missed', label: 'No entry' },
];

const EMPTY_30_DAYS: DayStatus[] = Array.from({ length: 30 }, () => 'missed');

export default function Last30Days({ days = EMPTY_30_DAYS }: Last30DaysProps) {
  return (
    <View
      className="mx-6 mt-5 border-2 p-4"
      style={{ backgroundColor: HabitatColors.surface, borderColor: HabitatColors.ink }}
    >
      <Text className="uppercase" style={[Typography.sectionLabel, { color: HabitatColors.green }]}>
        Consistency map
      </Text>
      <View className="mt-1 flex-row items-baseline justify-between">
        <Text className="text-xl font-black uppercase" style={{ color: HabitatColors.ink }}>
          Last 30 days
        </Text>
        <Text className="text-[10px] font-bold" style={{ color: HabitatColors.muted }}>
          {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </Text>
      </View>

      <View className="mt-4 flex-row flex-wrap justify-between" style={{ rowGap: 6 }}>
        {days.map((status, index) => (
          <View
            key={index}
            style={{
              width: '9%',
              aspectRatio: 1,
              borderWidth: 1,
              borderColor: HabitatColors.ink,
              backgroundColor: STATUS_COLOR[status],
            }}
          />
        ))}
      </View>

      <View className="mt-4 flex-row flex-wrap" style={{ gap: 12 }}>
        {LEGEND.map(({ status, label }) => (
          <View key={status} className="flex-row items-center">
            <View
              className="mr-1.5 h-2.5 w-2.5 border"
              style={{ backgroundColor: STATUS_COLOR[status], borderColor: HabitatColors.ink }}
            />
            <Text className="text-[9px] font-black uppercase" style={{ color: HabitatColors.ink }}>
              {label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
