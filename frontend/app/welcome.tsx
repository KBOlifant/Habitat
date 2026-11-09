import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import { Gradients } from '@/constants/theme';

import './global.css';
import NameInput from '@/components/Onboarding1/name-input';
import ContinueButton from '@/components/Onboarding1/continue-button';

const NAME_KEY = 'habitat_user_name';

export default function WelcomeScreen() {
  const router = useRouter();
  const [name, setName] = useState('');

  const handleContinue = async () => {
    await SecureStore.setItemAsync(NAME_KEY, name.trim());
    router.replace('/habit');
  };

  return (
    <LinearGradient colors={Gradients.dark.darkGradient} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-1 px-6 pt-20">
          <View className="mb-10">
            <View className="rounded-3xl bg-white/10 px-5 py-6 shadow-lg shadow-black/10">
              <View className="mb-3">
                <View className="h-2 w-16 rounded-full bg-emerald-200/30" />
              </View>
              <View>
                <View className="mb-3">
                  <View className="h-12 w-12 rounded-3xl bg-emerald-100/20" />
                </View>
                <View className="space-y-2">
                  <View className="h-4 w-32 rounded-full bg-slate-100/30" />
                  <View className="h-4 w-48 rounded-full bg-slate-100/50" />
                </View>
              </View>
            </View>
          </View>

          <View className="mb-6">
            <View className="mb-2">
              <View className="h-2 w-20 rounded-full bg-emerald-100/50" />
            </View>
            <NameInput value={name} onChangeText={setName} />
          </View>

          <View className="flex-1" />

          <ContinueButton
            onPress={handleContinue}
            disabled={name.trim().length === 0}
          />

          <View className="h-10" />
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
