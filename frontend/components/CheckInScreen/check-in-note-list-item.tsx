import { Alert, Pressable, Text, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';

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
    <View className="rounded-3xl border border-[#2f3f2f] bg-[#182518] p-5">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-sm font-semibold text-[#8a9a8a]">
            {formatDate(completedAt)}
          </Text>
          <Text className="mt-3 text-base leading-6 text-[#b9c7b9]">{note}</Text>
        </View>
        <Pressable
          onPress={handleDelete}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Delete note"
          className="h-9 w-9 items-center justify-center rounded-full bg-red-500/10"
        >
          <Trash2 size={16} color="#f87171" />
        </Pressable>
      </View>
    </View>
  );
}