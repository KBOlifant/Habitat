import { Alert, View, Text, Pressable } from 'react-native';
import { AlertTriangle, Trash2 } from 'lucide-react-native';
import type { Trigger } from '../../functions/triggers';
import { getNow } from '@/lib/dev-clock';
import { HabitatColors } from '@/constants/theme';

type TriggerListItemProps = {
  trigger: Trigger;
  onPress?: () => void;
  onDelete?: () => void | Promise<void>;
};

function formatLoggedAt(iso: string): string {
  const date = new Date(iso);
  const today = getNow();
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
  if (intensity >= 4) return HabitatColors.danger;
  if (intensity >= 3) return '#d9b36c';
  return HabitatColors.accent;
}

export default function TriggerListItem({ trigger, onPress, onDelete }: TriggerListItemProps) {
  const tint = intensityColor(trigger.intensity);
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
    <Pressable
      onPress={onPress}
      className="flex-row items-start rounded-2xl border p-4"
      style={{ backgroundColor: HabitatColors.surface, borderColor: HabitatColors.border }}
    >
      <View className="flex-1">
        <View className="flex-row items-center">
          <Text className="text-sm font-semibold" style={{ color: HabitatColors.text }}>
            {trigger.name}
          </Text>
          {trigger.relapsed && (
            <View className="ml-2 flex-row items-center rounded-full px-2 py-0.5" style={{ backgroundColor: HabitatColors.danger }}>
              <AlertTriangle size={11} color={HabitatColors.onHighlight} />
              <Text className="ml-1 text-[11px] font-semibold" style={{ color: HabitatColors.onHighlight }}>
                Relapsed
              </Text>
            </View>
          )}
        </View>

        {!!trigger.reason && (
          <Text
            className="mt-1 text-sm"
            style={{ color: HabitatColors.muted }}
            numberOfLines={2}
          >
            {trigger.reason}
          </Text>
        )}

        <Text className="mt-2 text-xs" style={{ color: HabitatColors.muted }}>
          {formatLoggedAt(trigger.loggedAt)}
        </Text>
      </View>

      <View
        className="ml-3 h-8 w-8 items-center justify-center rounded-full border"
        style={{ backgroundColor: HabitatColors.canvas, borderColor: HabitatColors.border }}
      >
        <Text
          className="text-sm font-bold"
          style={{ color: tint }}
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
        className="ml-2 h-8 w-8 items-center justify-center"
      >
        <Trash2 size={16} color={HabitatColors.danger} />
      </Pressable>
    </Pressable>
  );
}
