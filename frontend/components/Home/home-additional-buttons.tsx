import { TouchableOpacity, View, Text } from 'react-native';
import { Link } from 'expo-router';
import { TriangleAlert, BarChart3 } from 'lucide-react-native';
import { HabitatColors } from '@/constants/theme';

type HomeAdditionalButtonsProps = {
  triggerCount?: number;
};

export default function AdditionalButtons({ triggerCount = 0 }: HomeAdditionalButtonsProps) {
  return (
    <View className="mt-4 flex-row" style={{ gap: 10 }}>
      <Link href="/triggers" asChild>
        <TouchableOpacity
          activeOpacity={0.85}
          className="min-h-[145px] flex-1 justify-between border-2 p-4"
          style={{
            backgroundColor: HabitatColors.surface,
            borderColor: HabitatColors.ink,
            shadowColor: HabitatColors.ink,
            shadowOffset: { width: 3, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
          }}
        >
          <TriangleAlert size={20} color={HabitatColors.ink} />
          <View>
            <Text className="text-base font-black uppercase" style={{ color: HabitatColors.ink }}>
              Log a trigger
            </Text>
            <Text className="mt-1 text-xs font-medium" style={{ color: HabitatColors.muted }}>
              {triggerCount} entr{triggerCount === 1 ? 'y' : 'ies'} recorded
            </Text>
          </View>
        </TouchableOpacity>
      </Link>

      <Link href="/dashboard" asChild>
        <TouchableOpacity
          activeOpacity={0.85}
          className="min-h-[145px] flex-1 justify-between border-2 p-4"
          style={{ backgroundColor: HabitatColors.surface, borderColor: HabitatColors.ink }}
        >
          <BarChart3 size={20} color={HabitatColors.ink} />
          <View>
            <Text className="text-base font-black uppercase" style={{ color: HabitatColors.ink }}>
              Progress
            </Text>
            <Text className="mt-1 text-xs font-medium" style={{ color: HabitatColors.muted }}>
              See your month
            </Text>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
