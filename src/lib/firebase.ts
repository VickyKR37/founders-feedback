
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

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (typeof window !== 'undefined' && !getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else if (getApps().length > 0) {
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  // This case is unlikely to be hit in a typical Next.js client/server environment
  // but provides a fallback.
  // For server-side rendering or environments where Firebase might be initialized differently,
  // ensure this logic is appropriate or expand as needed.
  app = initializeApp(firebaseConfig); // Or handle error/logging
  auth = getAuth(app);
  db = getFirestore(app);
}


export { app, auth, db };

// Previous mock implementation (now replaced by actual Firebase SDK usage)
/*
export const auth_mock = {
  currentUser: null,
  onAuthStateChanged: (callback: (user: any) => void) => {
    // Simulate auth state change after a delay
    setTimeout(() => {
      // To test logged-out state, pass null: callback(null);
      // To test logged-in state:
      // callback({ uid: 'mockUserId', email: 'test@example.com', displayName: 'Test User' });
    }, 100);
    return () => {}; // Unsubscribe function
  },
  signInWithEmailAndPassword: async (email?: string, password?: string) => {
    console.log('Mock signInWithEmailAndPassword', email, password);
    if (email === 'test@example.com' && password === 'password') {
      return { user: { uid: 'mockUserId', email: 'test@example.com', displayName: 'Test User' } };
    }
    throw new Error('Mock auth error: Invalid credentials');
  },
  createUserWithEmailAndPassword: async (email?: string, password?: string) => {
    console.log('Mock createUserWithEmailAndPassword', email, password);
     if (email && password) {
      return { user: { uid: 'mockUserIdNew', email: email, displayName: 'New User' } };
    }
    throw new Error('Mock auth error: Could not create user');
  },
  signOut: async () => {
    console.log('Mock signOut');
    return;
  }
};

export const db_mock = {
  // Mock Firestore methods as needed
  collection: (path: string) => ({
    doc: (id?: string) => ({
      get: async () => { console.log(`Mock get doc ${id} from ${path}`); return { exists: () => false, data: () => null }; },
      set: async (data: any) => { console.log(`Mock set doc ${id} in ${path}`, data); },
      update: async (data: any) => { console.log(`Mock update doc ${id} in ${path}`, data); },
      delete: async () => { console.log(`Mock delete doc ${id} from ${path}`); },
      onSnapshot: (callback: any) => { console.log(`Mock onSnapshot for doc ${id} in ${path}`); return () => {}; }
    }),
    add: async (data: any) => { console.log(`Mock add doc to ${path}`, data); return { id: 'mockDocId' }; },
    where: (field: string, op: string, value: any) => ({
        orderBy: (field: string, direction?: string) => ({
            limit: (num: number) => ({
                get: async () => { console.log(`Mock get collection ${path} with where/orderBy/limit`); return { empty: true, docs: [] }; },
                onSnapshot: (callback: any) => { console.log(`Mock onSnapshot for collection ${path} with where/orderBy/limit`); return () => {}; }
            })
        }),
        get: async () => { console.log(`Mock get collection ${path} with where`); return { empty: true, docs: [] }; },
        onSnapshot: (callback: any) => { console.log(`Mock onSnapshot for collection ${path} with where`); return () => {}; }
    }),
    orderBy: (field: string, direction?: string) => ({
        limit: (num: number) => ({
            get: async () => { console.log(`Mock get collection ${path} with orderBy/limit`); return { empty: true, docs: [] }; },
            onSnapshot: (callback: any) => { console.log(`Mock onSnapshot for collection ${path} with orderBy/limit`); return () => {}; }
        })
    }),
    limit: (num: number) => ({
        get: async () => { console.log(`Mock get collection ${path} with limit`); return { empty: true, docs: [] }; },
        onSnapshot: (callback: any) => { console.log(`Mock onSnapshot for collection ${path} with limit`); return () => {}; }
    }),
    get: async () => { console.log(`Mock get collection ${path}`); return { empty: true, docs: [] }; },
    onSnapshot: (callback: any) => { console.log(`Mock onSnapshot for collection ${path}`); return () => {}; }
  }),
  // Add other mock Firestore methods if needed, e.g., serverTimestamp
  // serverTimestamp: () => new Date(),
};
*/
