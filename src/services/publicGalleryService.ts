/**
 * Public Gallery Service
 * 
 * Service for fetching public artworks from all users for the main gallery page
 * Includes filtering, pagination, and search functionality
 */

import { collection, query, where, orderBy, limit, startAfter, getDocs, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { getClientFirestore } from "@/lib/firebase";
import { Artwork } from "@/types/artwork";

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

  /**
   * Fetch public artworks for the main gallery
   * Only returns artworks that are marked as public (isPublic: true)
   */
  async getPublicArtworks(
    filters: GalleryFilters = {},
    lastDocument?: QueryDocumentSnapshot<DocumentData>
  ): Promise<GalleryResponse> {
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
          
          // Fetch owner info from publicProfiles
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

      return {
        artworks: artworksWithOwners,
        lastDoc,
        hasMore
      };

    } catch (error) {
      console.error('❌ Error fetching public artworks:', error);
      throw new Error('Failed to fetch gallery artworks');
    }
  }

  /**
   * Get owner information for an artwork
   */
  private async getArtworkOwnerInfo(userId: string) {
    try {
      const ownerQuery = query(
        collection(db, "publicProfiles"),
        where("uid", "==", userId)
      );
      
      const ownerSnapshot = await getDocs(ownerQuery);
      
      if (!ownerSnapshot.empty) {
        const ownerData = ownerSnapshot.docs[0].data();
        return {
          uid: ownerData.uid,
          displayName: ownerData.displayName || 'Artista Anônimo',
          username: ownerData.username,
          photoURL: ownerData.photoURL
        };
      }

      return {
        uid: userId,
        displayName: 'Artista Anônimo',
        username: undefined,
        photoURL: undefined
      };
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