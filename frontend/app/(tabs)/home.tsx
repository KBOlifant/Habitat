import { ScrollView } from 'react-native';
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
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '../../app/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function HomeScreen() {
  const [userName, setUserName] = useState<string>('User');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [habit, setHabit] = useState('');

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setUserName(user?.displayName ?? "User");
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
  }, [currentUser]);

  const scheme = useColorScheme() ?? 'light';
  const gradientColors =
    scheme === 'dark' ? Gradients.dark.darkGradient : Gradients.light.lightGradient;

  const [progress, setProgress] = useState(0.5); // Hardcoded progress for now

  return (
    <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
      <ScrollView
        className="px-6"
        contentContainerStyle={{ paddingTop: 64, paddingBottom: 40 }}
      >
        <HomeHeader habitName={habit} userName={userName} />
        <BonsaiScreen progress={progress} />
        <CheckInButton />
        <AdditionalButtons />
        <QuoteSection />
        <DevTimeTravel />
      </ScrollView>
    </LinearGradient>
  );
}
