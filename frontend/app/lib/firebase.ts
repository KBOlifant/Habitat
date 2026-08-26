// lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const requiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

const firebaseConfig = {
  apiKey: requiredEnv('EXPO_PUBLIC_FIREBASE_API_KEY'),
  authDomain: requiredEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: requiredEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: requiredEnv('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: requiredEnv('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: requiredEnv('EXPO_PUBLIC_FIREBASE_APP_ID'),
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Avoid re-initializing on fast refresh / multiple imports
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// NOTE: getAnalytics() is dropped here — it's a web-only SDK module and will
// throw in React Native (no `window`/`document`). If you want analytics on
// mobile later, use `@react-native-firebase/analytics` (a native module, separate
// setup from this JS SDK). Web builds (Expo web) could still conditionally add
// getAnalytics(app) behind a Platform.OS === 'web' check if you want it there.

// initializeAuth can only be called once per app — guard against
// "already initialized" errors during fast refresh in dev.
let auth: Auth;
if (Platform.OS !== 'web') {
  try {
    // Only require the react-native auth helpers on native platforms to
    // avoid bundling issues on web.
    // @ts-ignore - dynamic require for platform-specific module
    const { initializeAuth: initializeAuthNative, getReactNativePersistence } = require('firebase/auth/react-native');
    auth = initializeAuthNative(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (e) {
    // Fallback to the standard web-compatible auth if native helpers fail
    const { getAuth } = require('firebase/auth');
    auth = getAuth(app);
  }
} else {
  const { getAuth } = require('firebase/auth');
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };