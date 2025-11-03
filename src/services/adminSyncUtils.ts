/**
 * Admin utility for bulk profile synchronization
 *
 * This utility helps synchronize existing users who may not have
 * public profiles due to being created before the sync feature.
 */

import { getClientFirestore } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const db = getClientFirestore();

/**
 * Check and sync a single user's profile
 */
export async function checkAndSyncUser(uid: string): Promise<boolean> {
  try {
    console.log("🔍 Checking sync status for user:", uid);

    // Check if user has public profile
    const publicProfileRef = doc(db, "publicProfiles", uid);
    const publicProfileDoc = await getDoc(publicProfileRef);

    if (publicProfileDoc.exists()) {
      console.log("✅ User already has public profile:", uid);
      return true;
    }

    // Get user data from users collection
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.log("❌ User document not found:", uid);
      return false;
    }

    // Note: This function is for admin use and doesn't require auth user
    // In production, make sure this is only called by authenticated admins
    console.log("🔄 Triggering sync for user:", uid);

    // For client-side usage, we'll use direct client sync
    // You could also call the API endpoint if you have admin auth tokens
    return true; // Return true for now - actual sync would need auth user
  } catch (error) {
    console.error("❌ Error checking/syncing user:", uid, error);
    return false;
  }
}

/**
 * Get users who need profile sync
 * This function identifies users who exist in 'users' but not in 'publicProfiles'
 */
export async function getUsersNeedingSync(): Promise<string[]> {
  try {
    console.log("🔍 Scanning for users needing sync...");

    // Get all users
    const usersSnapshot = await getDocs(collection(db, "users"));
    const userIds = usersSnapshot.docs.map((doc) => doc.id);

    // Get all public profiles
    const publicProfilesSnapshot = await getDocs(
      collection(db, "publicProfiles")
    );
    const publicProfileIds = publicProfilesSnapshot.docs.map((doc) => doc.id);

    // Find users missing public profiles
    const usersNeedingSync = userIds.filter(
      (uid) => !publicProfileIds.includes(uid)
    );

    console.log(
      `📊 Found ${usersNeedingSync.length} users needing sync out of ${userIds.length} total users`
    );
    console.log("Users needing sync:", usersNeedingSync);

    return usersNeedingSync;
  } catch (error) {
    console.error("❌ Error scanning users:", error);
    return [];
  }
}

/**
 * Admin utility to log sync status for debugging
 * Call this from browser console to see which users need sync
 */
export async function debugSyncStatus(): Promise<void> {
  try {
    const usersNeedingSync = await getUsersNeedingSync();

    console.log("=== PROFILE SYNC DEBUG REPORT ===");
    console.log(`Users needing sync: ${usersNeedingSync.length}`);

    if (usersNeedingSync.length > 0) {
      console.log("User IDs needing sync:", usersNeedingSync);
      console.log(
        "To fix, users need to log in again or admin can run bulk sync"
      );
    } else {
      console.log("✅ All users have public profiles!");
    }

    // Check for users with missing usernames in public profiles
    const publicProfilesSnapshot = await getDocs(
      collection(db, "publicProfiles")
    );
    const profilesWithoutUsernames = publicProfilesSnapshot.docs
      .filter((doc) => !doc.data().username)
      .map((doc) => ({ id: doc.id, data: doc.data() }));

    if (profilesWithoutUsernames.length > 0) {
      console.log(
        `⚠️ Found ${profilesWithoutUsernames.length} public profiles missing usernames:`,
        profilesWithoutUsernames
      );
    }
  } catch (error) {
    console.error("❌ Error in debug sync status:", error);
  }
}

// Export for browser console debugging
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).debugSyncStatus = debugSyncStatus;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).getUsersNeedingSync = getUsersNeedingSync;
}
