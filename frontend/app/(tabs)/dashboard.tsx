import { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import '../global.css';
import ProgressHeader from '../../components/Milestones/progress-header';
import StatsRow from '../../components/Milestones/stats-row';
import Last30Days from '../../components/Milestones/last-30-days';
import TreeGrowth from '../../components/Milestones/tree-growth';
import Milestones from '../../components/Milestones/milestones';
import DevTimeTravel from '../../components/Home/dev-time-travel';
import { observeAuthState } from '../../functions/auth';
import {
  fetchProgressStats,
  syncPlantState,
  getLocalDate,
  type ProgressStats,
} from '../../functions/progress';
import { goBackOrHome } from '../lib/navigation';
import ScreenTransition from '../../components/General/screen-transition';
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
  const router = useRouter();
  const currentDate = getLocalDate(new Date());
  const [selectedDate, setSelectedDate] = useState(currentDate);
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
          className="pt-14"
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <ProgressHeader onBack={() => goBackOrHome(router)} />
          <StatsRow streak={stats.streak} resisted={stats.resisted} checkIns={stats.checkIns} />
          <Last30Days days={stats.last30Days} />
          <TreeGrowth streakDays={stats.streak} />
          <Milestones streakDays={stats.streak} />
          {/* <DevTimeTravel
            initialDate={currentDate}
            returnCurrentDate={setSelectedDate}
          /> */}
        </ScrollView>
      </ScreenTransition>
    </View>
  );
}
