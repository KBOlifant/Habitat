import { useState } from 'react';
import { TouchableOpacity, TextInput, View, Text } from 'react-native';
import { Plus } from 'lucide-react-native';

type OtherHabitInputProps = {
  isSelected: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onSelect: () => void;
};

export default function OtherHabitInput({
  isSelected,
  value,
  onChangeText,
  onSelect,
}: OtherHabitInputProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handlePress = () => {
    onSelect();
    setIsEditing(true);
  };

  if (isEditing || isSelected) {
    return (
      <View className="mx-6 mt-3 bg-emerald-900/60 border border-emerald-800/60 rounded-2xl px-4 flex-row items-center">
        <Plus size={18} color="#d1e7d4" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={onSelect}
          autoFocus={isEditing}
          placeholder="Something else..."
          placeholderTextColor="#8a9a80"
          className="flex-1 text-white text-base font-semibold ml-3 py-4"
        />
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.85}
      className="mx-6 mt-3 bg-emerald-900/60 border border-emerald-800/60 rounded-2xl px-4 py-4 flex-row items-center"
    >
      <Plus size={18} color="#d1e7d4" />
      <Text className="text-white text-base font-semibold ml-3">
        Something else...
      </Text>
    </TouchableOpacity>
  );
}
