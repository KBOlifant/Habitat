import React, { useState, useEffect } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Link } from 'expo-router';
import { CircleCheck, Sprout } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckInCard from './check-in-card';
import UrgeButtons from './urge-swiper-card';
import SwipeableCard from '../General/swipeable-card';
import DevTimeTravel from '../Home/dev-time-travel';
import { DEV_TOOLS, getNow, useDevClock } from '../../lib/dev-clock';
import { observeAuthState, getCurrentUser } from '../../functions/auth';
import {
  deleteAllCheckIns,
  getCheckIns,
  saveCheckIn,
  saveDevelopmentCheckIn,
  type CheckRecord,
} from '../../functions/swipes';
import { Typography } from '@/constants/typography';
import { HabitatColors } from '@/constants/theme';
import {
  getTriggers,
  updateTriggerFollowUp,
  type Trigger,
} from '../../functions/triggers';

const CHECK_PROGRESS_KEY = 'habitat_check_progress';

const steps = [
  { title: 'Mood Check', question: 'Notice your emotional state without judgement. What\'s present for you in this moment?' },
  { title: 'Urge Check', question: 'How are you feeling right now?' },
  { title: 'Minfullness Check', question: 'Breathe. Take three slow, deep breaths, inhale through your nose for 4 counts, hold for 4 more cound, then exhale for 6. Your breath is always here' },
  // { title: 'Gratitude Check', question: 'How are you feeling right now?' },
  { title: 'Today\'s Intention', question: 'Your bonsai grows day by day. What small choice can you make today that your future self will thank you for?' },
];

const TOTAL_STEPS = steps.length + 1;

type RelapseNoteCardProps = {
  step: number;
  totalSteps: number;
  trigger: Trigger;
  error?: string | null;
  onSkip: () => void;
  onSave: (wasTriggered: boolean, note: string) => void;
};

