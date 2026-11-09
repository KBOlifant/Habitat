import { Pressable, View, Text } from 'react-native';
import { FlaskConical, Minus, Plus } from 'lucide-react-native';
import { Typography } from '@/constants/typography';
import { HabitatColors } from '@/constants/theme';
import { resetDevClock, setDevClockEnabled, shiftDevClock, useDevClock } from '@/lib/dev-clock';

function StepButton({ label, onPress, Icon }: { label: string; onPress: () => void; Icon: typeof Plus }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="h-11 w-11 items-center justify-center rounded-full active:opacity-70"
      style={{ backgroundColor: HabitatColors.raised }}
    >
      <Icon size={18} color={HabitatColors.text} />
    </Pressable>
  );
}

export default function DevTimeTravel() {
  const { enabled, date } = useDevClock();
  if (!__DEV__) return null;

  const shown = new Date(`${date}T12:00:00`);
  const isRealToday = shown.toDateString() === new Date().toDateString();

  return (
    <View
      className="mt-4 rounded-2xl border border-dashed p-4"
      style={{ backgroundColor: HabitatColors.surface, borderColor: HabitatColors.primary }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <FlaskConical size={14} color={HabitatColors.accent} />
          <Text className="ml-2 uppercase" style={[Typography.sectionLabel, { color: HabitatColors.accent }]}>
            Time travel
          </Text>
        </View>
        <Pressable
          onPress={() => setDevClockEnabled(!enabled)}
          accessibilityRole="switch"
          accessibilityState={{ checked: enabled }}
          accessibilityLabel="Dev time travel"
          className="min-h-11 min-w-16 items-center justify-center rounded-full px-4 active:opacity-70"
          style={{ backgroundColor: enabled ? HabitatColors.highlight : HabitatColors.raised }}
        >
          <Text
            className="text-sm font-semibold"
            style={{ color: enabled ? HabitatColors.onHighlight : HabitatColors.muted }}
          >
            {enabled ? 'On' : 'Off'}
          </Text>
        </Pressable>
      </View>

      {enabled && (
        <>
          <View className="mt-4 flex-row items-center justify-between">
            <StepButton label="Previous day" onPress={() => shiftDevClock(-1)} Icon={Minus} />
            <View className="items-center">
              <Text className="text-base font-semibold" style={{ color: HabitatColors.text }}>
                {isRealToday ? 'Today' : shown.toDateString()}
              </Text>
              <Text className="mt-0.5 text-sm" style={{ color: HabitatColors.muted }}>
                {date}
              </Text>
            </View>
            <StepButton label="Next day" onPress={() => shiftDevClock(1)} Icon={Plus} />
          </View>
          <Text className="mt-3 text-center text-sm" style={{ color: HabitatColors.muted }}>
            The whole app acts as if it's this day.
          </Text>
          {!isRealToday && (
            <Pressable
              onPress={resetDevClock}
              accessibilityRole="button"
              className="mt-1 min-h-11 items-center justify-center active:opacity-70"
            >
              <Text className="text-sm font-semibold" style={{ color: HabitatColors.text }}>
                Back to today
              </Text>
            </Pressable>
          )}
        </>
      )}
    </View>
  );
}
