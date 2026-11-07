// app/auth/index.tsx
//
// Combined Login / Sign up screen for Habitat.
// Route: /auth
//
// Reuses the same dark, warm "bonsai" visual language as the onboarding
// welcome screen (dark olive background, cream serif headline, sage pill
// inputs, olive pill CTA button).
//
// Data needs:
//   - name (sign up only), email, password — local component state
//   - Firebase Auth for email/password + Google credential sign-in (functions/auth)
//   - Firestore `users/{uid}` doc is created on first sign-up / first Google sign-in
//
// Edge cases handled:
//   - Toggling between Sign in / Sign up preserves email but clears password
//   - Inline error banner for Firebase auth errors (see authErrorMessage)
//   - Submit button disabled while request in flight, and while fields are empty
//   - Basic client-side validation (email format, password length, name required for sign up)

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
// import GoogleButton from '../components/Auth/GoogleButton';
import {
  signInWithEmail,
  signUpWithEmail,
  authErrorMessage,
} from '../functions/auth';
import { Typography } from '@/constants/typography';

type Mode = 'signIn' | 'signUp';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignUp = mode === 'signUp';

  const canSubmit =
    !submitting &&
    EMAIL_RE.test(email.trim()) &&
    password.length >= 6 &&
    (!isSignUp || name.trim().length > 0);

  const toggleMode = () => {
    setMode(isSignUp ? 'signIn' : 'signUp');
    setPassword('');
    setError(null);
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      if (isSignUp) {
        await signUpWithEmail(name, email, password);
      } else {
        await signInWithEmail(email, password);
      }
    
      if(isSignUp){
        router.replace('/habit');
      }else{
        router.replace('/home');
      }
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#181f11]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-between px-6 pb-8 pt-10">
            {/* Header */}
            <View>
              <Text className="text-center text-xs tracking-[3px] text-[#a9b08e]">
                WELCOME TO
              </Text>
              <Text
                className="mt-2 text-center text-[#e9e6d8]"
                style={Typography.title}
              >
                Habitat
              </Text>
              <Text className="mt-3 text-center text-[#a9b08e]" style={Typography.subtitle}>
                {isSignUp
                  ? 'Break habits. Grow stillness.\nTend your inner bonsai.'
                  : 'Welcome back — your bonsai\nhas been waiting.'}
              </Text>
            </View>

            {/* Form */}
            <View className="mt-10 gap-4">
              {isSignUp && (
                <Field
                  label="YOUR NAME"
                  value={name}
                  onChangeText={setName}
                  placeholder="How shall we call you?"
                  autoCapitalize="words"
                  accessibilityLabel="Your name"
                />
              )}

              <Field
                label="EMAIL"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                accessibilityLabel="Email address"
              />

              <Field
                label="PASSWORD"
                value={password}
                onChangeText={setPassword}
                placeholder={isSignUp ? 'At least 6 characters' : 'Your password'}
                secureTextEntry
                accessibilityLabel="Password"
              />

              {error && (
                <Text
                  className="text-center text-base text-[#e0a37a]"
                  accessibilityLiveRegion="polite"
                >
                  {error}
                </Text>
              )}

              {/* Primary CTA */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={isSignUp ? 'Create account' : 'Sign in'}
                disabled={!canSubmit}
                onPress={handleSubmit}
                className="mt-2 flex-row items-center justify-center rounded-full bg-[#6b7a4f] px-6 py-4 active:opacity-80 disabled:opacity-40"
                style={{ minHeight: 44 }}
              >
                {submitting ? (
                  <ActivityIndicator color="#e9e6d8" />
                ) : (
                  <View className="flex-row items-center gap-2">
                    <Text className="text-base font-semibold text-[#e9e6d8]">
                      {isSignUp ? 'Create account' : 'Sign in'}
                    </Text>
                    <ArrowRight size={18} color="#e9e6d8" />
                  </View>
                )}
              </Pressable>

              {/* Divider */}
              <View className="my-2 flex-row items-center gap-3">
                <View className="h-px flex-1 bg-[#3a4230]" />
                <Text className="text-xs text-[#a9b08e]">or</Text>
                <View className="h-px flex-1 bg-[#3a4230]" />
              </View>

              {/* <GoogleButton
                onError={setError}
                onSuccess={() => router.replace('/')}
              /> */}
            </View>

            {/* Footer toggle */}
            <Pressable
              onPress={toggleMode}
              accessibilityRole="button"
              accessibilityLabel={
                isSignUp ? 'Switch to sign in' : 'Switch to sign up'
              }
              className="mt-8 items-center py-2"
              style={{ minHeight: 44, justifyContent: 'center' }}
            >
              <Text className="text-base text-[#a9b08e]">
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <Text className="font-semibold text-[#e9e6d8]">
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'words' | 'sentences' | 'characters';
  autoCorrect?: boolean;
  keyboardType?: 'default' | 'email-address';
  accessibilityLabel: string;
};

/** Sage pill input, matching the "How shall we call you?" field from onboarding. */
function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  autoCapitalize = 'sentences',
  autoCorrect = true,
  keyboardType = 'default',
  accessibilityLabel,
}: FieldProps) {
  return (
    <View>
      <Text className="mb-2 text-xs tracking-[2px] text-[#a9b08e]">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#7c8468"
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        keyboardType={keyboardType}
        accessibilityLabel={accessibilityLabel}
        className="rounded-full bg-[#b9bf9d] px-5 py-4 text-base text-[#2b2f22]"
        style={{ minHeight: 44 }}
      />
    </View>
  );
}