function RelapseNoteCard({
  step,
  totalSteps,
  trigger,
  error,
  onSkip,
  onSave,
}: RelapseNoteCardProps) {
  const [wasTriggered, setWasTriggered] = useState<boolean | null>(null);
  const [note, setNote] = useState('');

  return (
    <View className="mx-5 mt-8 rounded-2xl border p-5" style={{ backgroundColor: HabitatColors.surface, borderColor: HabitatColors.border }}>
      <Text className="text-sm font-bold" style={{ color: HabitatColors.muted }}>{step} / {totalSteps}</Text>
      <Text className="mt-5" style={[Typography.title, { color: HabitatColors.text }]}>
        Were you triggered by {trigger.name}?
      </Text>
      <Text className="mt-3 text-base leading-6" style={{ color: HabitatColors.muted }}>
        This optional note can help you understand what happened.
      </Text>
      {error ? (
        <Text className="mt-3 text-sm" style={{ color: HabitatColors.danger }} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}

      <View className="mt-5 flex-row" style={{ gap: 10 }}>
        {([true, false] as const).map((value) => (
          <Pressable
            key={String(value)}
            onPress={() => setWasTriggered(value)}
            accessibilityRole="button"
            accessibilityState={{ selected: wasTriggered === value }}
            className="flex-1 items-center rounded-full border py-3"
            style={{
              backgroundColor: wasTriggered === value ? HabitatColors.highlight : 'transparent',
              borderColor: wasTriggered === value ? HabitatColors.highlight : HabitatColors.border,
            }}
          >
            <Text className="text-base font-semibold" style={{ color: wasTriggered === value ? HabitatColors.onHighlight : HabitatColors.muted }}>
              {value ? 'Yes' : 'No'}
            </Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        value={note}
        onChangeText={setNote}
        multiline
        maxLength={1000}
        placeholder="What did you notice? (Optional)"
        placeholderTextColor={HabitatColors.muted}
        textAlignVertical="top"
        accessibilityLabel="Optional relapse note"
        className="mt-5 min-h-[120px] rounded-2xl border px-4 py-3 text-base"
        style={{ borderColor: HabitatColors.border, backgroundColor: HabitatColors.canvas, color: HabitatColors.text }}
      />

      <View className="mt-5 flex-row" style={{ gap: 10 }}>
        <Pressable
          onPress={onSkip}
          accessibilityRole="button"
          className="flex-1 items-center rounded-full border py-3"
          style={{ borderColor: HabitatColors.border }}
        >
          <Text className="text-base font-semibold" style={{ color: HabitatColors.text }}>Skip</Text>
        </Pressable>
        <Pressable
          onPress={() => wasTriggered !== null && onSave(wasTriggered, note.trim())}
          disabled={wasTriggered === null}
          accessibilityRole="button"
          className="flex-1 items-center rounded-full py-3"
          style={{ backgroundColor: wasTriggered === null ? HabitatColors.raised : HabitatColors.primary }}
        >
          <Text className="text-base font-semibold" style={{ color: wasTriggered === null ? HabitatColors.muted : HabitatColors.onPrimary }}>
            Save note
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

type SavedCheckProgress = {
  date: string;
  index: number;
  checks: CheckRecord[];
};

const getStorageDate = () => {
  const now = getNow();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getLocalDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function CardHolder() {
  const [index, setIndex] = useState(0);
  const [checks, setChecks] = useState<CheckRecord[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { enabled: devClockEnabled, today: devDate } = useDevClock();
  const [isDevActionRunning, setIsDevActionRunning] = useState(false);
  const [devMessage, setDevMessage] = useState<string | null>(null);
  const [relapseTrigger, setRelapseTrigger] = useState<Trigger | null>(null);
  const [isSavingRelapseNote, setIsSavingRelapseNote] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    return observeAuthState((user) => {
      setUserId(user?.uid ?? null);
    });
  }, []);

  useEffect(() => {
    if (!userId) {
      setRelapseTrigger(null);
      return;
    }

    getTriggers(userId)
      .then((triggers) => {
        const unreviewedRelapse = triggers.find(
          (trigger) => trigger.relapsed && !trigger.followUp,
        );
        setRelapseTrigger(unreviewedRelapse ?? null);
      })
      .catch((error) => {
        console.warn('Unable to check for relapse triggers', error);
        setRelapseTrigger(null);
      });
  }, [userId]);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const savedProgress = await AsyncStorage.getItem(CHECK_PROGRESS_KEY);
        const parsedProgress = savedProgress ? (JSON.parse(savedProgress) as SavedCheckProgress) : null;
        if (parsedProgress?.date === getStorageDate()) {
          setIndex(Math.min(parsedProgress.index, steps.length));
          setChecks(parsedProgress.checks);
        } else {
          setIndex(0);
          setChecks([]);
          if (parsedProgress) await AsyncStorage.removeItem(CHECK_PROGRESS_KEY);
        }
      } catch (error) {
        console.warn('Unable to load check progress', error);
      } finally {
        setIsHydrated(true);
      }
    };

    loadProgress();
  }, [devDate]);

  React.useEffect(() => {
    if (!isHydrated) return;

    const saveProgress = async () => {
      try {
        const progress: SavedCheckProgress = {
          date: getStorageDate(),
          index,
          checks,
        };
        await AsyncStorage.setItem(CHECK_PROGRESS_KEY, JSON.stringify(progress));
      } catch (error) {
        console.warn('Unable to save check progress', error);
      }
    };

    saveProgress();
  }, [checks, index, isHydrated]);

  const clearProgress = async () => {
    await AsyncStorage.removeItem(CHECK_PROGRESS_KEY);
    setIndex(0);
    setChecks([]);
  };

  const completeDevDay = async () => {
    const currentUserId = getCurrentUser()?.uid ?? userId;
    if (!currentUserId || isDevActionRunning) return;

    setIsDevActionRunning(true);
    setDevMessage(null);

    try {
      const existingRecords = await getCheckIns(currentUserId);
      const alreadyCompleted = existingRecords.some((record) =>
        record.completedDate === devDate ||
        (typeof record.completedAt === 'string' &&
          getLocalDate(record.completedAt) === devDate),
      );

      if (alreadyCompleted) {
        setDevMessage(`${devDate} is already complete.`);
        return;
      }

      const completeChecks: CheckRecord[] = steps.map((step, stepIndex) => ({
        step: stepIndex + 1,
        title: step.title,
        action: 'checked',
        completedAt: new Date(`${devDate}T12:00:00`).toISOString(),
      }));

      await saveDevelopmentCheckIn(currentUserId, devDate, completeChecks);

      setDevMessage(`Completed ${devDate}.`);
    } catch (error) {
      console.error('Unable to create dev check-in', error);
      setDevMessage('Unable to complete that day.');
    } finally {
      setIsDevActionRunning(false);
    }
  };

  const clearAllDevCheckIns = async () => {
    const currentUserId = getCurrentUser()?.uid ?? userId;
    if (!currentUserId || isDevActionRunning) return;

    setIsDevActionRunning(true);
    setDevMessage(null);

    try {
      const deletedCount = await deleteAllCheckIns(currentUserId);
      await clearProgress();
      setDevMessage(`Cleared ${deletedCount} daily check-in${deletedCount === 1 ? '' : 's'}.`);
    } catch (error) {
      console.error('Unable to clear daily check-ins', error);
      setDevMessage('Unable to clear daily check-ins.');
    } finally {
      setIsDevActionRunning(false);
    }
  };

  const devTools = DEV_TOOLS ? (
    <View className="px-5 mt-5 ">
      <DevTimeTravel />

      {devClockEnabled && (
        <View className="flex-row mt-3" style={{ gap: 10 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Complete simulated day"
            disabled={isDevActionRunning || !userId}
            onPress={completeDevDay}
            className="flex-1 rounded-xl bg-[#6b7a4f] px-3 py-3 items-center"
          >
            <Text className="text-[#e9e6d8] text-sm font-semibold text-center">
              {isDevActionRunning ? 'Working...' : 'Complete this day'}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear all daily check-ins"
            disabled={isDevActionRunning || !userId}
            onPress={clearAllDevCheckIns}
            className="flex-1 rounded-xl border border-red-400/60 bg-red-950/40 px-3 py-3 items-center"
          >
            <Text className="text-red-200 text-sm font-semibold text-center">
              Clear all check-ins
            </Text>
          </Pressable>
        </View>
      )}

      {devMessage && (
        <Text className="text-emerald-100/60 text-sm text-center mt-2">
          {devMessage}
        </Text>
      )}
    </View>
  ) : null;

  const saveCompletedCheckIn = async (completeChecks: CheckRecord[], note?: string) => {
    const currentUserId = getCurrentUser()?.uid ?? userId;
    if (!currentUserId) {
      throw new Error('You must be signed in to save this check-in.');
    }

    await saveCheckIn(currentUserId, completeChecks, note);
  };

  const finishRelapseNote = async (wasTriggered: boolean, note: string) => {
    if (!relapseTrigger || isSavingRelapseNote) return;

    setIsSavingRelapseNote(true);
    setSaveError(null);
    try {
      if (!userId) throw new Error('You must be signed in to save this note.');
      await updateTriggerFollowUp(userId, relapseTrigger.id, { wasTriggered, note });
      await saveCompletedCheckIn(checks);
      setRelapseTrigger(null);
      setIndex(TOTAL_STEPS);
    } catch (error) {
      console.error('Unable to save the completed check-in', error);
      setSaveError('Your check-in could not be saved. Please try again.');
    } finally {
      setIsSavingRelapseNote(false);
    }
  };

  const recordCheck = async (action: CheckRecord['action'], answer?: CheckRecord['answer']) => {
    const current = steps[index];
    if (!current) return;

    const check: CheckRecord = {
      step: index + 1,
      title: current.title,
      action,
      completedAt: getNow().toISOString(),
      ...(answer ? { answer } : {}),
    };

    const completeChecks = [
      ...checks.filter((existingCheck) => existingCheck.step !== check.step),
      check,
    ];

    setChecks(completeChecks);
    if (index !== steps.length - 1) {
      setIndex((currentIndex) => currentIndex + 1);
      return;
    }

    if (relapseTrigger) {
      setIndex(steps.length);
      return;
    }

    setSaveError(null);
    try {
      await saveCompletedCheckIn(completeChecks);
      setIndex(TOTAL_STEPS);
    } catch (error) {
      console.error('Unable to save the completed check-in', error);
      setSaveError('Your check-in could not be saved. Please try again.');
    }
  };

  if (!isHydrated) {
    return (
      <>
        {devTools}
        <View className="px-5 mt-8">
          <Text className="text-sm" style={{ color: HabitatColors.muted }}>Loading saved progress...</Text>
        </View>
      </>
    );
  }

  if (index === steps.length && relapseTrigger) {
    return (
      <>
        {devTools}
        <RelapseNoteCard
          step={steps.length + 1}
          totalSteps={TOTAL_STEPS}
          trigger={relapseTrigger}
          error={saveError}
          onSkip={async () => {
            await finishRelapseNote(false, '');
          }}
          onSave={finishRelapseNote}
        />
      </>
    );
  }

  if (index >= steps.length) {
    return (
      <View className="mx-5 mt-8 rounded-2xl border p-6" style={{ backgroundColor: HabitatColors.surface, borderColor: HabitatColors.border }}>
        {devTools}
        <View className="mt-4 h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: HabitatColors.highlight }}>
          <CircleCheck size={26} color={HabitatColors.onHighlight} />
        </View>
        <Text className="mt-6 uppercase" style={[Typography.sectionLabel, { color: HabitatColors.accent }]}>
          Practice complete
        </Text>
        <Text className="mt-2" style={[Typography.title, { color: HabitatColors.text }]}>
          You stayed present.
        </Text>
        <Text className="mt-3 text-base leading-6" style={{ color: HabitatColors.muted }}>
          That pause is the practice. Your tree has what it needs for today.
        </Text>
        <View className="mt-5 flex-row items-center">
          <Sprout size={17} color={HabitatColors.accent} />
          <Text className="ml-2 text-xs font-semibold" style={{ color: HabitatColors.text }}>
            {checks.length} of {steps.length} reflections complete
          </Text>
        </View>
        <Link href="/home" asChild>
          <Pressable
            accessibilityRole="button"
            className="mt-6 min-h-14 flex-row items-center justify-center rounded-full px-4"
            style={{ backgroundColor: HabitatColors.primary }}
          >
            <Text className="text-base font-semibold" style={{ color: HabitatColors.onPrimary }}>
              Return home
            </Text>
          </Pressable>
        </Link>
        {DEV_TOOLS && (
          <Pressable
            accessibilityRole="button"
            onPress={clearProgress}
            className="mt-4 self-center border-b py-1"
            style={{ borderColor: HabitatColors.border }}
          >
            <Text className="text-xs font-bold" style={{ color: HabitatColors.muted }}>
              Clear saved progress
            </Text>
          </Pressable>
        )}
      </View>
    );
  }

  const current = steps[index];
  const nextCard = steps[index + 1];

  const renderCard = (step: (typeof steps)[number], stepIndex: number) => (
    <CheckInCard
      step={stepIndex + 1}
      totalSteps={TOTAL_STEPS}
      title={step.title}
      question={step.question}
    />
  );

  return (
    <>
{devTools}

      <View className="px-5 mt-5">
        <Text className="text-[#a9b08e] text-sm">
          {checks.length} / {steps.length} checks completed
        </Text>
        {DEV_TOOLS && (
          <Pressable
            accessibilityRole="button"
            onPress={clearProgress}
            className="mt-2 self-start rounded-2xl border px-3 py-2"
            style={{ backgroundColor: HabitatColors.surface, borderColor: HabitatColors.border }}
          >
            <Text className="text-xs font-bold" style={{ color: HabitatColors.muted }}>Clear saved progress</Text>
          </Pressable>
        )}
      </View>

      <SwipeableCard
        nextCard={nextCard ? renderCard(nextCard, index + 1) : undefined}
        nextCardKey={index + 1}
        onSwipeLeft={() => recordCheck('swiped')}
        onSwipeRight={() => recordCheck('swiped')}
        animationSpeed={1.4}
      >
        {renderCard(current, index)}
      </SwipeableCard>

      {saveError ? (
        <Text className="mx-6 mt-3 text-center text-sm" style={{ color: HabitatColors.danger }} accessibilityLiveRegion="polite">
          {saveError}
        </Text>
      ) : null}

      <UrgeButtons
        onStrongUrge={() => recordCheck('checked', 'strongUrge')}
        onNoUrge={() => recordCheck('checked', 'noUrge')}
      />
    </>
  );
}