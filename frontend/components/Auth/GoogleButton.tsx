// components/Auth/GoogleButton.tsx
//
// Reusable "Continue with Google" pill button.
// Uses expo-auth-session's Google provider to get an idToken, then hands it to Firebase.
//
// Setup needed:
//   npx expo install expo-auth-session expo-web-browser expo-crypto
//   Register OAuth client IDs (iOS / Android / Web) in Google Cloud Console
//   and add them to app.json / app.config.ts as extras or env vars.

import React, { useEffect, useState } from 'react';
import { Pressable, Text, View, ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { signInWithGoogleIdToken, authErrorMessage } from '../../functions/auth';

WebBrowser.maybeCompleteAuthSession();

type Props = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
  /** Optional label override, defaults to "Continue with Google" */
  label?: string;
};

export default function GoogleButton({ onError, onSuccess, label }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    const handleResponse = async () => {
      if (response?.type !== 'success') return;
      const idToken = response.authentication?.idToken;
      if (!idToken) {
        onError?.('Google sign-in didn’t return a token. Please try again.');
        return;
      }
      try {
        setSubmitting(true);
        await signInWithGoogleIdToken(idToken);
        onSuccess?.();
      } catch (err) {
        onError?.(authErrorMessage(err));
      } finally {
        setSubmitting(false);
      }
    };
    handleResponse();
  }, [response]);

  const busy = submitting;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label ?? 'Continue with Google'}
      disabled={!request || busy}
      onPress={() => promptAsync()}
      className="flex-row items-center justify-center rounded-full bg-[#e9e6d8] px-6 py-4 active:opacity-80 disabled:opacity-50"
      style={{ minHeight: 44 }}
    >
      {busy ? (
        <ActivityIndicator color="#2b2f22" />
      ) : (
        <View className="flex-row items-center gap-3">
          <GoogleG />
          <Text className="text-base font-semibold text-[#2b2f22]">
            {label ?? 'Continue with Google'}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

// Minimal inline "G" mark so we don't need an image asset / extra dependency.
function GoogleG() {
  return (
    <View
      className="h-5 w-5 items-center justify-center rounded-full bg-white"
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      <Text className="text-[13px] font-bold text-[#4285F4]">G</Text>
    </View>
  );
}