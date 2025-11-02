/**
 * User Service
 *
 * CRUD service for user management with cascading deletion and complete user lifecycle support.
 * Handles all user-related operations across multiple collections following the established
 * artworkService pattern for consistency and maintainability.
 *
 * Features:
 * - Complete CRUD operations for user data
 * - Cascading deletion across all related collections
 * - File cleanup for user assets
 * - Username management and validation
 * - Public profile synchronization
 * - Error handling and data validation
 */

import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  runTransaction,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { getClientFirestore, storage } from "@/lib/firebase";
import { triggerProfileSync, ProfileSyncData } from "./profileSyncService";
import { User } from "firebase/auth";

const db = getClientFirestore();

// Collection names
const COLLECTIONS = {
  USERS: "users",
  PUBLIC_PROFILES: "publicProfiles",
  USERNAMES: "usernames",
  ARTWORKS: "artworks",
} as const;

// User data interfaces
export interface UserData {
  uid: string;
  name: string;
  email: string;
  photoURL?: string | null;
  bio?: string;
  tags?: string[];
  artisticName?: string;
  username?: string;
  location?: string;
  phone?: string;
  profileCompleted?: boolean;
  createdAt?: Date | object;
  updatedAt?: Date | object;
  socials?: {
    website?: string;
    instagram?: string;
    youtube?: string;
  };
  preferences?: {
    notifications?: {
      email?: boolean;
      push?: boolean;
      marketing?: boolean;
    };
    privacy?: {
      showEmail?: boolean;
      showLocation?: boolean;
      allowDirectMessages?: boolean;
    };
  };
}

export interface CreateUserData {
  uid: string;
  name: string;
  email: string;
  photoURL?: string | null;
  bio?: string;
  tags?: string[];
  artisticName?: string;
  username?: string;
  location?: string;
  phone?: string;
  profileCompleted?: boolean;
  socials?: {
    website?: string;
    instagram?: string;
    youtube?: string;
  };
  preferences?: {
    notifications?: {
      email?: boolean;
      push?: boolean;
      marketing?: boolean;
    };
    privacy?: {
      showEmail?: boolean;
      showLocation?: boolean;
      allowDirectMessages?: boolean;
    };
  };
}

export interface UpdateUserData {
  name?: string;
  photoURL?: string | null;
  bio?: string;
  tags?: string[];
  artisticName?: string;
  username?: string;
  location?: string;
  phone?: string;
  profileCompleted?: boolean;
  socials?: {
    website?: string;
    instagram?: string;
    youtube?: string;
  };
  preferences?: {
    notifications?: {
      email?: boolean;
      push?: boolean;
      marketing?: boolean;
    };
    privacy?: {
      showEmail?: boolean;
      showLocation?: boolean;
      allowDirectMessages?: boolean;
    };
  };
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string | null;
  bio?: string;
  tags?: string[];
  artisticName?: string;
  username?: string;
  location?: string;
  phone?: string;
  profileCompleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
  socials?: {
    website?: string;
    instagram?: string;
    youtube?: string;
  };
}

