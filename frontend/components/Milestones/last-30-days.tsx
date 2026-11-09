import { View, Text } from 'react-native';
import { CalendarDays, Check, Minus, RotateCcw, type LucideIcon } from 'lucide-react-native';
import { useDevClock } from '@/lib/dev-clock';
import { Typography } from '@/constants/typography';
import { HabitatColors } from '@/constants/theme';

export type DayStatus = 'checked-in' | 'relapsed' | 'missed';

type Last30DaysProps = {
  days?: DayStatus[];
};

const STATUS_STYLE: Record<DayStatus, { background: string; iconColor: string; outline?: string; Icon?: LucideIcon }> = {
  'checked-in': { background: HabitatColors.primary, iconColor: HabitatColors.onPrimary, Icon: Check },
  relapsed: { background: HabitatColors.danger, iconColor: HabitatColors.onHighlight, Icon: RotateCcw },
  missed: { background: 'transparent', iconColor: HabitatColors.muted, outline: HabitatColors.primary, Icon: Minus },
};

const LEGEND: { status: DayStatus; label: string }[] = [
  { status: 'checked-in', label: 'Checked in' },
  { status: 'relapsed', label: 'Relapse' },
  { status: 'missed', label: 'No entry' },
];

const EMPTY_30_DAYS: DayStatus[] = Array.from({ length: 30 }, () => 'missed');

export default function Last30Days({ days = EMPTY_30_DAYS }: Last30DaysProps) {
  const { today } = useDevClock();

  return (
    <View
      className="mx-6 mt-5 rounded-2xl border p-4"
      style={{ backgroundColor: HabitatColors.surface, borderColor: HabitatColors.border }}
    >
      <View className="flex-row items-center">
        <CalendarDays size={14} color={HabitatColors.accent} />
        <Text className="ml-2 uppercase" style={[Typography.sectionLabel, { color: HabitatColors.accent }]}>
          Consistency map
        </Text>
      </View>
      <View className="mt-1 flex-row items-baseline justify-between">
        <Text className="text-xl font-semibold" style={{ color: HabitatColors.text }}>
          Last 30 days
        </Text>
        <Text className="text-xs font-medium" style={{ color: HabitatColors.muted }}>
          {new Date(`${today}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </Text>
      </View>

      <View className="mt-4 flex-row flex-wrap justify-between" style={{ rowGap: 6 }}>
        {days.map((status, index) => {
          const { background, iconColor, outline, Icon } = STATUS_STYLE[status];
          return (
            <View
              key={index}
              className="items-center justify-center rounded-lg"
              style={{ width: '9.5%', aspectRatio: 1, backgroundColor: background, borderWidth: outline ? 1 : 0, borderColor: outline }}
            >
              {Icon && <Icon size={13} color={iconColor} strokeWidth={2.5} />}
            </View>
          );
        })}
      </View>

      <View className="mt-4 flex-row flex-wrap" style={{ gap: 12 }}>
        {LEGEND.map(({ status, label }) => {
          const { background, iconColor, outline, Icon } = STATUS_STYLE[status];
          return (
            <View key={status} className="flex-row items-center">
              <View
                className="mr-1.5 h-4 w-4 items-center justify-center rounded"
                style={{ backgroundColor: background, borderWidth: outline ? 1 : 0, borderColor: outline }}
              >
                {Icon && <Icon size={10} color={iconColor} strokeWidth={2.5} />}
              </View>
              <Text className="text-xs font-medium" style={{ color: HabitatColors.muted }}>
                {label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
