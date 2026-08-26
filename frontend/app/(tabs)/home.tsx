import { ScrollView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import '../global.css';
import HomeHeader from '../../components/Home/home-header';
import BonsaiScreen from '../../components/Home/bonsai-progess-screen';
import CheckInButton from '../../components/Home/check-in-button';
import AdditionalButtons from '../../components/Home/home-additional-buttons';
import QuoteSection from '../../components/Home/quote-section';
import DevTimeTravel from '../../components/Home/dev-time-travel';
import { useColorScheme } from 'react-native';
import { Gradients } from '@/constants/theme';
import React, { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '../../app/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { fetchProgressStats, syncPlantState, getLocalDate } from '../../app/lib/progress';

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
  const [focusVersion, setFocusVersion] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setFocusVersion((version) => version + 1);
    }, []),
  );

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
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
        const snapshot = await getDocs(
          collection(db, 'users', currentUser.uid, 'addiction_record')
        );
        const retrievedHabit = snapshot.docs[0]?.data().addiction;

        if (typeof retrievedHabit === 'string') {
          setHabit(retrievedHabit);
        } else {
          setHabit('');
        }
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
      return;
    }

    let cancelled = false;

    fetchProgressStats(currentUser.uid, currentDevDate)
      .then((stats) => {
        if (cancelled) return;
        setProgress(Math.min(stats.streak / STREAK_DAYS_TO_FULL_GROWTH, 1));
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

  const scheme = useColorScheme() ?? 'light';
  const gradientColors =
    scheme === 'dark' ? Gradients.dark.darkGradient : Gradients.light.lightGradient;

  return (
    <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
      <ScrollView
        className="px-6"
        contentContainerStyle={{ paddingTop: 64, paddingBottom: 120 }}
      >
        <HomeHeader habitName={habit} userName={userName} />
        <BonsaiScreen progress={progress} />
        <CheckInButton />
        <AdditionalButtons />
        <QuoteSection />
        {/* <DevTimeTravel initialDate={initialDate} returnCurrentDate={(currentDate) => setDevDate(currentDate)} /> */}
      </ScrollView>
    </LinearGradient>
  );
}
