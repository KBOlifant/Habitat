import { View, Text } from 'react-native';
import { Flame, ShieldCheck, CircleCheck } from 'lucide-react-native';
import { HabitatColors } from '@/constants/theme';

type StatsRowProps = {
  streak?: number;
  resisted?: number;
  checkIns?: number;
};

const cards = [
  { key: 'streak', label: 'Day streak', Icon: Flame, color: HabitatColors.ink },
  { key: 'resisted', label: 'Urges resisted', Icon: ShieldCheck, color: HabitatColors.green },
  { key: 'checkIns', label: 'Check-ins', Icon: CircleCheck, color: HabitatColors.ink },
] as const;

export default function StatsRow({
  streak = 0,
  resisted = 0,
  checkIns = 0,
}: StatsRowProps) {
  const values = { streak, resisted, checkIns };

  return (
    <View className="mt-5 flex-row px-6" style={{ gap: 8 }}>
      {cards.map(({ key, label, Icon, color }) => (
        <View
          key={key}
          className="min-h-[112px] flex-1 items-center justify-center border-2 py-3"
          style={{ backgroundColor: HabitatColors.surface, borderColor: HabitatColors.ink }}
        >
          <Icon size={17} color={color} />
          <Text className="mt-1 text-2xl font-black" style={{ color: HabitatColors.ink }}>
            {values[key]}
          </Text>
          <Text className="mt-1 text-center text-[9px] font-black uppercase tracking-wide" style={{ color: HabitatColors.muted }}>
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
}
