import { StyleSheet, View, Text, Pressable } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { 
  useFonts, 
  Fraunces_400Regular, 
  Fraunces_700Bold 
} from '@expo-google-fonts/fraunces';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface CardProps {
  progress?: string;
  title?: string;
  description?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
}

export const Card = ({
  progress = '2 / 5',
  title = 'Card Title',
  description = 'This is a description section placed in the middle of the card. It aligns to the left and explains the context or next action.',
  onPrimaryPress,
  onSecondaryPress,
}: CardProps) => {
  const [fontsLoaded, fontError] = useFonts({
    FrauncesRegular: Fraunces_400Regular,
    FrauncesBold: Fraunces_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.cardStyle}>
      {/* Top Header: Progress (Left) & Icon (Right) */}
      <View style={styles.header}>
        <Text style={styles.progressText}>{progress}</Text>
        <Ionicons name="sparkles-outline" size={22} color="#8EFA00" />
      </View>

      {/* Middle Content Section */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      {/* Bottom Seamless Action Buttons */}
      <View style={styles.actionsContainer}>
        <Pressable 
          style={({ pressed }) => [
            styles.button, 
            styles.borderRight,
            pressed && styles.pressed
          ]} 
          onPress={onSecondaryPress}
        >
          <Text style={styles.secondaryButtonText}>Skip</Text>
        </Pressable>

        <Pressable 
          style={({ pressed }) => [
            styles.button, 
            pressed && styles.pressed
          ]} 
          onPress={onPrimaryPress}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardStyle: {
    width: '80%',
    height: 340,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(104, 150, 29, 0.38)',
    backgroundColor: '#142014',
    overflow: 'hidden', // Ensures seamless bottom buttons follow the card's border radius
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  progressText: {
    color: '#7A9B6A',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 20,
    alignItems: 'flex-start', // Text aligns left
    marginBottom: 'auto',   // Keeps title and description centered vertically
    marginTop: 48
  },
  title: {
    fontFamily: 'FrauncesBold',
    fontSize: 20,
    color: '#eaf0e2',
    marginBottom: 16,
    textAlign: 'left',
  },
  description: {
    fontFamily: 'FrauncesRegular',
    fontSize: 14,
    color: "#cddac7",
    lineHeight: 20,
    textAlign: 'left',
  },
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(104, 150, 29, 0.25)',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(104, 150, 29, 0.25)',
  },
  pressed: {
    backgroundColor: 'rgba(104, 150, 29, 0.15)',
  },
  primaryButtonText: {
    fontFamily: 'FrauncesBold',
    fontSize: 15,
    color: '#8EFA00',
  },
  secondaryButtonText: {
    fontFamily: 'FrauncesRegular',
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});