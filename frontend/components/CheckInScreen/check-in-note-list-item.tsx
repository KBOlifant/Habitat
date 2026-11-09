import { Alert, Pressable, Text, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { HabitatColors } from '@/constants/theme';

type CheckInNoteListItemProps = {
  note: string;
  completedAt: string;
  onDelete: () => void | Promise<void>;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown date';
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function CheckInNoteListItem({
  note,
  completedAt,
  onDelete,
}: CheckInNoteListItemProps) {
  const handleDelete = () => {
    Alert.alert(
      'Delete note?',
      'This note will be permanently removed from Firestore.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await onDelete();
            } catch {
              Alert.alert('Unable to delete', 'The note could not be removed.');
            }
          },
        },
      ],
    );
  };

  return (
    <View className="rounded-2xl border p-5" style={{ backgroundColor: HabitatColors.surface, borderColor: HabitatColors.border }}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-sm font-bold" style={{ color: HabitatColors.muted }}>
            {formatDate(completedAt)}
          </Text>
          <Text className="mt-3 text-base leading-6" style={{ color: HabitatColors.text }}>{note}</Text>
        </View>
        <Pressable
          onPress={handleDelete}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Delete note"
          className="h-9 w-9 items-center justify-center"
        >
          <Trash2 size={16} color={HabitatColors.danger} />
        </Pressable>
      </View>
    </View>
  );
}