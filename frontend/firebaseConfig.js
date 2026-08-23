// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuYrN-vzacl5H3ZGgJk0_gcfHTTJTPZeM",
  authDomain: "habitat-e91e4.firebaseapp.com",
  projectId: "habitat-e91e4",
  storageBucket: "habitat-e91e4.firebasestorage.app",
  messagingSenderId: "538273366409",
  appId: "1:538273366409:web:947a59cf0837ed46a12158",
  measurementId: "G-3578T4ZE8T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);