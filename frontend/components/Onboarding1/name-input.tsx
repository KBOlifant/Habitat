import { TextInput, View, Text } from 'react-native';

type NameInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
};

export default function NameInput({
  value,
  onChangeText,
  label = 'Your Name',
  placeholder = 'How shall we call you?',
}: NameInputProps) {
  return (
    <View className="px-6 mt-10">
      <Text className="text-emerald-100/50 text-xs font-semibold tracking-[2px] uppercase mb-2">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#5c6b52"
        className="bg-[#a9b596] rounded-2xl px-4 py-4 text-[#2f3a2a] text-base"
      />
    </View>
  );
}
