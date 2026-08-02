import { useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Minus, Plus, FlaskConical } from 'lucide-react-native';

type DevTimeTravelProps = {
  initialDate?: string; // 'YYYY-MM-DD'
};

export default function DevTimeTravel({
  initialDate = '2026-07-18',
}: DevTimeTravelProps) {
  const [date, setDate] = useState(new Date(initialDate));

  const shiftDate = (deltaDays: number) => {
    setDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + deltaDays);
      return next;
    });
  };

  const isToday = date.toDateString() === new Date().toDateString();
  const isoDate = date.toISOString().slice(0, 10);

  return (
    <View className="mt-4 bg-emerald-950 border border-dashed border-emerald-800/60 rounded-2xl p-4">
      <View className="flex-row items-center mb-3">
        <FlaskConical size={13} color="#84cc16" />
        <Text className="text-lime-500 text-[11px] font-bold tracking-[1.5px] uppercase ml-1.5">
          Dev — Time Travel
        </Text>
      </View>

      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => shiftDate(-1)}
          activeOpacity={0.7}
          className="w-9 h-9 rounded-full bg-emerald-900 items-center justify-center"
        >
          <Minus size={16} color="white" />
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-white font-semibold text-base">
            {isToday ? 'Today' : date.toDateString()}
          </Text>
          <Text className="text-emerald-100/50 text-xs mt-0.5">{isoDate}</Text>
        </View>

        <TouchableOpacity
          onPress={() => shiftDate(1)}
          activeOpacity={0.7}
          className="w-9 h-9 rounded-full bg-emerald-900 items-center justify-center"
        >
          <Plus size={16} color="white" />
        </TouchableOpacity>
      </View>

      <Text className="text-emerald-100/40 text-[11px] text-center mt-3">
        Simulates streak as if it were that day
      </Text>
    </View>
  );
}