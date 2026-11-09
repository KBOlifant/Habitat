import { useCallback, useEffect, useState } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import '../global.css';
import ProgressHeader from '../../components/Milestones/progress-header';
import StatsRow from '../../components/Milestones/stats-row';
import Last30Days from '../../components/Milestones/last-30-days';
import TreeGrowth from '../../components/Milestones/tree-growth';
import Milestones from '../../components/Milestones/milestones';
import { observeAuthState } from '../../functions/auth';
import {
  fetchProgressStats,
  syncPlantState,
  type ProgressStats,
} from '../../functions/progress';
import { goBackOrHome } from '../../lib/navigation';
import ScreenTransition from '../../components/General/screen-transition';
import DevTimeTravel from '../../components/Home/dev-time-travel';
import { useDevClock } from '../../lib/dev-clock';
import { HabitatColors } from '@/constants/theme';

const EMPTY_STATS: ProgressStats = {
  streak: 0,
  resisted: 0,
  relapses: 0,
  checkIns: 0,
  last30Days: Array.from({ length: 30 }, () => 'missed'),
  streakStartDate: null,
};

export default function ProgressScreen() {
  const { width, height } = useWindowDimensions();
  const isWide = width > height;
  const router = useRouter();
  const { today: currentDate } = useDevClock();
  const selectedDate = currentDate;
  const [stats, setStats] = useState<ProgressStats>(EMPTY_STATS);
  const [focusVersion, setFocusVersion] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setFocusVersion((version) => version + 1);
    }, []),
  );

  useEffect(() => {
    const unsubscribeAuth = observeAuthState((user) => {
      if (!user) {
        setStats(EMPTY_STATS);
        return;
      }

      fetchProgressStats(user.uid, selectedDate)
        .then((result) => {
          setStats(result);
          // Keep the plant_state cache fresh for other screens (e.g. home.tsx's bonsai).
          syncPlantState(user.uid, result);
        })
        .catch((error) => {
          console.error('Unable to load trigger stats from Firestore', error);
          setStats(EMPTY_STATS);
        });
    });

    return () => {
      unsubscribeAuth();
    };
  }, [selectedDate, focusVersion]);

  return (
    <View style={{ flex: 1, backgroundColor: HabitatColors.canvas }}>
      <ScreenTransition>
        <ScrollView
          className="px-6"
          contentContainerStyle={{ paddingTop: isWide ? 24 : 56, paddingBottom: isWide ? 40 : 120, alignItems: 'center' }}
        >
          <View style={{ width: '100%', maxWidth: 1080 }}>
            <ProgressHeader onBack={() => goBackOrHome(router)} />
            <View style={{ flexDirection: isWide ? 'row' : 'column', alignItems: 'flex-start' }}>
              <View style={{ flex: isWide ? 1 : undefined, width: isWide ? undefined : '100%' }}>
                <StatsRow streak={stats.streak} resisted={stats.resisted} checkIns={stats.checkIns} />
                <TreeGrowth streakDays={stats.streak} />
              </View>
              <View style={{ flex: isWide ? 1 : undefined, width: isWide ? undefined : '100%' }}>
                <Last30Days days={stats.last30Days} />
                <Milestones streakDays={stats.streak} />
              </View>
            </View>
            <View className="px-6">
              <DevTimeTravel />
            </View>
          </View>
        </ScrollView>
      </ScreenTransition>
    </View>
  );
}
