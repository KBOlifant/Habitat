import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
//import { LinearGradient } from 'expo-linear-gradient';
import TriggerHeader from '../../components/TriggerPage/trigger-header';
import CheckInCard from '../../components/CheckInScreen/check-in-card';
import UrgeButtons from '../../components/CheckInScreen/urge-swiper-card';
import { Colors } from '@/constants/theme';
import { Gradients } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import CardHolder from '../../components/CheckInScreen/card-holder';


function useThemeColor(colorName: keyof typeof Colors.light) {
  const scheme = useColorScheme() ?? 'light';
  return Colors[scheme][colorName];
}

export default function DailyCheckInScreen() {
  const backgroundColor = useThemeColor('background');

  const handleBack = () => {
    // navigation.goBack()
  };

  const handleStrongUrge = () => {
    // record "strong urge" answer, advance to next step
  };

  const handleNoUrge = () => {
    // record "no urge" answer, advance to next step
  };

  const scheme = useColorScheme() ?? 'light';
  const gradientColors =
    scheme === 'dark' ? Gradients.dark.darkGradient : Gradients.light.lightGradient;

return (
  <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
    <View style={{ flex: 1 }}>
      <TriggerHeader onBack={handleBack} />
    </View>
  </LinearGradient>
);
}