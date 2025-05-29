
"use client";

import type { User as FirebaseUser } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '@/lib/firebase'; // Using mocked auth

interface User extends FirebaseUser {
  // Add any custom properties if needed
  // e.g. role: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  signIn: (email?: string, password?: string) => Promise<any>;
  signUp: (email?: string, password?: string) => Promise<any>;
  signOutUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser: FirebaseUser | null) => {
      setUser(firebaseUser as User | null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (email?: string, password?: string) => {
    setLoading(true);
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      setUser(userCredential.user as User);
      return userCredential;
    } finally {
      setLoading(false);
    }
  };
  
  const signUp = async (email?: string, password?: string) => {
    setLoading(true);
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      // Potentially update profile here if needed
      setUser(userCredential.user as User);
      return userCredential;
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await auth.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, signIn, signUp, signOutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
