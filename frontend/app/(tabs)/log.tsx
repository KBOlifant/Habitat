import { useState } from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

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

  const handleAdd = () => {
    // navigate to / open the "log a trigger" flow
  };

  return (
    <ScrollView
      className="bg-emerald-950"
      contentContainerStyle={{ paddingTop: 64, paddingBottom: 40, flexGrow: 1 }}
    >
      <TriggerLogHeader onBack={() => router.back()} onAdd={handleAdd} />

      {triggers.length === 0 && <EmptyState />}
    </ScrollView>
  );
}
