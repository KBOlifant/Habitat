import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { BonsaiCanvas } from '../../app/Bonsai';

type BonsaiScreenProps = {
  progress?: number; // Optional, default to 0
};

export default function BonsaiScreen({ progress = 0.5 }: BonsaiScreenProps) {
  return (
    <View>
      <BonsaiCanvas growth={progress} />
    </View>
  );
}
