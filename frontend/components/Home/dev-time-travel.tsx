import { useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Minus, Plus, FlaskConical } from 'lucide-react-native';

const MIN_DATE = new Date(2000, 0, 1);
const MAX_DATE = new Date(2100, 11, 31);

type DevTimeTravelProps = {
  initialDate?: string; // 'YYYY-MM-DD'
  returnCurrentDate?: (currentDate: string) => void;
};

export const parseDate = (value: string): Date => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return new Date();

  const [, year, month, day] = match;
  const parsed = new Date(Number(year), Number(month) - 1, Number(day));
  const isValidDate =
    parsed.getFullYear() === Number(year) &&
    parsed.getMonth() === Number(month) - 1 &&
    parsed.getDate() === Number(day);

  return isValidDate ? parsed : new Date();
};

const formatIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function DevTimeTravel({
  initialDate = '2026-07-18',
  returnCurrentDate
}: DevTimeTravelProps) {
  const [date, setDate] = useState(() => parseDate(initialDate));

  const shiftDate = (deltaDays: number) => {
    const next = new Date(date);
    next.setDate(next.getDate() + deltaDays);

    if (next < MIN_DATE || next > MAX_DATE) return;

    setDate(next);
    returnCurrentDate?.(formatIsoDate(next));
  };

  const isToday = date.toDateString() === new Date().toDateString();
  const isoDate = formatIsoDate(date);

  return (
    <View className="mt-4 bg-emerald-950 border border-dashed border-emerald-800/60 rounded-2xl p-4">
      <View className="flex-row items-center mb-3">
        <FlaskConical size={13} color="#84cc16" />
        <Text className="text-lime-500 text-xs font-bold tracking-[1.5px] uppercase ml-1.5">
          Dev Time Travel
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
          <Text className="text-emerald-100/50 text-sm mt-0.5">{isoDate}</Text>
        </View>

        <TouchableOpacity
          onPress={() => shiftDate(1)}
          activeOpacity={0.7}
          className="w-9 h-9 rounded-full bg-emerald-900 items-center justify-center"
        >
          <Plus size={16} color="white" />
        </TouchableOpacity>
      </View>

      <Text className="text-emerald-100/40 text-sm text-center mt-3">
        Simulates streak as if it were that day
      </Text>
    </View>
  );
}