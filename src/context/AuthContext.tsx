"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
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
  getDoc,
  serverTimestamp,
  runTransaction,
  FieldValue,
  onSnapshot,
} from "firebase/firestore";
import { getClientAuth, getClientFirestore } from "@/lib/firebase";
import { triggerProfileSync } from "@/services/profileSyncService";

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
  username: string; // Unique username for @username sharing (e.g., "daedaluzz")
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
  syncPublicProfile: (userId: string) => Promise<void>;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
  validateUsername: (username: string) => { isValid: boolean; error?: string };
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
  const createUserDocument = useCallback(async (user: User): Promise<void> => {
    const userRef = doc(db, "users", user.uid);

    try {
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);

        if (!userDoc.exists()) {
          // Generate unique username for new user (simplified logic to avoid circular dependency)
          const baseName = (
            user.displayName ||
            user.email?.split("@")[0] ||
            "user"
          )
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")
            .substring(0, 15);

          let username = baseName;
          let counter = 1;

          // Simple availability check within transaction using usernames collection
          while (counter < 100) {
            // Prevent infinite loop
            const usernameRef = doc(db, "usernames", username);
            const usernameDoc = await transaction.get(usernameRef);

            if (!usernameDoc.exists()) {
              break; // Username available
            }

            username = `${baseName}${counter}`;
            counter++;
          }

          // Create new user document with task-specified fields
          const userData = {
            uid: user.uid,
            name: user.displayName || "",
            email: user.email || "",
            photoURL: user.photoURL || null,
            createdAt: serverTimestamp(),
            lastUpdatedAt: serverTimestamp(),
            isActive: true,
            tags: [],
            bio: "",
            artisticName: "",
            username: username, // Add the generated username
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

          // Create username mapping document
          const usernameData = {
            userId: user.uid,
            createdAt: serverTimestamp(),
          };

          transaction.set(userRef, userData);
          transaction.set(doc(db, "usernames", username), usernameData);
          console.log(
            "✅ Created new user document and username mapping for:",
            user.uid
          );
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
  }, []); // No dependencies needed since we moved the logic inside

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
      setUserDocument(null);

      // Redirect to home page after logout to prevent permission errors
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("❌ Error signing out:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sync user's public profile data
   * Uses secure server-side API to sync data from users to publicProfiles collection
   */
  const syncPublicProfile = async (userId: string): Promise<void> => {
    try {
      // Get the current user's data from Firestore
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("User document not found");
      }

      const userData = userSnap.data();

      // Only sync if we have a current authenticated user
      if (!user) {
        throw new Error("No authenticated user for sync");
      }

      // Use the secure server-side sync API
      const success = await triggerProfileSync(
        {
          uid: userData.uid,
          name: userData.name || "",
          email: userData.email || "",
          photoURL: userData.photoURL,
          bio: userData.bio,
          tags: userData.tags,
          website: userData.socials?.website,
          location: userData.location,
          username: userData.username,
          artisticName: userData.artisticName,
          profileCompleted: userData.profileCompleted,
        },
        user
      );

      if (!success) {
        throw new Error("Profile sync failed");
      }

      console.log("✅ Public profile synced successfully via secure API");
    } catch (error) {
      console.error("❌ Error syncing public profile:", error);
      throw error;
    }
  };

  /**
   * Validate username format and rules
   */
  const validateUsername = (
    username: string
  ): { isValid: boolean; error?: string } => {
    // Username requirements:
    // - 3-20 characters
    // - Only letters, numbers, underscores, and hyphens
    // - Must start with a letter or number
    // - No consecutive special characters
    // - Case insensitive but stored in lowercase

    if (!username) {
      return { isValid: false, error: "Username é obrigatório" };
    }

    if (username.length < 3) {
      return {
        isValid: false,
        error: "Username deve ter pelo menos 3 caracteres",
      };
    }

    if (username.length > 20) {
      return {
        isValid: false,
        error: "Username deve ter no máximo 20 caracteres",
      };
    }

    // Check for valid characters (letters, numbers, underscore, hyphen)
    const validPattern = /^[a-zA-Z0-9_-]+$/;
    if (!validPattern.test(username)) {
      return {
        isValid: false,
        error: "Username pode conter apenas letras, números, _ e -",
      };
    }

    // Must start with letter or number
    const startsWithAlphaNumeric = /^[a-zA-Z0-9]/;
    if (!startsWithAlphaNumeric.test(username)) {
      return {
        isValid: false,
        error: "Username deve começar com letra ou número",
      };
    }

    // No consecutive special characters
    const noConsecutiveSpecial = /^(?!.*[-_]{2,})[a-zA-Z0-9_-]+$/;
    if (!noConsecutiveSpecial.test(username)) {
      return {
        isValid: false,
        error: "Username não pode ter _ ou - consecutivos",
      };
    }

    // Reserved usernames
    const reserved = [
      "admin",
      "api",
      "www",
      "mail",
      "ftp",
      "localhost",
      "artesfera",
      "support",
      "help",
      "info",
      "contact",
      "about",
      "terms",
      "privacy",
      "login",
      "register",
      "signup",
      "signin",
      "profile",
      "user",
      "users",
      "project",
      "projects",
      "gallery",
      "galleries",
      "daeva",
      "ai",
    ];

    if (reserved.includes(username.toLowerCase())) {
      return { isValid: false, error: "Este username não está disponível" };
    }

    return { isValid: true };
  };

  /**
   * Check if username is available in the database
   */
  const checkUsernameAvailability = async (
    username: string
  ): Promise<boolean> => {
    try {
      const normalizedUsername = username.toLowerCase();

      // Check in usernames collection (dedicated for username mapping)
      const usernameRef = doc(db, "usernames", normalizedUsername);
      const usernameDoc = await getDoc(usernameRef);

      // Username is available if document doesn't exist
      return !usernameDoc.exists();
    } catch (error) {
      console.error("❌ Error checking username availability:", error);
      throw error;
    }
  }; // Listen to auth state changes (SSR-safe)
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
  }, [createUserDocument]); // Add createUserDocument as dependency

  // Context value matching task requirements
  const value: AuthContextType = {
    user,
    userDocument,
    loading,
    signInWithGoogle,
    signOut,
    signInWithEmail,
    signUpWithEmail,
    syncPublicProfile,
    checkUsernameAvailability,
    validateUsername,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
