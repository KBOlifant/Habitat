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
import React, { useState } from 'react';


export default function HomeScreen() {
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
        <HomeHeader />
        <BonsaiScreen progress={progress} />
        <CheckInButton />
        <AdditionalButtons />
        <QuoteSection />
        <DevTimeTravel />
      </ScrollView>
    </LinearGradient>
  );
}
