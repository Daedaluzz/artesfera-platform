"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import {
  doc,
  serverTimestamp,
  runTransaction,
  FieldValue,
  onSnapshot,
} from "firebase/firestore";
import { getClientAuth, getClientFirestore } from "@/lib/firebase";

// Initialize Firebase services
const auth = getClientAuth();
const db = getClientFirestore();

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// User document interface matching task requirements
interface UserDocument {
  uid: string;
  name: string;
  email: string;
  photoURL: string | null;
  createdAt: FieldValue;
  tags: string[];
  bio: string;
  artisticName: string;
  location: string;
  profileCompleted: boolean;
}

// Auth context interface matching task requirements
interface AuthContextType {
  user: User | null;
  userDocument: UserDocument | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    name: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom hook to access authentication context
 *
 * Usage examples:
 *
 * Basic authentication check:
 * ```tsx
 * function MyComponent() {
 *   const { user, loading } = useAuth();
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (!user) return <div>Please sign in</div>;
 *
 *   return <div>Welcome {user.displayName}!</div>;
 * }
 * ```
 *
 * Google sign-in:
 * ```tsx
 * function LoginButton() {
 *   const { signInWithGoogle } = useAuth();
 *
 *   return (
 *     <button onClick={signInWithGoogle}>
 *       Sign in with Google
 *     </button>
 *   );
 * }
 * ```
 *
 * Email sign-in:
 * ```tsx
 * function EmailLogin() {
 *   const { signInWithEmail } = useAuth();
 *
 *   const handleSubmit = async (e) => {
 *     e.preventDefault();
 *     await signInWithEmail(email, password);
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 *
 * Email sign-up:
 * ```tsx
 * function SignUpForm() {
 *   const { signUpWithEmail } = useAuth();
 *
 *   const handleSubmit = async (e) => {
 *     e.preventDefault();
 *     await signUpWithEmail(email, password, name);
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider component that wraps the application and provides authentication state
 *
 * Features:
 * - Subscribes to onAuthStateChanged for real-time auth state updates
 * - SSR-safe (checks typeof window)
 * - Automatically creates Firestore user documents on first sign-in
 * - Uses transactions to prevent data overwriting
 * - Provides Google OAuth and email/password authentication
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userDocument, setUserDocument] = useState<UserDocument | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Creates or updates user document in Firestore
   * Uses transaction with merge: true to avoid overwriting existing data
   */
  /**
   * Creates or updates a user document in Firestore
   * Uses transaction to avoid race conditions
   */
  const createUserDocument = async (user: User): Promise<void> => {
    const userRef = doc(db, "users", user.uid);

    try {
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);

        if (!userDoc.exists()) {
          // Create new user document with task-specified fields
          const userData = {
            uid: user.uid,
            displayName: user.displayName || "",
            email: user.email || "",
            photoURL: user.photoURL || null,
            createdAt: serverTimestamp(),
            lastUpdatedAt: serverTimestamp(),
            isActive: true,
            tags: [],
            bio: "",
            artisticName: "",
            location: "",
            profileCompleted: false,
            preferences: {
              notifications: {
                email: true,
                push: true,
                marketing: false,
              },
              privacy: {
                showEmail: false,
                showLocation: true,
                allowDirectMessages: true,
              },
            },
          };

          transaction.set(userRef, userData);
          console.log("✅ Created new user document for:", user.uid);
        } else {
          // Update existing user with latest auth info, preserving existing data
          const updateData = {
            displayName: user.displayName || "",
            email: user.email || "",
            photoURL: user.photoURL || null,
            lastUpdatedAt: serverTimestamp(),
          };

          transaction.update(userRef, updateData);
          console.log("✅ Updated existing user document for:", user.uid);
        }
      });
    } catch (error) {
      console.error("❌ Error creating/updating user document:", error);
      throw error;
    }
  };

  /**
   * Sign in with Google OAuth
   * Automatically creates user document on first sign-in
   */
  const signInWithGoogle = async (): Promise<void> => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);

      // Create user document after successful sign-in
      await createUserDocument(result.user);
    } catch (error) {
      console.error("❌ Error signing in with Google:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign in with email and password
   */
  const signInWithEmail = async (
    email: string,
    password: string
  ): Promise<void> => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Ensure user document exists
      await createUserDocument(result.user);
    } catch (error) {
      console.error("❌ Error signing in with email:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign up with email and password
   * Creates user document with provided name
   */
  const signUpWithEmail = async (
    email: string,
    password: string,
    name: string
  ): Promise<void> => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update display name
      await updateProfile(result.user, { displayName: name });

      // Send email verification
      await sendEmailVerification(result.user);

      // Create user document
      await createUserDocument(result.user);
    } catch (error) {
      console.error("❌ Error signing up with email:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign out user
   */
  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error("❌ Error signing out:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Listen to auth state changes (SSR-safe)
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setUser(user);

        if (user) {
          // Ensure user document exists when user is authenticated
          await createUserDocument(user);
          
          // Set up real-time listener for user document
          const userDocRef = doc(db, "users", user.uid);
          const unsubscribeUserDoc = onSnapshot(userDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
              setUserDocument(docSnapshot.data() as UserDocument);
            } else {
              setUserDocument(null);
            }
          });

          // Store the unsubscribe function for cleanup
          return () => unsubscribeUserDoc();
        } else {
          setUserDocument(null);
        }
      } catch (error) {
        console.error("❌ Error in auth state change:", error);
        setUserDocument(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Context value matching task requirements
  const value: AuthContextType = {
    user,
    userDocument,
    loading,
    signInWithGoogle,
    signOut,
    signInWithEmail,
    signUpWithEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
