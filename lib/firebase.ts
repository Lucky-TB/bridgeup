import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyDxztbViWLcqN91AjuMRvIsDM6UzMsTZGs",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "bridgeup-96d98.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "bridgeup-96d98",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "bridgeup-96d98.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1038272509851",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:1038272509851:web:58d56a5af311068e72533e",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-CZK7YVVJEH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Log configuration status (only in development)
if (__DEV__) {
  console.log('Firebase initialized with project:', firebaseConfig.projectId);
  console.log('Using environment variables:', !!process.env.EXPO_PUBLIC_FIREBASE_API_KEY);
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Connect to emulators in development
if (__DEV__) {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
  } catch (error) {
    // Emulators already connected or not available
    console.log('Firebase emulators not available, using production');
  }
}

export default app;