import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useRouter } from 'expo-router';

import '../global.css';
//import HabitatLogo from '../../components/Onboarding1/habitat-logo1';
import NameInput from '../../components/Onboarding1/name-input';
import ContinueButton from '../../components/Onboarding1/continue-button';

export default function WelcomeScreen() {
  const router = useRouter();
  const [name, setName] = useState('');

  const handleContinue = () => {
    // persist name, then advance to the next onboarding step
    // router.push('/onboarding/next-step');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-emerald-950"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-1 pt-16">
        <View className="mt-10">
          {/* <HabitatLogo /> */}
        </View>

        <NameInput value={name} onChangeText={setName} />

        <View className="flex-1" />

        <ContinueButton
          onPress={handleContinue}
          disabled={name.trim().length === 0}
        />

        <View className="h-10" />
      </View>
    </KeyboardAvoidingView>
  );
}
