import { useCallback, useEffect, useState } from 'react';
import { ScrollView, View, Text, ActivityIndicator, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronUp } from 'lucide-react-native';
import { Gradients } from '@/constants/theme';
import { onAuthStateChanged, type User } from 'firebase/auth';
import TriggerReasoningModal from '../../components/TriggerLog/trigger-reasoning-modal';
import '../global.css';
import TriggerLogHeader from '../../components/TriggerLog/trigger-log-header';
import EmptyState from '../../components/TriggerLog/empty-state';
import TriggerListItem from '../../components/TriggerLog/trigger-list-item';
import LogTriggerModal from '../../components/TriggerLog/log-trigger-modal';
import { useSwipeGesture } from '../lib/hooks/use-swipe-gesture';
import { auth } from '../lib/firebase';
import { goBackOrHome } from '../lib/navigation';
import {
  getTriggers,
  addTrigger,
  type Trigger,
  type NewTriggerInput,
} from '../lib/storage/trigger-storage';

export default function TriggerLogScreen() {
  const router = useRouter();
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null);

  const scheme = useColorScheme() ?? 'light';
  const gradientColors =
    scheme === 'dark' ? Gradients.dark.darkGradient : Gradients.light.lightGradient;

  const loadTriggers = useCallback(async () => {
    if (!user) {
      setTriggers([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      setTriggers(await getTriggers());
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    loadTriggers();
  }, [loadTriggers]);

  const handleSave = async (input: NewTriggerInput) => {
    const trigger = await addTrigger(input);

    setTriggers((existingTriggers) => [trigger, ...existingTriggers]);
    setIsModalVisible(false);
  };

  // Swipe up on the handle bar below the list to open the log-trigger modal.
  const swipeUpHandlers = useSwipeGesture({
    direction: 'up',
    onSwipe: () => setIsModalVisible(true),
    enabled: !isModalVisible,
  });

  return (
    <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: 64, paddingBottom: 120, flexGrow: 1 }}
        className="px-6"
      >
        <TriggerLogHeader
          onBack={() => goBackOrHome(router)}
          onAdd={() => setIsModalVisible(true)}
        />

        {isLoading ? (
          <View className="items-center mt-24">
            <ActivityIndicator color="#4ade80" />
          </View>
        ) : triggers.length === 0 ? (
          <EmptyState />
        ) : (
          <View className="mt-6" style={{ gap: 10 }}>
            {triggers.map((trigger) => (
                <TriggerListItem
                  key={trigger.id}
                  trigger={trigger}
                  onPress={() => setSelectedTrigger(trigger)}
                />
              ))}
          </View>
        )}

        <View
        {...swipeUpHandlers}
        className="items-center pt-2 pb-6 self-end"
        accessibilityRole="button"
        accessibilityLabel="Swipe up to log a trigger"
      >
        <ChevronUp size={16} color="#6b7a63" />
        <Text className="text-emerald-100/40 text-sm mt-0.5">
          Swipe up to log a trigger
        </Text>
      </View>
      </ScrollView>

      {/* Pinned swipe-up handle — doesn't scroll, so it never fights the ScrollView's own gesture. */}
      

      <TriggerReasoningModal
        trigger={selectedTrigger}
        onClose={() => setSelectedTrigger(null)}
      />

      <LogTriggerModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSave}
      />
    </LinearGradient>
  );
}