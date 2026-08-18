import { useState } from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'react-native';
import { Gradients } from '@/constants/theme';

import '../global.css';
import TriggerLogHeader from '../../components/TriggerLog/trigger-log-header';
import EmptyState from '../../components/TriggerLog/empty-state';

export type Trigger = {
  id: string;
  label: string;
  loggedAt: string;
};

export default function TriggerLogScreen() {
  const router = useRouter();
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const scheme = useColorScheme() ?? 'light';
  const gradientColors =
    scheme === 'dark' ? Gradients.dark.darkGradient : Gradients.light.lightGradient;

  const handleAdd = () => {
    // navigate to / open the "log a trigger" flow
  };

  return (
    <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: 64, paddingBottom: 40, flexGrow: 1 }}
        className="px-6"
      >
        <TriggerLogHeader onBack={() => router.back()} onAdd={handleAdd} />

        {triggers.length === 0 && <EmptyState />}
      </ScrollView>
    </LinearGradient>
  );
}
