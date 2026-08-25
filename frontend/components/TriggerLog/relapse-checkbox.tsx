import { TouchableOpacity, View, Text } from 'react-native';
import { Check } from 'lucide-react-native';

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
            ? 'bg-red-500/80 border-red-500/80'
            : 'bg-emerald-900/60 border-emerald-700/60'
        }`}
      >
        {checked && <Check size={14} color="#fff" strokeWidth={3} />}
      </View>

      <Text className="text-white text-sm font-medium ml-3">{label}</Text>
    </TouchableOpacity>
  );
}
