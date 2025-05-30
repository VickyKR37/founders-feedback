
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

// Server-side logging for debugging environment variables in deployed environments
if (typeof window === 'undefined') {
  console.log("[FirebaseSetup] Attempting to initialize Firebase with API Key ending in: ", process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? String(process.env.NEXT_PUBLIC_FIREBASE_API_KEY).slice(-4) : "UNDEFINED or EMPTY");
  console.log("[FirebaseSetup] Firebase Config Check:", {
    apiKey: firebaseConfig.apiKey ? "Present" : "MISSING/UNDEFINED",
    authDomain: firebaseConfig.authDomain ? "Present" : "MISSING/UNDEFINED",
    projectId: firebaseConfig.projectId ? "Present" : "MISSING/UNDEFINED",
    storageBucket: firebaseConfig.storageBucket ? "Present" : "MISSING/UNDEFINED",
    messagingSenderId: firebaseConfig.messagingSenderId ? "Present" : "MISSING/UNDEFINED",
    appId: firebaseConfig.appId ? "Present" : "MISSING/UNDEFINED",
  });
}

// Critical check for API key
if (!firebaseConfig.apiKey) {
  const errorMessage = "[FirebaseSetup] CRITICAL ERROR: Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing or undefined. Firebase cannot initialize. Ensure this environment variable is correctly set in your Firebase App Hosting / Cloud Run service configuration.";
  console.error(errorMessage);
  if (typeof window === 'undefined') { // Server-side
    // Forcing an error here to make it very obvious in server logs
    throw new Error(errorMessage);
  }
  // On the client, Firebase SDK will also throw an error, but this provides an earlier, more direct message.
}

let app: FirebaseApp | undefined = undefined;
let auth: Auth | undefined = undefined;
let db: Firestore | undefined = undefined;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    if (typeof window === 'undefined') {
      console.log("[FirebaseSetup] Firebase app initialized successfully on the server via initializeApp.");
    }
  } else {
    app = getApp();
    if (typeof window === 'undefined') {
      console.log("[FirebaseSetup] Existing Firebase app retrieved successfully on the server via getApp.");
    }
  }

  // If app initialization (or retrieval) was successful, initialize auth and db
  auth = getAuth(app);
  db = getFirestore(app);

  if (typeof window === 'undefined') {
    console.log("[FirebaseSetup] Firebase Auth and Firestore services retrieved successfully on the server.");
  }

} catch (error: any) {
  const initErrorMessage = `[FirebaseSetup] Firebase initialization or service retrieval failed: ${error.message || String(error)}. This often means your environment variables (NEXT_PUBLIC_FIREBASE_... values) are incorrect or missing in your App Hosting / Cloud Run configuration. Please verify them in the Google Cloud Console. Full Firebase config used (API key redacted for client logs): ${JSON.stringify({ ...firebaseConfig, apiKey: typeof window !== 'undefined' && firebaseConfig.apiKey ? 'REDACTED_ON_CLIENT' : firebaseConfig.apiKey})}`;
  console.error(initErrorMessage, error);
  if (typeof window === 'undefined') {
    // This error will cause the "Internal Server Error" on the client if it occurs server-side
    throw new Error(initErrorMessage);
  }
  // On the client, allow Firebase SDK to potentially handle its own error display or let consuming code check for undefined auth/db
}

export { app, auth, db };
