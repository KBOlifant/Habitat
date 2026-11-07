import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export type AuthUser = User;

async function ensureUserDocument(credential: UserCredential, name?: string) {
  const userDocument = doc(db, 'users', credential.user.uid);
  const existingUser = await getDoc(userDocument);
  if (existingUser.exists()) return;

  await setDoc(userDocument, {
    uid: credential.user.uid,
    name: name ?? credential.user.displayName ?? '',
    email: credential.user.email,
    createdAt: serverTimestamp(),
  });
}

export function observeAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser() {
  return auth.currentUser;
}

export async function signUpWithEmail(name: string, email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const trimmedName = name.trim();
  if (trimmedName) await updateProfile(credential.user, { displayName: trimmedName });
  await ensureUserDocument(credential, trimmedName);
  return credential;
}

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function signInWithGoogleIdToken(idToken: string) {
  const credential = await signInWithCredential(
    auth,
    GoogleAuthProvider.credential(idToken),
  );
  await ensureUserDocument(credential);
  return credential;
}

export function signOutUser() {
  return signOut(auth);
}

export function authErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code ?? '';
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
