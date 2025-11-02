import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import { getClientFirestore, getClientStorage } from "@/lib/firebase";
import {
  Artwork,
  CreateArtworkData,
  UpdateArtworkData,
  PORTFOLIO_CONFIG,
  YouTubeVideoInfo,
} from "@/types/artwork";

const db = getClientFirestore();
const storage = getClientStorage();

// Collection names
const COLLECTIONS = {
  ARTWORKS: "artworks",
  PUBLIC_ARTWORKS: "artesfera/public/artworks",
} as const;

// Storage paths
const STORAGE_PATHS = {
  ARTWORK_IMAGES: "artwork-images",
} as const;

/**
 * YouTube URL utilities
 */
export const youtubeUtils = {
  /**
   * Extract video ID from various YouTube URL formats
   */
  extractVideoId: (url: string): string | null => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  },

  /**
   * Validate YouTube URL and extract video info
   */
  getVideoInfo: (url: string): YouTubeVideoInfo | null => {
    const videoId = youtubeUtils.extractVideoId(url);
    if (!videoId) return null;

    return {
      videoId,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    };
  },

  /**
   * Validate multiple YouTube URLs
   */
  validateUrls: (
    urls: string[]
  ): { valid: YouTubeVideoInfo[]; invalid: string[] } => {
    const valid: YouTubeVideoInfo[] = [];
    const invalid: string[] = [];

    urls.forEach((url) => {
      if (url.trim()) {
        const videoInfo = youtubeUtils.getVideoInfo(url.trim());
        if (videoInfo) {
          valid.push(videoInfo);
        } else {
          invalid.push(url);
        }
      }
    });

    return { valid, invalid };
  },
};

/**
 * Image upload utilities
 */
