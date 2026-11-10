import { useState } from 'react';
import { Pressable, View, Text } from 'react-native';
import { CircleCheck, FlaskConical, Minus, Plus } from 'lucide-react-native';
import { Typography } from '@/constants/typography';
import { HabitatColors } from '@/constants/theme';
import { resetDevClock, setDevClockEnabled, shiftDevClock, useDevClock } from '@/lib/dev-clock';
import { getCurrentUser } from '../../functions/auth';
import { completeDevDay } from '../../functions/swipes';

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

type DevTimeTravelProps = {
  /** Called after a simulated check-in is saved, so the screen can reload its data. */
  onChanged?: () => void;
  /** Show the "Complete this day" button. The Check-In screen has its own, so it turns this off. */
  showActions?: boolean;
};

export default function DevTimeTravel({ onChanged, showActions = true }: DevTimeTravelProps) {
  const { enabled, date } = useDevClock();
  const [isWorking, setIsWorking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  if (!__DEV__) return null;

  const shown = new Date(`${date}T12:00:00`);
  const isRealToday = shown.toDateString() === new Date().toDateString();

  const changeDay = (days: number) => {
    setMessage(null);
    shiftDevClock(days);
  };

  const completeDay = async () => {
    const user = getCurrentUser();
    if (!user) {
      setMessage('Sign in first.');
      return;
    }
    if (isWorking) return;

    setIsWorking(true);
    setMessage(null);
    try {
      const result = await completeDevDay(user.uid, date);
      setMessage(result === 'completed' ? `Checked in for ${date}.` : `${date} is already complete.`);
      if (result === 'completed') onChanged?.();
    } catch (error) {
      console.error('Unable to complete the simulated day', error);
      setMessage('Could not save that day.');
    } finally {
      setIsWorking(false);
    }
  };

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
            <StepButton label="Previous day" onPress={() => changeDay(-1)} Icon={Minus} />
            <View className="items-center">
              <Text className="text-base font-semibold" style={{ color: HabitatColors.text }}>
                {isRealToday ? 'Today' : shown.toDateString()}
              </Text>
              <Text className="mt-0.5 text-sm" style={{ color: HabitatColors.muted }}>
                {date}
              </Text>
            </View>
            <StepButton label="Next day" onPress={() => changeDay(1)} Icon={Plus} />
          </View>

          {showActions && (
            <Pressable
              onPress={completeDay}
              disabled={isWorking}
              accessibilityRole="button"
              accessibilityLabel="Complete this day"
              className="mt-4 min-h-12 flex-row items-center justify-center rounded-full px-5 active:opacity-80"
              style={{ backgroundColor: HabitatColors.primary, opacity: isWorking ? 0.6 : 1 }}
            >
              <CircleCheck size={18} color={HabitatColors.onPrimary} />
              <Text className="ml-2 text-base font-semibold" style={{ color: HabitatColors.onPrimary }}>
                {isWorking ? 'Saving…' : 'Complete this day'}
              </Text>
            </Pressable>
          )}

          <Text className="mt-3 text-center text-sm" style={{ color: HabitatColors.muted }}>
            {message ?? "The whole app acts as if it's this day."}
          </Text>
          {!isRealToday && (
            <Pressable
              onPress={() => {
                setMessage(null);
                resetDevClock();
              }}
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
