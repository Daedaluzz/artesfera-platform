// Firestore database utilities for ArtEsfera platform
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Collection names
export const COLLECTIONS = {
  USERS: "users",
  ARTWORKS: "artworks",
  PROJECTS: "projects",
  APPLICATIONS: "applications",
  SAVED_PROJECTS: "savedProjects",
  SAVED_ARTWORKS: "savedArtworks",
  CATEGORIES: "categories",
  TAGS: "tags",
} as const;

// User profile interface
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  location?: string;
  artistType?: string;
  experience?: string;
  specialties?: string[];
  verified?: boolean;
  role?: "artist" | "producer" | "contractor" | "admin";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Artwork interface
export interface Artwork {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  artistId: string;
  artistName: string;
  category: string;
  medium: string;
  year: number;
  tags: string[];
  featured?: boolean;
  views: number;
  likes: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Project interface
export interface Project {
  id?: string;
  title: string;
  description: string;
  company: string;
  category: string;
  imageUrl?: string;
  deadline: Timestamp;
  location: string;
  salary: {
    min: number;
    max: number;
  };
  type: "freelance" | "contract" | "temporary" | "event";
  duration: string;
  positions: number;
  applicants: number;
  tags: string[];
  featured?: boolean;
  postedDate: Timestamp;
  status: "active" | "closed" | "draft";
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Database utilities
export const dbUtils = {
  // User operations
  users: {
    create: async (
      uid: string,
      userData: Partial<UserProfile>
    ): Promise<void> => {
      const userRef = doc(db, COLLECTIONS.USERS, uid);
      await setDoc(userRef, {
        uid,
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    },

    get: async (uid: string): Promise<UserProfile | null> => {
      const userRef = doc(db, COLLECTIONS.USERS, uid);
      const userSnap = await getDoc(userRef);
      return userSnap.exists() ? (userSnap.data() as UserProfile) : null;
    },

    update: async (
      uid: string,
      updates: Partial<UserProfile>
    ): Promise<void> => {
      const userRef = doc(db, COLLECTIONS.USERS, uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    },

    delete: async (uid: string): Promise<void> => {
      const userRef = doc(db, COLLECTIONS.USERS, uid);
      await deleteDoc(userRef);
    },
  },

  // Artwork operations
  artworks: {
    create: async (
      artworkData: Omit<Artwork, "id" | "createdAt" | "updatedAt">
    ): Promise<string> => {
      const artworksRef = collection(db, COLLECTIONS.ARTWORKS);
      const docRef = await addDoc(artworksRef, {
        ...artworkData,
        views: 0,
        likes: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    },

    get: async (id: string): Promise<Artwork | null> => {
      const artworkRef = doc(db, COLLECTIONS.ARTWORKS, id);
      const artworkSnap = await getDoc(artworkRef);
      return artworkSnap.exists()
        ? ({ id, ...artworkSnap.data() } as Artwork)
        : null;
    },

    getAll: async (constraints: QueryConstraint[] = []): Promise<Artwork[]> => {
      const artworksRef = collection(db, COLLECTIONS.ARTWORKS);
      const q = query(artworksRef, ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Artwork)
      );
    },

    getByCategory: async (
      category: string,
      limitCount = 12
    ): Promise<Artwork[]> => {
      return dbUtils.artworks.getAll([
        where("category", "==", category),
        orderBy("createdAt", "desc"),
        limit(limitCount),
      ]);
    },

    getByArtist: async (artistId: string): Promise<Artwork[]> => {
      return dbUtils.artworks.getAll([
        where("artistId", "==", artistId),
        orderBy("createdAt", "desc"),
      ]);
    },

    getFeatured: async (limitCount = 6): Promise<Artwork[]> => {
      return dbUtils.artworks.getAll([
        where("featured", "==", true),
        orderBy("createdAt", "desc"),
        limit(limitCount),
      ]);
    },

    update: async (id: string, updates: Partial<Artwork>): Promise<void> => {
      const artworkRef = doc(db, COLLECTIONS.ARTWORKS, id);
      await updateDoc(artworkRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    },

    delete: async (id: string): Promise<void> => {
      const artworkRef = doc(db, COLLECTIONS.ARTWORKS, id);
      await deleteDoc(artworkRef);
    },

    incrementViews: async (id: string): Promise<void> => {
      const artworkRef = doc(db, COLLECTIONS.ARTWORKS, id);
      const artwork = await getDoc(artworkRef);
      if (artwork.exists()) {
        const currentViews = artwork.data().views || 0;
        await updateDoc(artworkRef, { views: currentViews + 1 });
      }
    },

    incrementLikes: async (id: string): Promise<void> => {
      const artworkRef = doc(db, COLLECTIONS.ARTWORKS, id);
      const artwork = await getDoc(artworkRef);
      if (artwork.exists()) {
        const currentLikes = artwork.data().likes || 0;
        await updateDoc(artworkRef, { likes: currentLikes + 1 });
      }
    },

    decrementLikes: async (id: string): Promise<void> => {
      const artworkRef = doc(db, COLLECTIONS.ARTWORKS, id);
      const artwork = await getDoc(artworkRef);
      if (artwork.exists()) {
        const currentLikes = artwork.data().likes || 0;
        await updateDoc(artworkRef, { likes: Math.max(0, currentLikes - 1) });
      }
    },
  },

  // Project operations
  projects: {
    create: async (
      projectData: Omit<Project, "id" | "createdAt" | "updatedAt">
    ): Promise<string> => {
      const projectsRef = collection(db, COLLECTIONS.PROJECTS);
      const docRef = await addDoc(projectsRef, {
        ...projectData,
        applicants: 0,
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    },

    get: async (id: string): Promise<Project | null> => {
      const projectRef = doc(db, COLLECTIONS.PROJECTS, id);
      const projectSnap = await getDoc(projectRef);
      return projectSnap.exists()
        ? ({ id, ...projectSnap.data() } as Project)
        : null;
    },

    getAll: async (constraints: QueryConstraint[] = []): Promise<Project[]> => {
      const projectsRef = collection(db, COLLECTIONS.PROJECTS);
      const q = query(projectsRef, ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Project)
      );
    },

    getActive: async (limitCount = 12): Promise<Project[]> => {
      return dbUtils.projects.getAll([
        where("status", "==", "active"),
        orderBy("postedDate", "desc"),
        limit(limitCount),
      ]);
    },

    getByCategory: async (
      category: string,
      limitCount = 12
    ): Promise<Project[]> => {
      return dbUtils.projects.getAll([
        where("category", "==", category),
        where("status", "==", "active"),
        orderBy("postedDate", "desc"),
        limit(limitCount),
      ]);
    },

    getFeatured: async (limitCount = 6): Promise<Project[]> => {
      return dbUtils.projects.getAll([
        where("featured", "==", true),
        where("status", "==", "active"),
        orderBy("postedDate", "desc"),
        limit(limitCount),
      ]);
    },

    update: async (id: string, updates: Partial<Project>): Promise<void> => {
      const projectRef = doc(db, COLLECTIONS.PROJECTS, id);
      await updateDoc(projectRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    },

    delete: async (id: string): Promise<void> => {
      const projectRef = doc(db, COLLECTIONS.PROJECTS, id);
      await deleteDoc(projectRef);
    },

    incrementApplicants: async (id: string): Promise<void> => {
      const projectRef = doc(db, COLLECTIONS.PROJECTS, id);
      const project = await getDoc(projectRef);
      if (project.exists()) {
        const currentApplicants = project.data().applicants || 0;
        await updateDoc(projectRef, { applicants: currentApplicants + 1 });
      }
    },
  },

  // Saved items operations
  savedItems: {
    saveArtwork: async (userId: string, artworkId: string): Promise<void> => {
      const savedRef = doc(
        db,
        COLLECTIONS.SAVED_ARTWORKS,
        `${userId}_${artworkId}`
      );
      await setDoc(savedRef, {
        userId,
        artworkId,
        savedAt: serverTimestamp(),
      });
    },

    unsaveArtwork: async (userId: string, artworkId: string): Promise<void> => {
      const savedRef = doc(
        db,
        COLLECTIONS.SAVED_ARTWORKS,
        `${userId}_${artworkId}`
      );
      await deleteDoc(savedRef);
    },

    saveProject: async (userId: string, projectId: string): Promise<void> => {
      const savedRef = doc(
        db,
        COLLECTIONS.SAVED_PROJECTS,
        `${userId}_${projectId}`
      );
      await setDoc(savedRef, {
        userId,
        projectId,
        savedAt: serverTimestamp(),
      });
    },

    unsaveProject: async (userId: string, projectId: string): Promise<void> => {
      const savedRef = doc(
        db,
        COLLECTIONS.SAVED_PROJECTS,
        `${userId}_${projectId}`
      );
      await deleteDoc(savedRef);
    },

    getUserSavedArtworks: async (userId: string): Promise<string[]> => {
      const savedRef = collection(db, COLLECTIONS.SAVED_ARTWORKS);
      const q = query(savedRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data().artworkId);
    },

    getUserSavedProjects: async (userId: string): Promise<string[]> => {
      const savedRef = collection(db, COLLECTIONS.SAVED_PROJECTS);
      const q = query(savedRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data().projectId);
    },
  },
};
