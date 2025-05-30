
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Explicitly check for API key. This is crucial for Firebase to initialize.
if (!firebaseConfig.apiKey) {
  const errorMessage = "CRITICAL ERROR: Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing or undefined. This will cause Firebase initialization to fail. Please set it in your environment variables (e.g., .env.local for local development, or in your cloud hosting configuration for deployed environments).";
  console.error(errorMessage);
  // If running on the server (e.g., during SSR or in API routes),
  // throw an error to make it obvious and prevent further execution with invalid config.
  if (typeof window === 'undefined') {
    throw new Error(errorMessage);
  }
  // On the client-side, Firebase SDK will throw its own specific errors (like auth/invalid-api-key)
  // if initialization proceeds with a missing/invalid key, which is also informative.
}

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (!getApps().length) {
  // It's important that initializeApp is called only once.
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // If already initialized, get the existing app.
}

auth = getAuth(app);
db = getFirestore(app);

export { app, auth, db };