// Username validation utilities
export const usernameUtils = {
  /**
   * Validate username format and rules
   */
  validate: (username: string): { isValid: boolean; error?: string } => {
    if (!username) {
      return { isValid: false, error: "Username é obrigatório" };
    }

    if (username.length < 3) {
      return { isValid: false, error: "Username deve ter pelo menos 3 caracteres" };
    }

    if (username.length > 20) {
      return { isValid: false, error: "Username deve ter no máximo 20 caracteres" };
    }

    // Check for valid characters (letters, numbers, underscore, hyphen)
    const validPattern = /^[a-zA-Z0-9_-]+$/;
    if (!validPattern.test(username)) {
      return { isValid: false, error: "Username pode conter apenas letras, números, _ e -" };
    }

    // Must start with letter or number
    const startsWithAlphaNumeric = /^[a-zA-Z0-9]/;
    if (!startsWithAlphaNumeric.test(username)) {
      return { isValid: false, error: "Username deve começar com letra ou número" };
    }

    // No consecutive special characters
    const noConsecutiveSpecial = /^(?!.*[-_]{2,})[a-zA-Z0-9_-]+$/;
    if (!noConsecutiveSpecial.test(username)) {
      return { isValid: false, error: "Username não pode ter _ ou - consecutivos" };
    }

    // Reserved usernames
    const reserved = [
      "admin", "api", "www", "mail", "ftp", "localhost", "artesfera",
      "support", "help", "info", "contact", "about", "terms", "privacy",
      "login", "register", "signup", "signin", "profile", "user", "users",
      "project", "projects", "gallery", "galleries", "daeva", "ai",
    ];

    if (reserved.includes(username.toLowerCase())) {
      return { isValid: false, error: "Este username não está disponível" };
    }

    return { isValid: true };
  },

  /**
   * Check if username is available
   */
  checkAvailability: async (username: string): Promise<boolean> => {
    try {
      const normalizedUsername = username.toLowerCase();
      const usernameRef = doc(db, COLLECTIONS.USERNAMES, normalizedUsername);
      const usernameDoc = await getDoc(usernameRef);
      return !usernameDoc.exists();
    } catch (error) {
      console.error("Error checking username availability:", error);
      throw error;
    }
  },

  /**
   * Generate available username from base name
   */
  generateAvailable: async (baseName: string): Promise<string> => {
    const normalizedBase = baseName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .substring(0, 15);
    
    let username = normalizedBase;
    let counter = 1;

    while (counter < 100) {
      const isAvailable = await usernameUtils.checkAvailability(username);
      if (isAvailable) {
        return username;
      }
      username = `${normalizedBase}${counter}`;
      counter++;
    }

    throw new Error("Unable to generate available username");
  },
};

// File cleanup utilities
export const userFileUtils = {
  /**
   * Delete user profile image
   */
  deleteProfileImage: async (userId: string, photoURL?: string): Promise<void> => {
    if (!photoURL || !photoURL.includes("firebase")) return;

    try {
      // Extract the file path from the URL
      const url = new URL(photoURL);
      const pathMatch = url.pathname.match(/\/b\/[^\/]+\/o\/(.+)$/);
      if (pathMatch) {
        const filePath = decodeURIComponent(pathMatch[1]);
        const fileRef = ref(storage, filePath);
        await deleteObject(fileRef);
        console.log(`✅ Deleted profile image for user: ${userId}`);
      }
    } catch (error) {
      console.error(`❌ Error deleting profile image for user ${userId}:`, error);
      // Don't throw error - continue with user deletion even if file cleanup fails
    }
  },

  /**
   * Delete all user artwork images
   */
  deleteUserArtworkImages: async (userId: string): Promise<void> => {
    try {
      // Get all user artworks to find image URLs
      const artworksQuery = query(
        collection(db, COLLECTIONS.ARTWORKS),
        where("userId", "==", userId)
      );
      const artworksSnapshot = await getDocs(artworksQuery);

      for (const artworkDoc of artworksSnapshot.docs) {
        const artworkData = artworkDoc.data();
        if (artworkData.images && Array.isArray(artworkData.images)) {
          for (const imageUrl of artworkData.images) {
            if (imageUrl && imageUrl.includes("firebase")) {
              try {
                const url = new URL(imageUrl);
                const pathMatch = url.pathname.match(/\/b\/[^\/]+\/o\/(.+)$/);
                if (pathMatch) {
                  const filePath = decodeURIComponent(pathMatch[1]);
                  const fileRef = ref(storage, filePath);
                  await deleteObject(fileRef);
                }
              } catch (fileError) {
                console.error(`❌ Error deleting artwork image:`, fileError);
                // Continue with other files even if one fails
              }
            }
          }
        }
      }
      console.log(`✅ Deleted all artwork images for user: ${userId}`);
    } catch (error) {
      console.error(`❌ Error deleting user artwork images for ${userId}:`, error);
      // Don't throw error - continue with user deletion
    }
  },
};

