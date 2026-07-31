import { Image } from 'expo-image';
import { Platform, StyleSheet, View, Text } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Card from "../../components/swiper-card";

export default function HomeScreen() {
  return (
    <LinearGradient 
      colors={['#15190B', '#292F1A']} 
      style={styles.container}
      end={{x: 0.1, y: 0.2}}
      
    >
      <Text style={styles.text}>Hello Gradient!</Text>
      <Card />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
  },
});
