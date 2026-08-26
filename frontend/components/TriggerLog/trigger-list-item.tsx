import { Alert, View, Text, Pressable } from 'react-native';
import { AlertTriangle, Trash2 } from 'lucide-react-native';
import type { Trigger } from '../../app/lib/storage/trigger-storage';

type TriggerListItemProps = {
  trigger: Trigger;
  onPress?: () => void;
  onDelete?: () => void | Promise<void>;
};

function formatLoggedAt(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  const time = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  if (isToday) return `Today, ${time}`;

  return `${date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })}, ${time}`;
}

function intensityColor(intensity: number): string {
  if (intensity >= 4) return '#f87171'; // red
  if (intensity >= 3) return '#facc15'; // yellow
  return '#4ade80'; // green
}

export default function TriggerListItem({ trigger, onPress, onDelete }: TriggerListItemProps) {
  const handleDelete = () => {
    if (!onDelete) return;

    Alert.alert(
      'Delete trigger log?',
      'This entry will be permanently removed from Firestore.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await onDelete();
            } catch {
              Alert.alert('Unable to delete', 'The trigger log could not be removed.');
            }
          },
        },
      ],
    );
  };

  return (
    <Pressable onPress={onPress} className="bg-emerald-900/40 border border-emerald-800/50 rounded-2xl p-4 flex-row items-start">
      <View className="flex-1">
        <View className="flex-row items-center">
          <Text className="text-white text-sm font-semibold">
            {trigger.name}
          </Text>
          {trigger.relapsed && (
            <View className="flex-row items-center bg-red-500/15 rounded-full px-2 py-0.5 ml-2">
              <AlertTriangle size={10} color="#f87171" />
              <Text className="text-red-400 text-[10px] font-semibold ml-1">
                Relapsed
              </Text>
            </View>
          )}
        </View>

        {!!trigger.reason && (
          <Text
            className="text-emerald-100/50 text-sm mt-1"
            numberOfLines={2}
          >
            {trigger.reason}
          </Text>
        )}

        <Text className="text-emerald-100/30 text-sm mt-2">
          {formatLoggedAt(trigger.loggedAt)}
        </Text>
      </View>

      <View
        className="w-9 h-9 rounded-full items-center justify-center ml-3"
        style={{ backgroundColor: `${intensityColor(trigger.intensity)}20` }}
      >
        <Text
          className="text-sm font-bold"
          style={{ color: intensityColor(trigger.intensity) }}
        >
          {trigger.intensity}
        </Text>
      </View>

      <Pressable
        onPress={(event) => {
          event.stopPropagation();
          handleDelete();
        }}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Delete ${trigger.name}`}
        className="w-9 h-9 rounded-full items-center justify-center ml-2 bg-red-500/10"
      >
        <Trash2 size={16} color="#f87171" />
      </Pressable>
    </Pressable>
  );
}
