// Target path: components/Milestones/last-30-days.tsx
import { View, Text } from 'react-native';

export type DayStatus = 'checked-in' | 'relapsed' | 'missed';

type Last30DaysProps = {
  days?: DayStatus[];
};

const STATUS_COLOR: Record<DayStatus, string> = {
  'checked-in': '#3f7a4e',
  relapsed: '#dc4b3f',
  missed: '#2c3a2c',
};

const LEGEND: { status: DayStatus; label: string }[] = [
  { status: 'checked-in', label: 'Checked in' },
  { status: 'relapsed', label: 'Relapsed' },
  { status: 'missed', label: 'Missed' },
];

// Placeholder shown only until Firestore data resolves. Real data comes from
// lib/progress.ts -> fetchProgressStats(uid).last30Days, passed down from dashboard.tsx.
const EMPTY_30_DAYS: DayStatus[] = Array.from({ length: 30 }, () => 'missed');

export default function Last30Days({
  days = EMPTY_30_DAYS,
}: Last30DaysProps) {
  return (
    <View className="mx-6 mt-5 bg-emerald-900/40 border border-emerald-800/50 rounded-2xl p-5">
      <Text className="text-emerald-100/50 text-xs font-semibold tracking-[2px] uppercase">
        Last 30 Days
      </Text>

      <View className="flex-row flex-wrap mt-4" style={{ gap: 10 }}>
        {days.map((status, index) => (
          <View
            key={index}
            className="w-7 h-7 rounded-full"
            style={{ backgroundColor: STATUS_COLOR[status] }}
          />
        ))}
      </View>

      <View className="flex-row mt-5" style={{ gap: 16 }}>
        {LEGEND.map(({ status, label }) => (
          <View key={status} className="flex-row items-center">
            <View
              className="w-2 h-2 rounded-full mr-1.5"
              style={{ backgroundColor: STATUS_COLOR[status] }}
            />
            <Text className="text-emerald-100/50 text-xs">{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
