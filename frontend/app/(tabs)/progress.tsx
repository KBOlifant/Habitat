import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import '../global.css';
import ProgressHeader from '../../components/Milestones/progress-header';
import StatsRow from '../../components/Milestones/stats-row';
import Last30Days from '../../components/Milestones/last-30-days';
import TreeGrowth from '../../components/Milestones/tree-growth';
import Milestones from '../../components/Milestones/milestones';
import { Gradients } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { Line } from 'react-native-svg';

export default function ProgressScreen() {
  const router = useRouter();

  const scheme = useColorScheme() ?? 'light';
  const gradientColors =
    scheme === 'dark' ? Gradients.dark.darkGradient : Gradients.light.lightGradient;

  return (
    <LinearGradient colors={gradientColors} style={{ flex: 1 }}> 
      <ScrollView
        className="pt-16"
      >
        <ProgressHeader onBack={() => router.back()} />
        <StatsRow />
        <Last30Days />
        <TreeGrowth />
        <Milestones />
      </ScrollView>
    </LinearGradient>
  );
}
