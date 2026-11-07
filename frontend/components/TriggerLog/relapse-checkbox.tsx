import { TouchableOpacity, View, Text } from 'react-native';
import { Check } from 'lucide-react-native';
import { HabitatColors } from '@/constants/theme';

type RelapseCheckboxProps = {
  checked: boolean;
  onToggle: () => void;
  label?: string;
};

export default function RelapseCheckbox({
  checked,
  onToggle,
  label = 'Did you relapse?',
}: RelapseCheckboxProps) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.8}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      className="flex-row items-center mt-6 py-1"
      style={{ minHeight: 44 }}
    >
      <View
        className={`w-6 h-6 rounded-md items-center justify-center border ${
          checked
            ? 'bg-[#D7FF00] border-[#1B1C16]'
            : 'bg-[#FFFCF4] border-[#1B1C16]'
        }`}
        style={{ borderWidth: 2 }}
      >
        {checked && <Check size={14} color={HabitatColors.ink} strokeWidth={3} />}
      </View>

      <Text className="ml-3 text-sm font-bold" style={{ color: HabitatColors.ink }}>{label}</Text>
    </TouchableOpacity>
  );
}
