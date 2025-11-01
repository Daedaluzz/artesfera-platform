/**
 * Firebase Admin SDK configuration and initialization
 * 
 * This module should only be imported on the server-side (API routes, server components)
 * The Admin SDK requires Node.js environment and service account credentials
 * 
 * WARNING: This module should never be imported in client-side code
 */

import { initializeApp, getApps, App, cert, ServiceAccount } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getStorage, Storage } from "firebase-admin/storage";

// Admin app singleton
let adminApp: App | null = null;

/**
 * Gets or initializes the Firebase Admin app using service account credentials
 * Only works on server-side (Node.js environment)
 * 
 * @returns Firebase admin app instance or null if not available
 */
export function getAdminApp(): App | null {
  // Runtime check: Admin SDK should not run in browser
  if (typeof window !== "undefined") {
    console.warn("❌ Firebase Admin SDK cannot be initialized in the browser environment");
    return null;
  }

  // Check if service account credentials are available
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.warn("❌ FIREBASE_SERVICE_ACCOUNT environment variable is not set. Admin functions will not be available.");
    return null;
  }

  if (!adminApp) {
    try {
      // Check if admin app already exists
      const existingAdminApps = getApps();
      if (existingAdminApps.length > 0) {
        adminApp = existingAdminApps[0];
      } else {
        // Parse service account from environment variable
        let serviceAccount: ServiceAccount;
        
        try {
          // Try to parse as JSON string first
          serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        } catch {
          // If that fails, try to decode from base64
          try {
            const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf-8');
            serviceAccount = JSON.parse(decoded);
          } catch {
            throw new Error("FIREBASE_SERVICE_ACCOUNT must be a valid JSON string or base64-encoded JSON");
          }
        }

        // Initialize admin app with service account
        adminApp = initializeApp({
          credential: cert(serviceAccount),
          projectId: serviceAccount.projectId,
          storageBucket: `${serviceAccount.projectId}.appspot.com`,
        });
      }
    } catch (error) {
      console.error("❌ Failed to initialize Firebase Admin SDK:", error);
      return null;
    }
  }

  return adminApp;
}

/**
 * Admin Firebase Auth instance
 * Only available on server-side
 */
export function getAdminAuth(): Auth | null {
  const app = getAdminApp();
  if (!app) return null;
  
  try {
    return getAuth(app);
  } catch (error) {
    console.error("❌ Failed to get Admin Auth:", error);
    return null;
  }
}

/**
 * Admin Firestore instance
 * Only available on server-side
 */
export function getAdminFirestore(): Firestore | null {
  const app = getAdminApp();
  if (!app) return null;
  
  try {
    return getFirestore(app);
  } catch (error) {
    console.error("❌ Failed to get Admin Firestore:", error);
    return null;
  }
}

/**
 * Admin Storage instance
 * Only available on server-side
 */
export function getAdminStorage(): Storage | null {
  const app = getAdminApp();
  if (!app) return null;
  
  try {
    return getStorage(app);
  } catch (error) {
    console.error("❌ Failed to get Admin Storage:", error);
    return null;
  }
}