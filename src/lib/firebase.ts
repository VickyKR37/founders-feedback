
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

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Critical check for API key.
if (!firebaseConfig.apiKey) {
  const errorMessage = "[FirebaseSetup] CRITICAL ERROR: Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing or undefined. Firebase cannot initialize. Ensure this environment variable is correctly set in your Firebase App Hosting / Cloud Run service configuration. Firebase features will be disabled.";
  console.error(errorMessage);
  // We are not throwing here to prevent a hard server crash.
  // `app`, `auth`, `db` will remain null. Downstream code must handle this.
} else {
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

    if (app) { // Only try to get auth and db if app was initialized
        auth = getAuth(app);
        db = getFirestore(app);
        if (typeof window === 'undefined') {
          console.log("[FirebaseSetup] Firebase Auth and Firestore services retrieved successfully on the server.");
        }
    } else {
        // This case implies app initialization failed silently above, which shouldn't happen if apiKey is present.
        // Log an error if app is still null.
        console.error("[FirebaseSetup] Firebase app object is unexpectedly null after initialization attempt, even with an API key present. Firebase features will be disabled.");
    }

  } catch (error: any) {
    const initErrorMessage = `[FirebaseSetup] Firebase initialization or service retrieval failed during getAuth/getFirestore: ${error.message || String(error)}. This often means your environment variables (NEXT_PUBLIC_FIREBASE_... values) are incorrect or missing in your App Hosting / Cloud Run configuration, or the API key is invalid. Please verify them in the Google Cloud Console. Firebase features will be disabled. Full Firebase config used (API key redacted for client logs): ${JSON.stringify({ ...firebaseConfig, apiKey: typeof window !== 'undefined' && firebaseConfig.apiKey ? 'REDACTED_ON_CLIENT' : firebaseConfig.apiKey })}`;
    console.error(initErrorMessage, error);
    // We are not throwing here. `app`, `auth`, `db` may be null or partially initialized.
    // Ensure auth and db are nulled out if an error occurs during their retrieval.
    auth = null;
    db = null;
  }
}

export { app, auth, db };
