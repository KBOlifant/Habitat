import { View, Text, Pressable } from 'react-native';
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
    <View className="h-[340px] w-4/5 overflow-hidden rounded-[24px] border border-[rgba(104,150,29,0.38)] bg-[#142014]">
      {/* Top Header: Progress (Left) & Icon (Right) */}
      <View className="flex-row items-center justify-between px-5 pt-5">
        <Text className="text-sm font-semibold text-[#7A9B6A]">{progress}</Text>
        <Ionicons name="sparkles-outline" size={22} color="#8EFA00" />
      </View>

      {/* Middle Content Section */}
      <View className="mt-12 mb-auto items-start px-5">
        <Text className="mb-4 font-[FrauncesBold] text-left text-xl text-[#eaf0e2]">{title}</Text>
        <Text className="font-[FrauncesRegular] text-left text-sm leading-5 text-[#cddac7]">
          {description}
        </Text>
      </View>

      {/* Bottom Seamless Action Buttons */}
      <View className="flex-row border-t border-[rgba(104,150,29,0.25)]">
        <Pressable 
          className="flex-1 items-center justify-center border-r border-[rgba(104,150,29,0.25)] py-4 active:bg-[rgba(104,150,29,0.15)]"
          onPress={onSecondaryPress}
        >
          <Text className="font-[FrauncesRegular] text-[15px] text-white/60">Skip</Text>
        </Pressable>

        <Pressable 
          className="flex-1 items-center justify-center py-4 active:bg-[rgba(104,150,29,0.15)]"
          onPress={onPrimaryPress}
        >
          <Text className="font-[FrauncesBold] text-[15px] text-[#8EFA00]">Continue</Text>
        </Pressable>
      </View>
    </View>
  );
};
