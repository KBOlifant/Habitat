import React from 'react';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
//import { LinearGradient } from 'expo-linear-gradient';
import CheckInHeader from '../../components/CheckInScreen/check-in-header';
import { HabitatColors } from '@/constants/theme';
import CardHolder from '../../components/CheckInScreen/card-holder';
import { goBackOrHome } from '../lib/navigation';
import { ScrollView } from 'react-native-gesture-handler';
import ScreenTransition from '../../components/General/screen-transition';


function useThemeColor(colorName: keyof typeof Colors.light) {
  const scheme = useColorScheme() ?? 'light';
  return Colors[scheme][colorName];
}

export default function DailyCheckInScreen() {
  const router = useRouter();

return (
  <View style={{ flex: 1, backgroundColor: HabitatColors.canvas }}>
    <ScreenTransition>
      <ScrollView contentContainerStyle={{paddingBottom: 80}}>
        <View style={{ flex: 1 }}>
          <CheckInHeader onBack={() => goBackOrHome(router)} />

          <CardHolder />

          <View className="flex-1" />

          <View className="h-16" />
        </View>
      </ScrollView>
    </ScreenTransition>
  </View>
);
}