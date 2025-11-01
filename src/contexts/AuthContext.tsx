'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { authUtils } from '@/lib/auth';
import { dbUtils, UserProfile } from '@/lib/firestore';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile from Firestore
  const loadUserProfile = async (user: User) => {
    try {
      const profile = await dbUtils.users.get(user.uid);
      if (profile) {
        setUserProfile(profile);
      } else {
        // Create user profile if it doesn't exist
        const newProfile: Partial<UserProfile> = {
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || undefined,
          role: 'artist',
          verified: false,
        };
        await dbUtils.users.create(user.uid, newProfile);
        
        // Reload the profile
        const createdProfile = await dbUtils.users.get(user.uid);
        setUserProfile(createdProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  // Sign in
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await authUtils.signIn(email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up
  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      const userCredential = await authUtils.signUp(email, password, displayName);
      
      // Create user profile in Firestore
      const newProfile: Partial<UserProfile> = {
        email,
        displayName,
        role: 'artist',
        verified: false,
      };
      await dbUtils.users.create(userCredential.user.uid, newProfile);
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const userCredential = await authUtils.signInWithGoogle();
      
      // Check if user profile exists, create if not
      const existingProfile = await dbUtils.users.get(userCredential.user.uid);
      if (!existingProfile) {
        const newProfile: Partial<UserProfile> = {
          email: userCredential.user.email || '',
          displayName: userCredential.user.displayName || '',
          photoURL: userCredential.user.photoURL || undefined,
          role: 'artist',
          verified: false,
        };
        await dbUtils.users.create(userCredential.user.uid, newProfile);
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      await authUtils.signOut();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await authUtils.resetPassword(email);
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      throw new Error('No authenticated user');
    }

    try {
      setLoading(true);
      
      // Update in Firestore
      await dbUtils.users.update(user.uid, updates);
      
      // Update in Firebase Auth if displayName or photoURL changed
      if (updates.displayName || updates.photoURL) {
        await authUtils.updateUserProfile({
          displayName: updates.displayName,
          photoURL: updates.photoURL,
        });
      }
      
      // Refresh user profile
      await refreshUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Refresh user profile
  const refreshUserProfile = async () => {
    if (!user) return;
    
    try {
      const profile = await dbUtils.users.get(user.uid);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error refreshing user profile:', error);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setUser(user);
        
        if (user) {
          await loadUserProfile(user);
        } else {
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}