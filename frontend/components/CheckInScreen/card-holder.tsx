import React, { useState, useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckInCard from './check-in-card';
import SwipeableCard from '../General/swipeable-card';
import DevTimeTravel from '../Home/dev-time-travel';
import { addDoc, collection, deleteDoc, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../app/lib/firebase';

const CHECK_PROGRESS_KEY = 'habitat_check_progress';

const steps = [
  { title: 'Mood Check', question: 'Notice your emotional state without judgement. What\'s present for you in this moment?' },
  { title: 'Urge Check', question: 'How are you feeling right now?' },
  { title: 'Minfullness Check', question: 'Breathe. Take three slow, deep breaths, inhale through your nose for 4 counts, hold for 4 more cound, then exhale for 6. Your breath is always here' },
  // { title: 'Gratitude Check', question: 'How are you feeling right now?' },
  { title: 'Today\'s Intention', question: 'Your bonsai grows day by day. What small choice can you make today that your future self will thank you for?' },
];

export type CheckRecord = {
  step: number;
  title: string;
  action: 'checked' | 'swiped';
  answer?: 'strongUrge' | 'noUrge';
  completedAt: string;
};

type SavedCheckProgress = {
  date: string;
  index: number;
  checks: CheckRecord[];
};

const getStorageDate = () => {
  const now = new Date();
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
  const [devDate, setDevDate] = useState(getStorageDate());
  const [isDevActionRunning, setIsDevActionRunning] = useState(false);
  const [devMessage, setDevMessage] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid ?? null);
    });
  }, []);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const savedProgress = await AsyncStorage.getItem(CHECK_PROGRESS_KEY);
        if (savedProgress) {
          const parsedProgress = JSON.parse(savedProgress) as SavedCheckProgress;
          if (parsedProgress.date === getStorageDate()) {
            setIndex(Math.min(parsedProgress.index, steps.length));
            setChecks(parsedProgress.checks);
          } else {
            await AsyncStorage.removeItem(CHECK_PROGRESS_KEY);
          }
        }
      } catch (error) {
        console.warn('Unable to load check progress', error);
      } finally {
        setIsHydrated(true);
      }
    };

    loadProgress();
  }, []);

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
    const currentUserId = auth.currentUser?.uid ?? userId;
    if (!currentUserId || isDevActionRunning) return;

    setIsDevActionRunning(true);
    setDevMessage(null);

    try {
      const checkInCollection = collection(db, 'users', currentUserId, 'check_in_record');
      const existingRecords = await getDocs(checkInCollection);
      const alreadyCompleted = existingRecords.docs.some(
        (record) => {
          const data = record.data();
          return (
            data.completedDate === devDate ||
            (typeof data.completedAt === 'string' && getLocalDate(data.completedAt) === devDate)
          );
        },
      );

      if (alreadyCompleted) {
        setDevMessage(`${devDate} is already complete.`);
        return;
      }

      const completedAt = new Date(`${devDate}T12:00:00`).toISOString();
      const completeChecks: CheckRecord[] = steps.map((step, stepIndex) => ({
        step: stepIndex + 1,
        title: step.title,
        action: 'checked',
        completedAt,
      }));

      await addDoc(checkInCollection, {
        daily_check: true,
        has_relapsed: false,
        checks: completeChecks,
        uid: currentUserId,
        completedAt,
        completedDate: devDate,
        devGenerated: true,
      });

      setDevMessage(`Completed ${devDate}.`);
    } catch (error) {
      console.error('Unable to create dev check-in', error);
      setDevMessage('Unable to complete that day.');
    } finally {
      setIsDevActionRunning(false);
    }
  };

  const clearAllDevCheckIns = async () => {
    const currentUserId = auth.currentUser?.uid ?? userId;
    if (!currentUserId || isDevActionRunning) return;

    setIsDevActionRunning(true);
    setDevMessage(null);

    try {
      const checkInCollection = collection(db, 'users', currentUserId, 'check_in_record');
      const records = await getDocs(checkInCollection);
      await Promise.all(records.docs.map((record) => deleteDoc(record.ref)));
      await clearProgress();
      setDevMessage(`Cleared ${records.size} daily check-in${records.size === 1 ? '' : 's'}.`);
    } catch (error) {
      console.error('Unable to clear daily check-ins', error);
      setDevMessage('Unable to clear daily check-ins.');
    } finally {
      setIsDevActionRunning(false);
    }
  };

  const devTools = __DEV__ ? (
    <View className="px-5 mt-5 ">
      <DevTimeTravel
        initialDate={getStorageDate()}
        returnCurrentDate={setDevDate}
      />

      <View className="flex-row mt-3" style={{ gap: 10 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Complete simulated day"
          disabled={isDevActionRunning || !userId}
          onPress={completeDevDay}
          className="flex-1 rounded-xl bg-lime-600 px-3 py-3 items-center"
        >
          <Text className="text-emerald-950 text-sm font-semibold text-center">
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

      {devMessage && (
        <Text className="text-emerald-100/60 text-sm text-center mt-2">
          {devMessage}
        </Text>
      )}
    </View>
  ) : null;

  const recordCheck = async (action: CheckRecord['action'], answer?: CheckRecord['answer']) => {
    const current = steps[index];
    if (!current) return;

    const check: CheckRecord = {
      step: index + 1,
      title: current.title,
      action,
      completedAt: new Date().toISOString(),
      ...(answer ? { answer } : {}),
    };

    const completeChecks = [
      ...checks.filter((existingCheck) => existingCheck.step !== check.step),
      check,
    ];

    setChecks(completeChecks);
    setIndex((currentIndex) => currentIndex + 1);

    if (index !== steps.length - 1) {
      return;
    }

    const currentUserId = auth.currentUser?.uid ?? userId;
    if (!currentUserId) {
      console.warn('All checks recorded locally because no Firebase user is signed in');
      return;
    }

    try {
      await addDoc(collection(db, 'users', currentUserId, 'check_in_record'), {
        daily_check: true,
        has_relapsed: false,
        checks: completeChecks,
        uid: currentUserId,
        completedAt: check.completedAt,
      });
    } catch (error) {
      console.error('Unable to save completed check-in to Firestore', error);
    }
  };

  if (!isHydrated) {
    return (
      <>
        {devTools}
        <View className="px-5 mt-8">
          <Text className="text-[#8a9a8a] text-sm">Loading saved progress...</Text>
        </View>
      </>
    );
  }

  if (index >= steps.length) {
    return (
      <View className="px-5 mt-8">
        {devTools}
        <Text className="text-[#f3efe3] text-lg font-medium">All checks complete</Text>
        <Text className="text-[#8a9a8a] text-sm mt-2">
          {checks.length} / {steps.length} cards checked or swiped
        </Text>
        {__DEV__ && (
          <Pressable
            accessibilityRole="button"
            onPress={clearProgress}
            className="mt-5 self-start rounded-xl border border-[#6f8a6f] px-4 py-2"
          >
            <Text className="text-[#9cc49c]">Clear saved progress</Text>
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
      totalSteps={steps.length}
      title={step.title}
      question={step.question}
    />
  );

  return (
    <>
    
      {devTools}

      <View className="px-5 mt-5">
        <Text className="text-[#8a9a8a] text-sm">
          {checks.length} / {steps.length} checks completed
        </Text>
        {__DEV__ && (
          <Pressable
            accessibilityRole="button"
            onPress={clearProgress}
            className="mt-2 self-start border rounded-lg p-2 bg-red-200 border-red-600"
          >
            <Text className="text-[#c96b5f] text-sm font-semibold">Clear saved progress</Text>
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

      {/* <UrgeButtons
        onStrongUrge={() => recordCheck('checked', 'strongUrge')}
        onNoUrge={() => recordCheck('checked', 'noUrge')}
      /> */}
    </>
  );
}