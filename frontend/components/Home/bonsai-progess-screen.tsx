import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';

const mil1 = require('../../assets/images/bonsai-states/mil1.png');
const mil2 = require('../../assets/images/bonsai-states/mil2.png');
const mil3 = require('../../assets/images/bonsai-states/mil3.png');
const mil4 = require('../../assets/images/bonsai-states/mil4.png');

type BonsaiScreenProps = {
  progress?: number; // Optional, default to 0
};

export default function BonsaiScreen({ progress = 50 }: BonsaiScreenProps) {
  let imageSource;
  if (progress < 20) {
    imageSource = mil1;
  } else if (progress >= 80) {
    imageSource = mil4;
  } else if (progress >= 50) {
    imageSource = mil3;
  } else { // progress >= 20 && progress < 50
    imageSource = mil2;
  }

  return (
    <View className="bg-emerald-50 rounded-3xl w-full m-auto mt-8 h-[340px] items-center justify-center">
      <Image
        source={imageSource}
        style={{ height: '100%', width: '100%', resizeMode: 'cover' }}
        contentFit="contain"
      />
    </View>
  );
}
