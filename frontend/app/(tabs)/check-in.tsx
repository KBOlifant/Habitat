import React from 'react';
import { useRouter } from 'expo-router';
import { View, useWindowDimensions } from 'react-native';
import CheckInHeader from '../../components/CheckInScreen/check-in-header';
import { HabitatColors } from '@/constants/theme';
import CardHolder from '../../components/CheckInScreen/card-holder';
import { goBackOrHome } from '../../lib/navigation';
import { ScrollView } from 'react-native-gesture-handler';
import ScreenTransition from '../../components/General/screen-transition';
export default function DailyCheckInScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <View style={{ flex: 1, backgroundColor: HabitatColors.canvas }}>
      <ScreenTransition>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: isLandscape ? 24 : 80 }}>
          <View style={{ flex: 1, flexDirection: isLandscape ? 'row' : 'column' }}>
            <View style={isLandscape ? { width: '32%', paddingTop: 24 } : undefined}>
              <CheckInHeader onBack={() => goBackOrHome(router)} />
            </View>
            <View style={isLandscape ? { flex: 1, paddingTop: 24 } : undefined}>
              <CardHolder />
            </View>
          </View>
        </ScrollView>
      </ScreenTransition>
    </View>
  );
}