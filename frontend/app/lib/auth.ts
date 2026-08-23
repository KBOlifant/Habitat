// lib/auth.ts
//
// Thin wrapper around Firebase Auth + Firestore for Habitat.
// Assumes you already export an initialized `auth` and `db` from lib/firebase.ts, e.g.:
//
//   import { initializeApp } from 'firebase/app';
//   import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
//   import { getFirestore } from 'firebase/firestore';
//   import AsyncStorage from '@react-native-async-storage/async-storage';
//
//   const app = initializeApp(firebaseConfig);
//   export const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
//   export const db = getFirestore(app);

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  updateProfile,
  type UserCredential,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

/** Creates a `users/{uid}` doc the first time we see this user. Safe to call every sign-in. */
async function ensureUserDoc(cred: UserCredential, name?: string) {
  const ref = doc(db, 'users', cred.user.uid);
  const existing = await getDoc(ref);
  if (existing.exists()) return;

  await setDoc(ref, {
    uid: cred.user.uid,
    name: name ?? cred.user.displayName ?? '',
    email: cred.user.email,
    createdAt: serverTimestamp(),
  });
}

export async function signUpWithEmail(name: string, email: string, password: string) {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if (name.trim()) {
    await updateProfile(cred.user, { displayName: name.trim() });
  }
  await ensureUserDoc(cred, name.trim());
  return cred;
}

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

/** Pass the `idToken` returned by expo-auth-session's Google provider. */
export async function signInWithGoogleIdToken(idToken: string) {
  const credential = GoogleAuthProvider.credential(idToken);
  const cred = await signInWithCredential(auth, credential);
  await ensureUserDoc(cred);
  return cred;
}

/** Friendly copy for the most common Firebase Auth error codes. */
export function authErrorMessage(err: unknown): string {
  const code = (err as { code?: string })?.code ?? '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account already exists with that email.';
    case 'auth/invalid-email':
      return 'That email address doesn’t look right.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email or password is incorrect.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again in a bit.';
    default:
      return 'Something went wrong. Please try again.';
  }
}