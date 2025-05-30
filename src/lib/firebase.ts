
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
    throw new Error(errorMessage);
  }
  // On the client, Firebase SDK will also throw an error, but this provides an earlier, more direct message.
}

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    if (typeof window === 'undefined') {
      console.log("[FirebaseSetup] Firebase app initialized successfully on the server.");
    }
  } else {
    app = getApp();
    if (typeof window === 'undefined') {
      console.log("[FirebaseSetup] Existing Firebase app retrieved on the server.");
    }
  }
} catch (error: any) {
  const initErrorMessage = `[FirebaseSetup] Firebase app initialization failed: ${error.message || String(error)}. This often means your environment variables (NEXT_PUBLIC_FIREBASE_... values) are incorrect or missing in your App Hosting / Cloud Run configuration. Please verify them in the Google Cloud Console.`;
  console.error(initErrorMessage, error);
  if (typeof window === 'undefined') {
    throw new Error(initErrorMessage);
  }
  // Allow Firebase SDK to handle client-side error display as well
}

// Ensure 'app' is defined before trying to get Auth and Firestore
// This is crucial if initializeApp failed silently on client or in a way not caught above for server
if (app!) { // Using non-null assertion assuming the try/catch above would throw server-side on failure
  try {
    auth = getAuth(app);
    db = getFirestore(app);
    if (typeof window === 'undefined') {
      console.log("[FirebaseSetup] Firebase Auth and Firestore services initialized successfully on the server.");
    }
  } catch (error: any) {
    const servicesErrorMessage = `[FirebaseSetup] Error getting Firebase Auth/Firestore instance: ${error.message || String(error)}. This typically follows an app initialization issue. Check Firebase config and previous logs.`;
    console.error(servicesErrorMessage, error);
    if (typeof window === 'undefined') {
      throw new Error(servicesErrorMessage);
    }
  }
} else {
  // This block should ideally not be reached if the above error handling for app initialization is effective server-side.
  const appUndefinedMessage = "[FirebaseSetup] Firebase app object is undefined after initialization attempt. Firebase services (Auth, Firestore) cannot be initialized. This indicates a critical failure in Firebase setup. Check environment variables and previous logs.";
  console.error(appUndefinedMessage);
  if (typeof window === 'undefined') {
    throw new Error(appUndefinedMessage);
  }
}

export { app, auth, db };
