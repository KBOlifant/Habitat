import { View, Text } from 'react-native';
import { Typography } from '@/constants/typography';

const TRUNK_COLOR = '#a9663f';
const CANOPY_COLOR = '#4d6b45';
const CANOPY_COLOR_LIGHT = '#5c7a52';
const LEAF_COLOR = '#4d6b45';

function TreeLeaf({
  style,
}: {
  style: { left?: number; right?: number; top: number; rotate: string };
}) {
  return (
    <View
      style={{
        position: 'absolute',
        width: 16,
        height: 8,
        borderRadius: 8,
        backgroundColor: LEAF_COLOR,
        transform: [{ rotate: style.rotate }],
        left: style.left,
        right: style.right,
        top: style.top,
      }}
    />
  );
}

function HabitatMark() {
  return (
    <View style={{ width: 180, height: 130 }}>
      {/* Canopies */}
      <View
        style={{
          position: 'absolute',
          left: 14,
          top: 0,
          width: 68,
          height: 52,
          borderRadius: 34,
          backgroundColor: CANOPY_COLOR,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: 32,
          top: 6,
          width: 34,
          height: 26,
          borderRadius: 17,
          backgroundColor: CANOPY_COLOR_LIGHT,
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: 14,
          top: 0,
          width: 68,
          height: 52,
          borderRadius: 34,
          backgroundColor: CANOPY_COLOR,
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: 32,
          top: 6,
          width: 34,
          height: 26,
          borderRadius: 17,
          backgroundColor: CANOPY_COLOR_LIGHT,
        }}
      />

      {/* Trunks */}
      <View
        style={{
          position: 'absolute',
          left: 42,
          top: 34,
          width: 11,
          height: 90,
          backgroundColor: TRUNK_COLOR,
          borderRadius: 6,
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: 42,
          top: 34,
          width: 11,
          height: 90,
          backgroundColor: TRUNK_COLOR,
          borderRadius: 6,
        }}
      />

      {/* Crossbar (forms the "H") */}
      <View
        style={{
          position: 'absolute',
          left: 47,
          top: 72,
          width: 86,
          height: 10,
          backgroundColor: TRUNK_COLOR,
          borderRadius: 5,
        }}
      />

      {/* Small leaf sprigs */}
      <TreeLeaf style={{ left: 20, top: 60, rotate: '-25deg' }} />
      <TreeLeaf style={{ left: 26, top: 92, rotate: '20deg' }} />
      <TreeLeaf style={{ right: 20, top: 60, rotate: '25deg' }} />
      <TreeLeaf style={{ right: 26, top: 92, rotate: '-20deg' }} />
    </View>
  );
}

type HabitatLogoProps = {
  appName?: string;
  tagline?: string;
};

export default function HabitatLogo({
  appName = 'Habitat',
  tagline = 'Break habits. Grow stillness.\nTend your inner bonsai.',
}: HabitatLogoProps) {
  return (
    <View className="items-center">
      <HabitatMark />

      <Text className="text-emerald-100/50 text-xs font-semibold tracking-[3px] uppercase mt-3">
        Welcome to
      </Text>
      <Text className="text-[#e9e6d8] mt-1" style={Typography.title}>{appName}</Text>
      <Text className="text-emerald-100/60 text-center mt-3" style={Typography.subtitle}>
        {tagline}
      </Text>
    </View>
  );
}
