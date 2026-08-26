import { useCallback, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import '../global.css';
import ProgressHeader from '../../components/Milestones/progress-header';
import StatsRow from '../../components/Milestones/stats-row';
import Last30Days from '../../components/Milestones/last-30-days';
import TreeGrowth from '../../components/Milestones/tree-growth';
import Milestones from '../../components/Milestones/milestones';
import DevTimeTravel from '../../components/Home/dev-time-travel';
import { Gradients } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../app/lib/firebase';
import {
  fetchProgressStats,
  syncPlantState,
  getLocalDate,
  type ProgressStats,
} from '../../app/lib/progress';
import { goBackOrHome } from '../lib/navigation';

const EMPTY_STATS: ProgressStats = {
  streak: 0,
  resisted: 0,
  relapses: 0,
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
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
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

  const scheme = useColorScheme() ?? 'light';
  const gradientColors =
    scheme === 'dark' ? Gradients.dark.darkGradient : Gradients.light.lightGradient;

  return (
    <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
      <ScrollView
        className="pt-16"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <ProgressHeader onBack={() => goBackOrHome(router)} />
        <StatsRow streak={stats.streak} resisted={stats.resisted} relapses={stats.relapses} />
        <Last30Days days={stats.last30Days} />
        <TreeGrowth streakDays={stats.streak} />
        <Milestones streakDays={stats.streak} />
        {/* <DevTimeTravel
          initialDate={currentDate}
          returnCurrentDate={setSelectedDate}
        /> */}
      </ScrollView>
    </LinearGradient>
  );
}
