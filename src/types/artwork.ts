// Artwork data structure interfaces for the ArtEsfera platform

export interface Artwork {
  id: string;
  userId: string; // Owner's UID
  title: string;
  description: string;
  images: string[]; // Array of Firebase Storage URLs (max 5)
  youtubeLinks: string[]; // Array of YouTube URLs
  tags: string[]; // Array of tags like "painting", "dance", "cinema"
  category?: string; // Category for filtering (e.g., "Artes Visuais", "Música", etc.)
  createdAt: Date | string;
  updatedAt: Date | string;
  isPublic: boolean; // Allow users to control visibility
  featured?: boolean; // Whether artwork is featured
  views?: number; // View count for analytics
  likes?: number; // Like count for social features
}

export interface CreateArtworkData {
  title: string;
  description: string;
  images: string[];
  youtubeLinks: string[];
  tags: string[];
  category?: string;
  isPublic: boolean;
  featured?: boolean;
  views?: number;
  likes?: number;
}

export interface UpdateArtworkData extends Partial<CreateArtworkData> {
  updatedAt?: Date | string;
}

// Form data structure for the artwork creation/editing form
export interface ArtworkFormData {
  title: string;
  description: string;
  youtubeLinks: string[];
  tags: string[];
  category?: string;
  isPublic: boolean;
}

// File upload interfaces
export interface ImageUploadProgress {
  file: File;
  progress: number;
  url?: string;
  error?: string;
}

export interface ArtworkValidationErrors {
  title?: string;
  description?: string;
  images?: string;
  youtubeLinks?: string;
  tags?: string;
  category?: string;
  isPublic?: string;
  general?: string;
}

// Portfolio display configuration
export interface PortfolioConfig {
  maxArtworks: number; // 6 artworks per user
  maxImagesPerArtwork: number; // 5 images per artwork
  maxImageSizeMB: number; // File size limit
  allowedImageTypes: string[]; // Allowed MIME types
  maxTagLength: number;
  maxTags: number;
}

export const PORTFOLIO_CONFIG: PortfolioConfig = {
  maxArtworks: 6,
  maxImagesPerArtwork: 5,
  maxImageSizeMB: 10,
  allowedImageTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  maxTagLength: 20,
  maxTags: 10,
};

// YouTube URL validation and extraction
export interface YouTubeVideoInfo {
  videoId: string;
  url: string;
  embedUrl: string;
  thumbnailUrl: string;
}

// Portfolio statistics for analytics
export interface PortfolioStats {
  totalArtworks: number;
  totalImages: number;
  totalViews?: number; // For future analytics
  popularTags: string[];
}
