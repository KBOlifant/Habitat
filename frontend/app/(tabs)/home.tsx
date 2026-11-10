import { ScrollView, View, Text, useWindowDimensions } from 'react-native';
import { useFocusEffect } from 'expo-router';
import '../global.css';
import HomeHeader from '../../components/Home/home-header';
import BonsaiScreen from '../../components/Home/bonsai-progess-screen';
import CheckInButton from '../../components/Home/check-in-button';
import AdditionalButtons from '../../components/Home/home-additional-buttons';
import QuoteSection from '../../components/Home/quote-section';
import ScreenTransition from '../../components/General/screen-transition';
import { HabitatColors } from '@/constants/theme';
import React, { useState, useEffect, useCallback } from 'react';
import { observeAuthState, type AuthUser } from '../../functions/auth';
import { getPrimaryHabit } from '../../functions/users';
import { fetchProgressStats, syncPlantState } from '../../functions/progress';
import DevTimeTravel from '../../components/Home/dev-time-travel';
import { useDevClock } from '../../lib/dev-clock';


export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const isWide = width > height;
  const [userName, setUserName] = useState<string>('User');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [habit, setHabit] = useState('');
  const { today: currentDevDate } = useDevClock();
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

  // The bonsai follows the same current streak as the Progress screen's growth stages,
  // so a relapse or missed check-in correctly sets it back too.
  useEffect(() => {
    if (!currentUser) {
      setStreak(0);
      setTriggerCount(0);
      setCheckedInToday(false);
      return;
    }

    let cancelled = false;

    fetchProgressStats(currentUser.uid, currentDevDate)
      .then((stats) => {
        if (cancelled) return;
        setStreak(stats.streak);
        setTriggerCount(stats.resisted + stats.relapses);
        setCheckedInToday(stats.streak > 0);
        syncPlantState(currentUser.uid, stats);
      })
      .catch((error) => {
        console.error('Unable to load bonsai progress from Firestore', error);
        if (!cancelled) setStreak(0);
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
          contentContainerStyle={{ paddingTop: isWide ? 24 : 58, paddingBottom: isWide ? 40 : 120, alignItems: 'center' }}
        >
          <View style={{ width: '100%', maxWidth: 1080 }}>
            <HomeHeader habitName={habit} userName={userName} streakDays={streak} habitFreeDays={streak} />
            <View className="mt-4 flex-row items-center rounded-full border px-4 py-2" style={{ backgroundColor: HabitatColors.surface, borderColor: HabitatColors.border }}>
              <View className="mr-2 h-2.5 w-2.5 rounded-full border" style={{ backgroundColor: checkedInToday ? HabitatColors.accent : HabitatColors.raised, borderColor: HabitatColors.border }} />
              <Text className="text-xs font-semibold" style={{ color: HabitatColors.text }}>
                {checkedInToday ? 'Practice complete' : 'A new day to begin'}
              </Text>
            </View>
            <View className="mt-4" style={{ flexDirection: isWide ? 'row' : 'column', gap: 18, alignItems: 'flex-start' }}>
              <View style={{ flex: isWide ? 1.25 : undefined, width: isWide ? undefined : '100%' }}>
                <BonsaiScreen streakDays={streak} />
                <CheckInButton completed={checkedInToday} />
              </View>
              <View style={{ flex: isWide ? 1 : undefined, width: isWide ? undefined : '100%' }}>
                <AdditionalButtons triggerCount={triggerCount} />
                <QuoteSection />
              </View>
            </View>
            <DevTimeTravel onChanged={() => setFocusVersion((version) => version + 1)} />
          </View>
        </ScrollView>
      </ScreenTransition>
    </View>
  );
}
