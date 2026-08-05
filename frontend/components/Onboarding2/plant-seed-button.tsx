import { TouchableOpacity, Text } from 'react-native';
import { Sprout } from 'lucide-react-native';

type PlantSeedButtonProps = {
  onPress?: () => void;
  disabled?: boolean;
  label?: string;
};

export default function PlantSeedButton({
  onPress,
  disabled = false,
  label = 'Plant my seed',
}: PlantSeedButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      className={`mx-6 flex-row items-center justify-center rounded-2xl py-4 ${
        disabled ? 'bg-emerald-800/50' : 'bg-[#5a6b4c]'
      }`}
      style={{ gap: 8 }}
    >
      <Text
        className={`text-base font-semibold ${
          disabled ? 'text-emerald-100/40' : 'text-white'
        }`}
      >
        {label}
      </Text>
      <Sprout size={18} color={disabled ? '#6b7a63' : '#ffffff'} />
    </TouchableOpacity>
  );
}
