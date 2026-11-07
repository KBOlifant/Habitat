import React, { forwardRef } from 'react';
import { Alert, ScrollView, Text, View, Pressable } from 'react-native';
import { Trash2, X } from 'lucide-react-native';
import SwipeableModal, { SwipeableModalRef } from '../General/SwipeableModal';
import type { Trigger } from '../../functions/triggers';

type TriggerReasoningModalProps = {
  trigger: Trigger | null;
  onClose: () => void;
  onDelete: (trigger: Trigger) => Promise<void>;
};

/**
 * Bottom sheet that shows the full 'reasoning' text for a trigger log entry.
 * Swipe down, tap the backdrop, or tap the close icon to dismiss.
 * Usage in trigger-log screen:
 *   const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null);
 *   ...
 *   <TriggerListItem trigger={trigger} onPress={() => setSelectedTrigger(trigger)} />
 *   ...
 *   <TriggerReasoningModal
 *     ref={reasoningModalRef}
 *     trigger={selectedTrigger}
 *     onClose={() => setSelectedTrigger(null)}
 *   />
 *
 * Since SwipeableModal is imperative (open()/close()), pair it with a ref and
 * an effect that calls open() whenever `trigger` becomes non-null - see the
 * bottom of this file for a ready-made wrapper that does that for you.
 */
export const TriggerReasoningModalInner = forwardRef<
  SwipeableModalRef,
  TriggerReasoningModalProps
>(({ trigger, onClose, onDelete }, ref) => {
  // Cache the last non-null trigger so its content stays visible while the
  // sheet is animating closed (trigger flips to null the instant the parent
  // clears selection, but the slide-down animation still needs data to render).
  const [displayTrigger, setDisplayTrigger] = React.useState<Trigger | null>(trigger);

  React.useEffect(() => {
    if (trigger) setDisplayTrigger(trigger);
  }, [trigger]);

  if (!displayTrigger) return null;
  const shown = displayTrigger;

  const formattedDate = new Date(shown.loggedAt).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const handleDelete = () => {
    Alert.alert('Delete trigger log?', 'This entry will be permanently removed from Firestore.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await onDelete(shown);
            onClose();
          } catch {
            Alert.alert('Unable to delete', 'The trigger log could not be removed.');
          }
        },
      },
    ]);
  };

  return (
    <SwipeableModal
      ref={ref}
      direction="bottom"
      onClose={onClose}
      className="px-6 pb-8"
      showHandle
    >
      <View className="flex-row items-start justify-between mb-1">
        <View className="flex-1 pr-4">
          <Text className="text-sm font-medium text-emerald-600 uppercase tracking-wide">
            {shown.name ?? 'Trigger'}
          </Text>
          <Text className="text-gray-400 text-sm mt-0.5">{formattedDate}</Text>
        </View>
        <Pressable
          onPress={onClose}
          hitSlop={12}
          className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
        >
          <X size={16} color="#6b7280" />
        </Pressable>
      </View>

      <ScrollView
        className="mt-4 max-h-[60vh]"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-base leading-6 text-gray-800">
          {shown.reason?.trim() ? shown.reason : 'No notes were added for this entry.'}
        </Text>
      </ScrollView>

      <Pressable
        onPress={handleDelete}
        accessibilityRole="button"
        accessibilityLabel="Delete trigger log"
        className="mt-5 flex-row items-center justify-center rounded-xl border border-red-300/40 bg-red-500/10 py-3"
      >
        <Trash2 size={16} color="#dc2626" />
        <Text className="ml-2 text-sm font-semibold text-red-600">Delete trigger log</Text>
      </Pressable>
    </SwipeableModal>
  );
});

TriggerReasoningModalInner.displayName = 'TriggerReasoningModalInner';

/**
 * Drop-in wrapper: owns the ref internally and opens/closes automatically
 * based on whether `trigger` is set, so the parent screen only needs one
 * piece of state (selectedTrigger) and doesn't have to juggle a ref.
 */
export default function TriggerReasoningModal({
  trigger,
  onClose,
  onDelete,
}: TriggerReasoningModalProps) {
  const ref = React.useRef<SwipeableModalRef>(null);

  React.useEffect(() => {
    if (trigger) {
      ref.current?.open();
    } else {
      ref.current?.close();
    }
  }, [trigger]);

  return (
    <TriggerReasoningModalInner
      ref={ref}
      trigger={trigger}
      onClose={onClose}
      onDelete={onDelete}
    />
  );
}
