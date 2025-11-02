/**
 * Profile Synchronization Service
 *
 * Client-side utilities for triggering profile synchronization
 * between users and publicProfiles collections.
 */

import { User } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getClientFirestore } from "@/lib/firebase";

const db = getClientFirestore();

export interface ProfileSyncData {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  bio?: string;
  tags?: string[];
  website?: string;
  location?: string;
  username?: string;
  artisticName?: string;
  profileCompleted?: boolean;
}

/**
 * Extract public fields from user data for direct client-side sync
 * Only includes fields that should be publicly visible
 */
function extractPublicFields(userData: ProfileSyncData) {
  return {
    uid: userData.uid,
    displayName: userData.artisticName || userData.name,
    username: userData.username?.toLowerCase(), // Normalize username to lowercase for consistent queries
    photoURL: userData.photoURL,
    bio: userData.bio,
    tags: userData.tags || [],
    website: userData.website,
    location: userData.location,
    updatedAt: serverTimestamp(),
  };
}

/**
 * Fallback client-side sync for when admin SDK is not available
 * This directly writes to publicProfiles using client SDK
 */
async function clientSideSync(userData: ProfileSyncData): Promise<boolean> {
  try {
    console.log("📝 Performing client-side profile sync for user:", userData.uid);
    
    const publicData = extractPublicFields(userData);
    const publicProfileRef = doc(db, "publicProfiles", userData.uid);

    // Set the document with merge: true to preserve createdAt if it exists
    await setDoc(publicProfileRef, {
      ...publicData,
      // Only set createdAt if the document doesn't exist (handled by merge)
      createdAt: serverTimestamp(),
    }, { merge: true });

    console.log("✅ Client-side profile sync completed for user:", userData.uid);
    return true;
  } catch (error) {
    console.error("❌ Client-side profile sync failed:", error);
    return false;
  }
}

/**
 * Trigger profile synchronization to publicProfiles collection
 * Call this function whenever a user's profile data is updated
 * Falls back to client-side sync if admin SDK is not available
 */
export async function triggerProfileSync(
  userData: ProfileSyncData,
  authUser: User
): Promise<boolean> {
  try {
    // Get the current user's ID token
    const token = await authUser.getIdToken();

    // First try the admin SDK sync API
    const response = await fetch("/api/sync-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const result = await response.json();
      
      // Check if it was skipped due to admin SDK not being available
      if (result.warning) {
        console.warn("⚠️ Admin SDK not available, falling back to client-side sync");
        // Fall back to client-side sync
        return await clientSideSync(userData);
      }
      
      console.log("✅ Profile synchronized via admin SDK:", result);
      return true;
    } else {
      // If admin sync fails, try client-side sync as fallback
      console.warn("⚠️ Admin sync failed, trying client-side sync. Status:", response.status);
      const error = await response.json().catch(() => ({ error: "Unknown error" }));
      console.error("Admin sync error:", error);
      
      return await clientSideSync(userData);
    }
  } catch (error) {
    console.error("❌ Profile sync error, trying client-side fallback:", error);
    // Final fallback to client-side sync
    return await clientSideSync(userData);
  }
}

/**
 * Auto-sync profile after user updates
 * This is a convenience function that can be called from forms/profile update components
 */
export async function autoSyncProfile(
  userData: ProfileSyncData,
  authUser: User | null
): Promise<void> {
  if (!authUser) {
    console.warn("⚠️ Cannot sync profile: User not authenticated");
    return;
  }

  // Only sync if the user has essential profile data
  if (!userData.name || !userData.uid) {
    console.warn("⚠️ Cannot sync profile: Missing essential data");
    return;
  }

  try {
    await triggerProfileSync(userData, authUser);
  } catch (error) {
    // Silent fail for auto-sync - don't interrupt user flow
    console.error("❌ Auto-sync failed:", error);
  }
}