/**
 * User Service - CRUD operations with cascading deletion
 */
export const userService = {
  /**
   * Create a new user
   */
  create: async (userData: CreateUserData): Promise<string> => {
    try {
      const uid = userData.uid;

      // Validate and generate username if not provided
      let username = userData.username;
      if (!username) {
        const baseName = userData.name || userData.email?.split("@")[0] || "user";
        username = await usernameUtils.generateAvailable(baseName);
      } else {
        const validation = usernameUtils.validate(username);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }
        
        const isAvailable = await usernameUtils.checkAvailability(username);
        if (!isAvailable) {
          throw new Error("Username já está em uso");
        }
      }

      // Create user document with transaction for atomicity
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, COLLECTIONS.USERS, uid);
        const usernameRef = doc(db, COLLECTIONS.USERNAMES, username!.toLowerCase());

        // Double-check username availability in transaction
        const existingUsername = await transaction.get(usernameRef);
        if (existingUsername.exists()) {
          throw new Error("Username já está em uso");
        }

        const userDoc = {
          uid,
          name: userData.name?.trim() || "",
          email: userData.email?.trim() || "",
          photoURL: userData.photoURL || null,
          bio: userData.bio?.trim() || "",
          tags: userData.tags || [],
          artisticName: userData.artisticName?.trim() || "",
          username: username!.toLowerCase(),
          location: userData.location?.trim() || "",
          phone: userData.phone?.trim() || "",
          profileCompleted: userData.profileCompleted || false,
          socials: userData.socials || {},
          preferences: userData.preferences || {
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
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        const usernameDoc = {
          userId: uid,
          createdAt: serverTimestamp(),
        };

        transaction.set(userRef, userDoc);
        transaction.set(usernameRef, usernameDoc);
      });

      // Trigger public profile sync
      try {
        const syncData: ProfileSyncData = {
          uid,
          name: userData.name || "",
          email: userData.email || "",
          photoURL: userData.photoURL || undefined,
          bio: userData.bio,
          tags: userData.tags,
          website: userData.socials?.website,
          location: userData.location,
          username: username!.toLowerCase(),
          artisticName: userData.artisticName,
          profileCompleted: userData.profileCompleted,
        };

        // Create a minimal User object for the sync
        const mockUser = { uid } as User;
        await triggerProfileSync(syncData, mockUser);
        console.log(`✅ Created user and synced public profile: ${uid}`);
      } catch (syncError) {
        console.error(`❌ User created but sync failed for ${uid}:`, syncError);
        // Don't throw error - user creation succeeded
      }

      return uid;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  /**
   * Get user by ID
   */
  getById: async (userId: string): Promise<UserProfile | null> => {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        return {
          uid: userSnap.id,
          name: data.name || "",
          email: data.email || "",
          photoURL: data.photoURL || null,
          bio: data.bio || "",
          tags: data.tags || [],
          artisticName: data.artisticName || "",
          username: data.username || "",
          location: data.location || "",
          phone: data.phone || "",
          profileCompleted: data.profileCompleted || false,
          socials: data.socials || {},
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        } as UserProfile;
      }

      return null;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  },

  /**
   * Get user by username
   */
  getByUsername: async (username: string): Promise<UserProfile | null> => {
    try {
      const normalizedUsername = username.toLowerCase();
      
      // First get the userId from usernames collection
      const usernameRef = doc(db, COLLECTIONS.USERNAMES, normalizedUsername);
      const usernameSnap = await getDoc(usernameRef);

      if (!usernameSnap.exists()) {
        return null;
      }

      const usernameData = usernameSnap.data();
      return await userService.getById(usernameData.userId);
    } catch (error) {
      console.error("Error getting user by username:", error);
      throw error;
    }
  },

  /**
   * Get user by email
   */
  getByEmail: async (email: string): Promise<UserProfile | null> => {
    try {
      const usersQuery = query(
        collection(db, COLLECTIONS.USERS),
        where("email", "==", email.toLowerCase())
      );
      const querySnapshot = await getDocs(usersQuery);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const data = userDoc.data();
        return {
          uid: userDoc.id,
          name: data.name || "",
          email: data.email || "",
          photoURL: data.photoURL || null,
          bio: data.bio || "",
          tags: data.tags || [],
          artisticName: data.artisticName || "",
          username: data.username || "",
          location: data.location || "",
          phone: data.phone || "",
          profileCompleted: data.profileCompleted || false,
          socials: data.socials || {},
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        } as UserProfile;
      }

      return null;
    } catch (error) {
      console.error("Error getting user by email:", error);
      throw error;
    }
  },

  /**
   * Update user data
   */
  update: async (
    userId: string,
    updates: UpdateUserData,
    authUser?: User
  ): Promise<void> => {
    try {
      // Validate username if it's being updated
      if (updates.username) {
        const validation = usernameUtils.validate(updates.username);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }

        // Check if username is changing
        const currentUser = await userService.getById(userId);
        if (currentUser && currentUser.username !== updates.username.toLowerCase()) {
          const isAvailable = await usernameUtils.checkAvailability(updates.username);
          if (!isAvailable) {
            throw new Error("Username já está em uso");
          }
        }
      }

      // Prepare update data
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      // Clean up data
      if (updateData.name && typeof updateData.name === 'string') {
        updateData.name = updateData.name.trim();
      }
      if (updateData.bio && typeof updateData.bio === 'string') {
        updateData.bio = updateData.bio.trim();
      }
      if (updateData.artisticName && typeof updateData.artisticName === 'string') {
        updateData.artisticName = updateData.artisticName.trim();
      }
      if (updateData.location && typeof updateData.location === 'string') {
        updateData.location = updateData.location.trim();
      }
      if (updateData.phone && typeof updateData.phone === 'string') {
        updateData.phone = updateData.phone.trim();
      }
      if (updateData.username && typeof updateData.username === 'string') {
        updateData.username = updateData.username.toLowerCase();
      }
      if (updateData.tags && Array.isArray(updateData.tags)) {
        updateData.tags = updateData.tags.map((tag: string) => tag.trim().toLowerCase());
      }

      // Handle username changes with transaction
      if (updates.username) {
        const currentUser = await userService.getById(userId);
        if (currentUser && currentUser.username !== updates.username.toLowerCase()) {
          await runTransaction(db, async (transaction) => {
            // Remove old username mapping
            if (currentUser.username) {
              const oldUsernameRef = doc(db, COLLECTIONS.USERNAMES, currentUser.username);
              transaction.delete(oldUsernameRef);
            }

            // Create new username mapping
            const newUsernameRef = doc(db, COLLECTIONS.USERNAMES, updates.username!.toLowerCase());
            transaction.set(newUsernameRef, {
              userId,
              createdAt: serverTimestamp(),
            });

            // Update user document
            const userRef = doc(db, COLLECTIONS.USERS, userId);
            transaction.update(userRef, updateData);
          });
        } else {
          // No username change, just update user document
          const userRef = doc(db, COLLECTIONS.USERS, userId);
          await updateDoc(userRef, updateData);
        }
      } else {
        // No username change, just update user document
        const userRef = doc(db, COLLECTIONS.USERS, userId);
        await updateDoc(userRef, updateData);
      }

      // Trigger public profile sync
      try {
        const updatedUser = await userService.getById(userId);
        if (updatedUser) {
          const syncData: ProfileSyncData = {
            uid: userId,
            name: updatedUser.name,
            email: updatedUser.email,
            photoURL: updatedUser.photoURL || undefined,
            bio: updatedUser.bio,
            tags: updatedUser.tags,
            website: updatedUser.socials?.website,
            location: updatedUser.location,
            username: updatedUser.username,
            artisticName: updatedUser.artisticName,
            profileCompleted: updatedUser.profileCompleted,
          };

          await triggerProfileSync(syncData, authUser!);
          console.log(`✅ Updated user and synced public profile: ${userId}`);
        }
      } catch (syncError) {
        console.error(`❌ User updated but sync failed for ${userId}:`, syncError);
        // Don't throw error - user update succeeded
      }
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  /**
   * Delete user with cascading deletion
   */
  delete: async (userId: string): Promise<void> => {
    try {
      console.log(`🗑️ Starting cascading deletion for user: ${userId}`);

      // Get user data before deletion for cleanup
      const userData = await userService.getById(userId);
      if (!userData) {
        throw new Error("User not found");
      }

      // Step 1: Delete user files (profile image and artwork images)
      console.log(`🗑️ Step 1: Deleting user files for ${userId}`);
      await userFileUtils.deleteProfileImage(userId, userData.photoURL || undefined);
      await userFileUtils.deleteUserArtworkImages(userId);

      // Step 2: Use batch for multiple document deletions
      console.log(`🗑️ Step 2: Deleting Firestore documents for ${userId}`);
      const batch = writeBatch(db);

      // Delete from users collection
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      batch.delete(userRef);

      // Delete from publicProfiles collection
      const publicProfileRef = doc(db, COLLECTIONS.PUBLIC_PROFILES, userId);
      batch.delete(publicProfileRef);

      // Delete username mapping if exists
      if (userData.username) {
        const usernameRef = doc(db, COLLECTIONS.USERNAMES, userData.username.toLowerCase());
        batch.delete(usernameRef);
      }

      // Get and delete all user artworks
      const artworksQuery = query(
        collection(db, COLLECTIONS.ARTWORKS),
        where("userId", "==", userId)
      );
      const artworksSnapshot = await getDocs(artworksQuery);
      
      artworksSnapshot.docs.forEach((artworkDoc) => {
        batch.delete(artworkDoc.ref);
      });

      // Execute batch deletion
      await batch.commit();

      console.log(`✅ Successfully deleted user ${userId} and all related data`);
      console.log(`📊 Deletion summary:
        - User document: deleted
        - Public profile: deleted
        - Username mapping: ${userData.username ? 'deleted' : 'none'}
        - Artworks: ${artworksSnapshot.size} deleted
        - Files: cleaned up`);

    } catch (error) {
      console.error(`❌ Error deleting user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Check if user exists
   */
  exists: async (userId: string): Promise<boolean> => {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const userSnap = await getDoc(userRef);
      return userSnap.exists();
    } catch (error) {
      console.error("Error checking if user exists:", error);
      return false;
    }
  },

  /**
   * Get user's artwork count
   */
  getArtworkCount: async (userId: string): Promise<number> => {
    try {
      const artworksQuery = query(
        collection(db, COLLECTIONS.ARTWORKS),
        where("userId", "==", userId)
      );
      const artworksSnapshot = await getDocs(artworksQuery);
      return artworksSnapshot.size;
    } catch (error) {
      console.error("Error getting user artwork count:", error);
      return 0;
    }
  },

  /**
   * Validate user data before operations
   */
  validate: (userData: Partial<UserData>): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (userData.name && userData.name.trim().length < 2) {
      errors.push("Nome deve ter pelo menos 2 caracteres");
    }

    if (userData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        errors.push("Email inválido");
      }
    }

    if (userData.username) {
      const usernameValidation = usernameUtils.validate(userData.username);
      if (!usernameValidation.isValid) {
        errors.push(usernameValidation.error!);
      }
    }

    if (userData.phone && userData.phone.trim().length > 0) {
      const phoneRegex = /^[\+\(\)\-\s\d]+$/;
      if (!phoneRegex.test(userData.phone)) {
        errors.push("Telefone inválido");
      }
    }

    if (userData.bio && userData.bio.length > 500) {
      errors.push("Bio deve ter no máximo 500 caracteres");
    }

    if (userData.location && userData.location.length > 100) {
      errors.push("Localização deve ter no máximo 100 caracteres");
    }

    if (userData.tags && userData.tags.length > 10) {
      errors.push("Máximo de 10 tags permitidas");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

export default userService;