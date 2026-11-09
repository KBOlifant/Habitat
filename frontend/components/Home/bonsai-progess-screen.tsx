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

type BonsaiScreenProps = {
  progress?: number; // 0..1, split evenly across the five bonsai states
};

export default function BonsaiScreen({ progress = 0 }: BonsaiScreenProps) {
  const clamped = Math.min(Math.max(progress, 0), 1);
  const stage = Math.min(BONSAI_STATES.length - 1, Math.floor(clamped * BONSAI_STATES.length));

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
