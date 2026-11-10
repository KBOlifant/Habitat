import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';

const BONSAI_STATES = [
  require('../../assets/images/bonsai-states/bonsai_1_seed.png'),
  require('../../assets/images/bonsai-states/bonsai_2_sprout.png'),
  require('../../assets/images/bonsai-states/bonsai_3_sapling.png'),
  require('../../assets/images/bonsai-states/bonsai_4_young_tree.png'),
  require('../../assets/images/bonsai-states/bonsai_5_mature.png'),
];

// Streak days at which the bonsai moves to the next picture. These match the "Seven forms" on the
// dashboard (components/Milestones/tree-growth.tsx): first sprout at 1+, young sapling at 7+,
// formed bonsai at 30+ and ancient wisdom at 60+, so Home and Dashboard agree.
export const BONSAI_STAGE_STARTS = [0, 1, 7, 30, 60];

export function bonsaiStageForStreak(streakDays: number): number {
  let stage = 0;
  BONSAI_STAGE_STARTS.forEach((start, index) => {
    if (streakDays >= start) stage = index;
  });
  return stage;
}

type BonsaiScreenProps = {
  streakDays?: number;
};

export default function BonsaiScreen({ streakDays = 0 }: BonsaiScreenProps) {
  const stage = bonsaiStageForStreak(streakDays);

  return (
    <View>
      <Image
        source={BONSAI_STATES[stage]}
        style={{ width: '100%', aspectRatio: 1, borderRadius: 24 }}
        contentFit="contain"
        transition={600}
        accessibilityLabel={`Bonsai growth stage ${stage + 1} of ${BONSAI_STATES.length}`}
      />
    </View>
  );
}
