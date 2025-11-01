// Firebase Storage utilities for ArtEsfera platform
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTask,
  UploadTaskSnapshot,
} from 'firebase/storage';
import { storage } from './firebase';

// Storage paths
export const STORAGE_PATHS = {
  ARTWORKS: 'artworks',
  PROJECTS: 'projects',
  PROFILES: 'profiles',
  DOCUMENTS: 'documents',
} as const;

// Upload progress callback type
export type UploadProgressCallback = (progress: number) => void;

// Storage utilities
export const storageUtils = {
  // Upload artwork image
  uploadArtworkImage: async (
    file: File,
    userId: string,
    artworkId?: string,
    onProgress?: UploadProgressCallback
  ): Promise<string> => {
    const filename = `${userId}/${artworkId || Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${STORAGE_PATHS.ARTWORKS}/${filename}`);

    if (onProgress) {
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } else {
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    }
  },

  // Upload project image
  uploadProjectImage: async (
    file: File,
    userId: string,
    projectId?: string,
    onProgress?: UploadProgressCallback
  ): Promise<string> => {
    const filename = `${userId}/${projectId || Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${STORAGE_PATHS.PROJECTS}/${filename}`);

    if (onProgress) {
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } else {
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    }
  },

  // Upload profile image
  uploadProfileImage: async (
    file: File,
    userId: string,
    onProgress?: UploadProgressCallback
  ): Promise<string> => {
    const filename = `${userId}/profile_${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${STORAGE_PATHS.PROFILES}/${filename}`);

    if (onProgress) {
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } else {
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    }
  },

  // Upload document (PDF, DOC, etc.)
  uploadDocument: async (
    file: File,
    userId: string,
    documentType: string,
    onProgress?: UploadProgressCallback
  ): Promise<string> => {
    const filename = `${userId}/${documentType}_${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${STORAGE_PATHS.DOCUMENTS}/${filename}`);

    if (onProgress) {
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } else {
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    }
  },

  // Delete file
  deleteFile: async (fileUrl: string): Promise<void> => {
    try {
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  // Generate file path
  generateFilePath: (
    category: keyof typeof STORAGE_PATHS,
    userId: string,
    filename: string
  ): string => {
    return `${STORAGE_PATHS[category]}/${userId}/${Date.now()}_${filename}`;
  },

  // Validate file type and size
  validateFile: (
    file: File,
    allowedTypes: string[],
    maxSizeInMB: number
  ): { isValid: boolean; error?: string } => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `Tipo de arquivo não permitido. Tipos aceitos: ${allowedTypes.join(', ')}`,
      };
    }

    // Check file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return {
        isValid: false,
        error: `Arquivo muito grande. Tamanho máximo: ${maxSizeInMB}MB`,
      };
    }

    return { isValid: true };
  },
};

// File type constants
export const FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
  DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALL_MEDIA: [
    'image/jpeg', 'image/png', 'image/webp', 'image/jpg',
    'video/mp4', 'video/webm', 'video/ogg',
    'audio/mp3', 'audio/wav', 'audio/ogg'
  ],
} as const;

// File size limits (in MB)
export const FILE_SIZE_LIMITS = {
  ARTWORK_IMAGE: 10,
  PROJECT_IMAGE: 5,
  PROFILE_IMAGE: 2,
  DOCUMENT: 10,
} as const;