export const imageUtils = {
  /**
   * Validate image file
   */
  validateImage: (file: File): { valid: boolean; error?: string } => {
    // Check file type
    if (!PORTFOLIO_CONFIG.allowedImageTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Tipo de arquivo não suportado. Use: ${PORTFOLIO_CONFIG.allowedImageTypes.join(
          ", "
        )}`,
      };
    }

    // Check file size
    const maxSizeBytes = PORTFOLIO_CONFIG.maxImageSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: `Arquivo muito grande. Máximo: ${PORTFOLIO_CONFIG.maxImageSizeMB}MB`,
      };
    }

    return { valid: true };
  },

  /**
   * Upload image to Firebase Storage
   */
  uploadImage: async (
    file: File,
    userId: string,
    artworkId: string,
    onProgress?: (progress: number) => void
  ): Promise<string> => {
    const validation = imageUtils.validateImage(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Create unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop() || "jpg";
    const fileName = `${timestamp}_${Math.random()
      .toString(36)
      .substring(2)}.${fileExtension}`;

    // Create storage reference
    const imageRef = ref(
      storage,
      `${STORAGE_PATHS.ARTWORK_IMAGES}/${userId}/${artworkId}/${fileName}`
    );

    try {
      // Upload file
      const snapshot = await uploadBytes(imageRef, file);

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Erro ao fazer upload da imagem");
    }
  },

  /**
   * Delete image from Firebase Storage
   */
  deleteImage: async (imageUrl: string): Promise<void> => {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error("Error deleting image:", error);
      // Don't throw error here as the image might already be deleted
    }
  },

  /**
   * Delete all images for an artwork
   */
  deleteArtworkImages: async (
    userId: string,
    artworkId: string
  ): Promise<void> => {
    try {
      const folderRef = ref(
        storage,
        `${STORAGE_PATHS.ARTWORK_IMAGES}/${userId}/${artworkId}`
      );
      const listResult = await listAll(folderRef);

      // Delete all files in the folder
      const deletePromises = listResult.items.map((item) => deleteObject(item));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error deleting artwork images:", error);
    }
  },
};

/**
 * Artwork CRUD operations
 */
export const artworkService = {
  /**
   * Create a new artwork
   */
  create: async (
    userId: string,
    artworkData: CreateArtworkData
  ): Promise<string> => {
    try {
      // Check if user has reached artwork limit
      const userArtworks = await artworkService.getUserArtworks(userId);
      if (userArtworks.length >= PORTFOLIO_CONFIG.maxArtworks) {
        throw new Error(
          `Limite de ${PORTFOLIO_CONFIG.maxArtworks} obras atingido`
        );
      }

      // Validate YouTube URLs
      if (artworkData.youtubeLinks.length > 0) {
        const { invalid } = youtubeUtils.validateUrls(artworkData.youtubeLinks);
        if (invalid.length > 0) {
          throw new Error(`URLs do YouTube inválidas: ${invalid.join(", ")}`);
        }
      }

      // Create artwork document
      const artworkDoc = {
        userId,
        title: artworkData.title.trim(),
        description: artworkData.description.trim(),
        images: artworkData.images,
        youtubeLinks: artworkData.youtubeLinks.filter((url) => url.trim()),
        tags: artworkData.tags.map((tag) => tag.trim().toLowerCase()),
        isPublic: artworkData.isPublic,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Add to Firestore
      const docRef = await addDoc(
        collection(db, COLLECTIONS.ARTWORKS),
        artworkDoc
      );

      return docRef.id;
    } catch (error) {
      console.error("Error creating artwork:", error);
      throw error;
    }
  },

  /**
   * Get artwork by ID
   */
  getById: async (artworkId: string): Promise<Artwork | null> => {
    try {
      const docRef = doc(db, COLLECTIONS.ARTWORKS, artworkId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        } as Artwork;
      }

      return null;
    } catch (error) {
      console.error("Error getting artwork:", error);
      throw error;
    }
  },

  /**
   * Get all artworks for a user
   */
  getUserArtworks: async (
    userId: string,
    includePrivate: boolean = false
  ): Promise<Artwork[]> => {
    try {
      let q = query(
        collection(db, COLLECTIONS.ARTWORKS),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );

      // If not including private, filter by public only
      if (!includePrivate) {
        q = query(
          collection(db, COLLECTIONS.ARTWORKS),
          where("userId", "==", userId),
          where("isPublic", "==", true),
          orderBy("createdAt", "desc")
        );
      }

      const querySnapshot = await getDocs(q);
      const artworks: Artwork[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        artworks.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        } as Artwork);
      });

      return artworks;
    } catch (error) {
      console.error("Error getting user artworks:", error);
      throw error;
    }
  },

  /**
   * Update artwork
   */
  update: async (
    artworkId: string,
    updates: UpdateArtworkData
  ): Promise<void> => {
    try {
      // Validate YouTube URLs if provided
      if (updates.youtubeLinks && updates.youtubeLinks.length > 0) {
        const { invalid } = youtubeUtils.validateUrls(updates.youtubeLinks);
        if (invalid.length > 0) {
          throw new Error(`URLs do YouTube inválidas: ${invalid.join(", ")}`);
        }
      }

      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      // Clean up data
      if (updateData.title) {
        updateData.title = updateData.title.trim();
      }
      if (updateData.description) {
        updateData.description = updateData.description.trim();
      }
      if (updateData.youtubeLinks) {
        updateData.youtubeLinks = updateData.youtubeLinks.filter((url) =>
          url.trim()
        );
      }
      if (updateData.tags) {
        updateData.tags = updateData.tags.map((tag) =>
          tag.trim().toLowerCase()
        );
      }

      const docRef = doc(db, COLLECTIONS.ARTWORKS, artworkId);
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error("Error updating artwork:", error);
      throw error;
    }
  },

  /**
   * Delete artwork
   */
  delete: async (artworkId: string, userId: string): Promise<void> => {
    try {
      // First, delete all associated images
      await imageUtils.deleteArtworkImages(userId, artworkId);

      // Then delete the document
      const docRef = doc(db, COLLECTIONS.ARTWORKS, artworkId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting artwork:", error);
      throw error;
    }
  },

  /**
   * Check if user owns artwork
   */
  isOwner: async (artworkId: string, userId: string): Promise<boolean> => {
    try {
      const artwork = await artworkService.getById(artworkId);
      return artwork?.userId === userId;
    } catch (error) {
      console.error("Error checking artwork ownership:", error);
      return false;
    }
  },
};

export default artworkService;
