/**
 * Public Gallery Service
 * 
 * Service for fetching public artworks from all users for the main gallery page
 * Includes filtering, pagination, search functionality, and caching
 */

import { collection, query, where, orderBy, limit, startAfter, getDocs, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { getClientFirestore } from "@/lib/firebase";
import { Artwork } from "@/types/artwork";
import { cacheService } from "./cacheService";

const db = getClientFirestore();

export interface PublicArtworkWithOwner extends Artwork {
  owner?: {
    uid: string;
    displayName: string;
    username?: string;
    photoURL?: string;
  };
}

export interface GalleryFilters {
  tags?: string[];
  category?: string;
  sortBy?: 'createdAt' | 'views' | 'likes' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface GalleryResponse {
  artworks: PublicArtworkWithOwner[];
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
  hasMore: boolean;
  totalCount?: number;
}

class PublicGalleryService {
  private readonly ARTWORKS_PER_PAGE = 12;
  private readonly CACHE_TTL_ARTWORKS = 2 * 60 * 1000; // 2 minutes
  private readonly CACHE_TTL_METADATA = 5 * 60 * 1000; // 5 minutes for tags/categories
  private readonly MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

  /**
   * Fetch public artworks for the main gallery
   * Only returns artworks that are marked as public (isPublic: true)
   */
  async getPublicArtworks(
    filters: GalleryFilters = {},
    lastDocument?: QueryDocumentSnapshot<DocumentData>
  ): Promise<GalleryResponse> {
    // Create cache key based on filters and pagination
    const cacheKey = `artworks_${JSON.stringify(filters)}_${lastDocument?.id || 'initial'}`;
    
    // Check cache first
    const cachedResult = cacheService.get<GalleryResponse>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    // Check throttling
    if (cacheService.shouldThrottleRequest(`artworks_${JSON.stringify(filters)}`, this.MIN_REQUEST_INTERVAL)) {
      // Return cached data from a similar query if available
      const fallbackKey = `artworks_${JSON.stringify({ ...filters, sortBy: 'createdAt', sortOrder: 'desc' })}_initial`;
      const fallback = cacheService.get<GalleryResponse>(fallbackKey);
      if (fallback) {
        console.log('🔄 Using fallback cache data due to throttling');
        return fallback;
      }
    }

    try {
      console.log('🎨 Fetching public artworks with filters:', filters);

      // Build the base query - only public artworks
      let artworksQuery = query(
        collection(db, "artworks"),
        where("isPublic", "==", true)
      );

      // Add category filter if specified
      if (filters.category && filters.category !== 'Todos') {
        artworksQuery = query(
          artworksQuery,
          where("category", "==", filters.category)
        );
      }

      // Add tag filter if specified
      if (filters.tags && filters.tags.length > 0) {
        artworksQuery = query(
          artworksQuery,
          where("tags", "array-contains-any", filters.tags)
        );
      }

      // Add sorting
      const sortField = filters.sortBy || 'createdAt';
      const sortDirection = filters.sortOrder || 'desc';
      artworksQuery = query(
        artworksQuery,
        orderBy(sortField, sortDirection)
      );

      // Add pagination
      if (lastDocument) {
        artworksQuery = query(artworksQuery, startAfter(lastDocument));
      }

      // Limit results
      artworksQuery = query(artworksQuery, limit(this.ARTWORKS_PER_PAGE + 1));

      const snapshot = await getDocs(artworksQuery);
      console.log(`📊 Found ${snapshot.docs.length} artworks`);

      // Check if there are more documents
      const hasMore = snapshot.docs.length > this.ARTWORKS_PER_PAGE;
      const artworkDocs = hasMore ? snapshot.docs.slice(0, -1) : snapshot.docs;

      // Convert to artwork objects with owner info
      const artworksWithOwners = await Promise.all(
        artworkDocs.map(async (doc) => {
          const artworkData = { id: doc.id, ...doc.data() } as Artwork;
          
          // Fetch owner info from publicProfiles with caching
          const ownerInfo = await this.getArtworkOwnerInfo(artworkData.userId);
          
          return {
            ...artworkData,
            owner: ownerInfo
          } as PublicArtworkWithOwner;
        })
      );

      const lastDoc = hasMore && artworkDocs.length > 0 
        ? artworkDocs[artworkDocs.length - 1] 
        : undefined;

      const result: GalleryResponse = {
        artworks: artworksWithOwners,
        lastDoc,
        hasMore
      };

      // Cache the result
      cacheService.set(cacheKey, result, this.CACHE_TTL_ARTWORKS);

      return result;

    } catch (error) {
      console.error('❌ Error fetching public artworks:', error);
      throw new Error('Failed to fetch gallery artworks');
    }
  }

  /**
   * Get owner information for an artwork
   */
  private async getArtworkOwnerInfo(userId: string) {
    // Check cache first
    const cacheKey = `owner_${userId}`;
    const cachedOwner = cacheService.get(cacheKey);
    if (cachedOwner) {
      return cachedOwner;
    }

    try {
      const ownerQuery = query(
        collection(db, "publicProfiles"),
        where("uid", "==", userId)
      );
      
      const ownerSnapshot = await getDocs(ownerQuery);
      
      let ownerInfo;
      if (!ownerSnapshot.empty) {
        const ownerData = ownerSnapshot.docs[0].data();
        ownerInfo = {
          uid: ownerData.uid,
          displayName: ownerData.displayName || 'Artista Anônimo',
          username: ownerData.username,
          photoURL: ownerData.photoURL
        };
      } else {
        ownerInfo = {
          uid: userId,
          displayName: 'Artista Anônimo',
          username: undefined,
          photoURL: undefined
        };
      }

      // Cache owner info for longer since it changes less frequently
      cacheService.set(cacheKey, ownerInfo, this.CACHE_TTL_METADATA);
      return ownerInfo;

    } catch (error) {
      console.error('❌ Error fetching owner info for user:', userId, error);
      return {
        uid: userId,
        displayName: 'Artista Anônimo',
        username: undefined,
        photoURL: undefined
      };
    }
  }

  /**
   * Get all unique tags from public artworks for filtering
   */
  async getAvailableTags(): Promise<string[]> {
    const cacheKey = 'available_tags';
    
    // Check cache first
    const cachedTags = cacheService.get<string[]>(cacheKey);
    if (cachedTags) {
      return cachedTags;
    }

    // Check throttling for metadata requests
    if (cacheService.shouldThrottleRequest('metadata_tags', 2000)) {
      console.log('🚫 Tags request throttled, returning empty array');
      return [];
    }

    try {
      console.log('🏷️ Fetching available tags from public artworks');

      const artworksQuery = query(
        collection(db, "artworks"),
        where("isPublic", "==", true)
      );

      const snapshot = await getDocs(artworksQuery);
      const allTags = new Set<string>();

      snapshot.docs.forEach((doc) => {
        const artwork = doc.data() as Artwork;
        if (artwork.tags && Array.isArray(artwork.tags)) {
          artwork.tags.forEach((tag) => {
            if (tag && tag.trim()) {
              allTags.add(tag.trim().toLowerCase());
            }
          });
        }
      });

      const uniqueTags = Array.from(allTags).sort();
      console.log(`📊 Found ${uniqueTags.length} unique tags`);

      // Cache for longer since tags don't change frequently
      cacheService.set(cacheKey, uniqueTags, this.CACHE_TTL_METADATA);

      return uniqueTags;
    } catch (error) {
      console.error('❌ Error fetching available tags:', error);
      return [];
    }
  }

  /**
   * Get categories with counts for filtering
   */
  async getAvailableCategories(): Promise<{ category: string; count: number }[]> {
    const cacheKey = 'available_categories';
    
    // Check cache first
    const cachedCategories = cacheService.get<{ category: string; count: number }[]>(cacheKey);
    if (cachedCategories) {
      return cachedCategories;
    }

    // Check throttling for metadata requests
    if (cacheService.shouldThrottleRequest('metadata_categories', 2000)) {
      console.log('🚫 Categories request throttled, returning empty array');
      return [];
    }

    try {
      console.log('📂 Fetching available categories from public artworks');

      const artworksQuery = query(
        collection(db, "artworks"),
        where("isPublic", "==", true)
      );

      const snapshot = await getDocs(artworksQuery);
      const categoryCount = new Map<string, number>();

      snapshot.docs.forEach((doc) => {
        const artwork = doc.data() as Artwork;
        if (artwork.category) {
          const count = categoryCount.get(artwork.category) || 0;
          categoryCount.set(artwork.category, count + 1);
        }
      });

      const categories = Array.from(categoryCount.entries())
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);

      console.log(`📊 Found ${categories.length} categories`);
      
      // Cache for longer since categories don't change frequently
      cacheService.set(cacheKey, categories, this.CACHE_TTL_METADATA);
      
      return categories;
    } catch (error) {
      console.error('❌ Error fetching available categories:', error);
      return [];
    }
  }

  /**
   * Search artworks by title, description, or tags
   */
  async searchArtworks(
    searchTerm: string,
    filters: GalleryFilters = {},
    lastDocument?: QueryDocumentSnapshot<DocumentData>
  ): Promise<GalleryResponse> {
    try {
      console.log('🔍 Searching artworks for term:', searchTerm);

      // For now, we'll fetch all public artworks and filter client-side
      // In production, you might want to use Algolia or another search service
      const response = await this.getPublicArtworks(filters, lastDocument);
      
      if (!searchTerm.trim()) {
        return response;
      }

      const searchTermLower = searchTerm.toLowerCase();
      const filteredArtworks = response.artworks.filter((artwork) => {
        return (
          artwork.title?.toLowerCase().includes(searchTermLower) ||
          artwork.description?.toLowerCase().includes(searchTermLower) ||
          artwork.tags?.some(tag => tag.toLowerCase().includes(searchTermLower)) ||
          artwork.owner?.displayName?.toLowerCase().includes(searchTermLower) ||
          artwork.owner?.username?.toLowerCase().includes(searchTermLower)
        );
      });

      return {
        ...response,
        artworks: filteredArtworks
      };
    } catch (error) {
      console.error('❌ Error searching artworks:', error);
      throw new Error('Failed to search artworks');
    }
  }
}

export const publicGalleryService = new PublicGalleryService();
export default publicGalleryService;