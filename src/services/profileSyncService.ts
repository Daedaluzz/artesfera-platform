/**
 * Profile Synchronization Service
 * 
 * Client-side utilities for triggering profile synchronization
 * between users and publicProfiles collections.
 */

import { User } from "firebase/auth";

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
 * Trigger profile synchronization to publicProfiles collection
 * Call this function whenever a user's profile data is updated
 */
export async function triggerProfileSync(
  userData: ProfileSyncData, 
  authUser: User
): Promise<boolean> {
  try {
    // Get the current user's ID token
    const token = await authUser.getIdToken();

    // Call the sync API
    const response = await fetch('/api/sync-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Profile sync failed:', error);
      return false;
    }

    const result = await response.json();
    console.log('✅ Profile synchronized:', result);
    return true;

  } catch (error) {
    console.error('❌ Profile sync error:', error);
    return false;
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
    console.warn('⚠️ Cannot sync profile: User not authenticated');
    return;
  }

  // Only sync if the user has essential profile data
  if (!userData.name || !userData.uid) {
    console.warn('⚠️ Cannot sync profile: Missing essential data');
    return;
  }

  try {
    await triggerProfileSync(userData, authUser);
  } catch (error) {
    // Silent fail for auto-sync - don't interrupt user flow
    console.error('❌ Auto-sync failed:', error);
  }
}