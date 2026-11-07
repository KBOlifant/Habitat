import { ScrollView, View, Text } from 'react-native';
import { useFocusEffect } from 'expo-router';
import '../global.css';
import HomeHeader from '../../components/Home/home-header';
import BonsaiScreen from '../../components/Home/bonsai-progess-screen';
import CheckInButton from '../../components/Home/check-in-button';
import AdditionalButtons from '../../components/Home/home-additional-buttons';
import QuoteSection from '../../components/Home/quote-section';
import DevTimeTravel from '../../components/Home/dev-time-travel';
import ScreenTransition from '../../components/General/screen-transition';
import { HabitatColors } from '@/constants/theme';
import React, { useState, useEffect, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { observeAuthState } from '../../functions/auth';
import { getPrimaryHabit } from '../../functions/users';
import { fetchProgressStats, syncPlantState, getLocalDate } from '../../functions/progress';


// Matches Tree Growth's "Ancient wisdom" stage (90+ days) so Home and the
// Progress screen agree on what a "fully grown" bonsai means.
const STREAK_DAYS_TO_FULL_GROWTH = 90;

export default function HomeScreen() {
  const [userName, setUserName] = useState<string>('User');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [habit, setHabit] = useState('');
  const initialDate = getLocalDate(new Date());
  const [currentDevDate, setDevDate] = useState(initialDate);
  const [progress, setProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [triggerCount, setTriggerCount] = useState(0);
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [focusVersion, setFocusVersion] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setFocusVersion((version) => version + 1);
    }, []),
  );

  useEffect(() => {
    return observeAuthState((user) => {
      setCurrentUser(user);
      setUserName(user?.displayName ?? 'User');
      if (!user) setHabit('');
    });
  }, []);

  useEffect(() => {
    const fetchHabit = async () => {
      if (!currentUser) {
        setHabit('');
        return;
      }

      try {
        const retrievedHabit = await getPrimaryHabit(currentUser.uid);
        setHabit(retrievedHabit?.name ?? '');
      } catch (error) {
        console.error('Error fetching habit:', error);
        setHabit('');
      }
    };

    fetchHabit();
  }, [currentUser, focusVersion]);

  // Bonsai growth was previously a fixed 90-day window off a hardcoded date,
  // completely disconnected from Firestore. It now tracks the same "current
  // streak" used on the Progress screen (components/Milestones/tree-growth.tsx),
  // so a relapse or missed check-in correctly sets the bonsai back too.
  useEffect(() => {
    if (!currentUser) {
      setProgress(0);
      setStreak(0);
      setTriggerCount(0);
      setCheckedInToday(false);
      return;
    }

    let cancelled = false;

    fetchProgressStats(currentUser.uid, currentDevDate)
      .then((stats) => {
        if (cancelled) return;
        setProgress(Math.min(stats.streak / STREAK_DAYS_TO_FULL_GROWTH, 1));
        setStreak(stats.streak);
        setTriggerCount(stats.resisted + stats.relapses);
        setCheckedInToday(stats.streak > 0);
        syncPlantState(currentUser.uid, stats);
      })
      .catch((error) => {
        console.error('Unable to load bonsai progress from Firestore', error);
        if (!cancelled) setProgress(0);
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser, currentDevDate, focusVersion]);

  return (
    <View style={{ flex: 1, backgroundColor: HabitatColors.canvas }}>
      <ScreenTransition>
        <ScrollView
          className="px-6"
          contentContainerStyle={{ paddingTop: 58, paddingBottom: 120 }}
        >
          <HomeHeader habitName={habit} userName={userName} streakDays={streak} habitFreeDays={streak} />
          <View className="mt-4 flex-row items-center border-2 px-3 py-2" style={{ backgroundColor: HabitatColors.surface, borderColor: HabitatColors.ink }}>
            <View className="mr-2 h-3 w-3 border" style={{ backgroundColor: checkedInToday ? HabitatColors.green : HabitatColors.pale, borderColor: HabitatColors.ink }} />
            <Text className="text-xs font-black uppercase tracking-wider" style={{ color: HabitatColors.ink }}>
              {checkedInToday ? 'Practice complete' : 'A new day to begin'}
            </Text>
          </View>
          <BonsaiScreen progress={progress} />
          <CheckInButton completed={checkedInToday} />
          <AdditionalButtons triggerCount={triggerCount} />
          <QuoteSection />
          {/* <DevTimeTravel initialDate={initialDate} returnCurrentDate={(currentDate) => setDevDate(currentDate)} /> */}
        </ScrollView>
      </ScreenTransition>
    </View>
  );
}
