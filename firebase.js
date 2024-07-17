import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
const firebaseConfig = {
  apiKey: "AIzaSyDInZ6QOVUO6FRx6OGtJJYn6QVdjgWQDuo",
  authDomain: "assistant-423cf.firebaseapp.com",
  projectId: "assistant-423cf",
  storageBucket: "assistant-423cf.appspot.com",
  messagingSenderId: "222227283507",
  appId: "1:222227283507:web:6b82289672d13b390e2d46",
  measurementId: "G-L1VJVCFQF1",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});