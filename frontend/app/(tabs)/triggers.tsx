import { useCallback, useEffect, useState } from 'react';
import { ScrollView, View, Text, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { ChevronUp } from 'lucide-react-native';
import { HabitatColors } from '@/constants/theme';
import TriggerReasoningModal from '../../components/TriggerLog/trigger-reasoning-modal';
import '../global.css';
import TriggerLogHeader from '../../components/TriggerLog/trigger-log-header';
import EmptyState from '../../components/TriggerLog/empty-state';
import TriggerListItem from '../../components/TriggerLog/trigger-list-item';
import LogTriggerModal from '../../components/TriggerLog/log-trigger-modal';
import { useSwipeGesture } from '../../lib/hooks/use-swipe-gesture';
import { observeAuthState, type AuthUser } from '../../functions/auth';
import { goBackOrHome } from '../../lib/navigation';
import ScreenTransition from '../../components/General/screen-transition';
import {
  getTriggers,
  addTrigger,
  deleteTrigger,
  type Trigger,
  type NewTriggerInput,
} from '../../functions/triggers';

export default function TriggerLogScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadTriggers = useCallback(async () => {
    if (!user) {
      setTriggers([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError(null);
    try {
      setTriggers(await getTriggers(user.uid));
    } catch (error) {
      console.error('Unable to load trigger logs', error);
      setLoadError('Unable to load your trigger log. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    return observeAuthState(setUser);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTriggers();
    }, [loadTriggers]),
  );

  const handleSave = async (input: NewTriggerInput) => {
    if (!user) throw new Error('You must be signed in to save a trigger.');
    const trigger = await addTrigger(user.uid, input);

    setTriggers((existingTriggers) => [trigger, ...existingTriggers]);
    setIsModalVisible(false);
  };

  const handleDelete = async (trigger: Trigger) => {
    if (!user) throw new Error('You must be signed in to delete a trigger.');
    await deleteTrigger(user.uid, trigger.id);
    setTriggers((existingTriggers) =>
      existingTriggers.filter((existingTrigger) => existingTrigger.id !== trigger.id),
    );
  };

  // Swipe up on the handle bar below the list to open the log-trigger modal.
  const swipeUpHandlers = useSwipeGesture({
    direction: 'up',
    onSwipe: () => setIsModalVisible(true),
    enabled: !isModalVisible,
  });

  return (
    <View style={{ flex: 1, backgroundColor: HabitatColors.canvas }}>
      <ScreenTransition>
        <ScrollView
          contentContainerStyle={{ paddingTop: isLandscape ? 24 : 64, paddingBottom: isLandscape ? 24 : 120, flexGrow: 1 }}
          className="px-6"
        >
        <View style={{ flex: 1, flexDirection: isLandscape ? 'row' : 'column', gap: 24 }}>
          <View style={isLandscape ? { width: '32%' } : undefined}>
            <TriggerLogHeader
              onBack={() => goBackOrHome(router)}
              onAdd={() => setIsModalVisible(true)}
            />
          </View>

          <View style={isLandscape ? { flex: 1 } : undefined}>
            {isLoading ? (
              <View className="items-center mt-24">
                <ActivityIndicator color={HabitatColors.accent} />
              </View>
            ) : loadError ? (
              <Text className="mt-8 text-center" style={{ color: HabitatColors.danger }}>{loadError}</Text>
            ) : triggers.length === 0 ? (
              <EmptyState />
            ) : (
              <View className="mt-6" style={{ gap: 10 }}>
                {triggers.map((trigger) => (
                <TriggerListItem
                  key={trigger.id}
                  trigger={trigger}
                  onPress={() => setSelectedTrigger(trigger)}
                  onDelete={() => handleDelete(trigger)}
                />
              ))}
              </View>
            )}

            <View
              {...swipeUpHandlers}
              className="items-center pt-2 pb-6"
              accessibilityRole="button"
              accessibilityLabel="Swipe up to log a trigger"
            >
              <ChevronUp size={16} color={HabitatColors.muted} />
              <Text className="text-sm mt-0.5" style={{ color: HabitatColors.muted }}>
                Swipe up to log a trigger
              </Text>
            </View>
          </View>
        </View>
        </ScrollView>
      </ScreenTransition>

      {/* Pinned swipe-up handle — doesn't scroll, so it never fights the ScrollView's own gesture. */}
      

      <TriggerReasoningModal
        trigger={selectedTrigger}
        onClose={() => setSelectedTrigger(null)}
        onDelete={handleDelete}
      />

      <LogTriggerModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSave}
      />

    </View>
  );
}