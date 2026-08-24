import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
//import { LinearGradient } from 'expo-linear-gradient';
import CheckInHeader from '../../components/CheckInScreen/check-in-header';
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

  const scheme = useColorScheme() ?? 'light';
  const gradientColors =
    scheme === 'dark' ? Gradients.dark.darkGradient : Gradients.light.lightGradient;

return (
  <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
    <View style={{ flex: 1 }}>
      <CheckInHeader onBack={handleBack} />

      <CardHolder />

      <View className="flex-1" />

      <View className="h-16" />
    </View>
  </LinearGradient>
);
}