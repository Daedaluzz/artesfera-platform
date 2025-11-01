/**
 * Client-side Firebase configuration and initialization for ArtEsfera platform
 * 
 * This module provides safe singleton initialization for client-side Firebase SDK only.
 * For admin operations, use API routes that import firebase-admin separately.
 * 
 * Client-side usage:
 * - Use getClientApp() for browser-safe Firebase operations
 * - Includes Auth, Firestore, Storage, and Analytics
 * - Uses NEXT_PUBLIC_ environment variables
 */

// Client-side Firebase imports
import { initializeApp, getApps, FirebaseApp, FirebaseOptions } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAnalytics, Analytics } from "firebase/analytics";

// Client app singleton
let clientApp: FirebaseApp | null = null;

/**
 * Client-side Firebase configuration using NEXT_PUBLIC_ environment variables
 * Safe to use in the browser
 */
const clientConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

/**
 * Gets or initializes the client-side Firebase app
 * Safe to use in both browser and server environments
 * 
 * @returns Firebase client app instance
 */
export function getClientApp(): FirebaseApp {
  if (!clientApp) {
    // Check if an app with default name already exists
    const existingApps = getApps();
    if (existingApps.length > 0) {
      clientApp = existingApps[0];
    } else {
      clientApp = initializeApp(clientConfig);
    }
  }
  return clientApp;
}

// Client-side service exports
/**
 * Client-side Firebase Auth instance
 * Safe to use in browser and server environments
 */
export function getClientAuth(): Auth {
  return getAuth(getClientApp());
}

/**
 * Client-side Firestore instance
 * Safe to use in browser and server environments
 */
export function getClientFirestore(): Firestore {
  return getFirestore(getClientApp());
}

/**
 * Client-side Storage instance
 * Safe to use in browser and server environments
 */
export function getClientStorage(): FirebaseStorage {
  return getStorage(getClientApp());
}

/**
 * Client-side Analytics instance
 * Only available in browser environment
 */
export function getClientAnalytics(): Analytics | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return getAnalytics(getClientApp());
  } catch (error) {
    console.warn("Analytics not available:", error);
    return null;
  }
}

// Legacy exports for backward compatibility
/**
 * @deprecated Use getClientAuth() instead
 */
export const auth = getClientAuth();

/**
 * @deprecated Use getClientFirestore() instead
 */
export const db = getClientFirestore();

/**
 * @deprecated Use getClientStorage() instead
 */
export const storage = getClientStorage();

/**
 * @deprecated Use getClientAnalytics() instead
 */
export const analytics = getClientAnalytics();

/**
 * @deprecated Use getClientApp() instead
 */
export default getClientApp();
