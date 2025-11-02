"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { GalleryCard } from "@/components/GalleryCard";
import { TagFilter } from "@/components/TagFilter";
import { 
  publicGalleryService, 
  PublicArtworkWithOwner, 
  GalleryFilters 
} from "@/services/publicGalleryService";
import { cacheService } from "@/services/cacheService";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { Loader2, ImageOff, Palette } from "lucide-react";

export default function Gallery() {
  // State management
  const [artworks, setArtworks] = useState<PublicArtworkWithOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | undefined>();
  const [likedArtworks, setLikedArtworks] = useState<string[]>([]);
  const [currentFilters, setCurrentFilters] = useState<GalleryFilters>({
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Stable filters string to prevent unnecessary re-renders
  const filtersString = useMemo(() => JSON.stringify(currentFilters), [currentFilters]);

  // Fetch artworks function with stable dependencies
  const loadArtworks = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
        setError(null);
        setLastDoc(undefined);
      } else {
        setLoadingMore(true);
      }

      console.log('🎨 Loading artworks with filters:', currentFilters);

      const response = await publicGalleryService.getPublicArtworks(
        currentFilters,
        isInitial ? undefined : lastDoc
      );

      if (isInitial) {
        setArtworks(response.artworks);
      } else {
        setArtworks(prev => [...prev, ...response.artworks]);
      }

      setHasMore(response.hasMore);
      setLastDoc(response.lastDoc);

      console.log(`✅ Loaded ${response.artworks.length} artworks. Has more: ${response.hasMore}`);

    } catch (err) {
      console.error('❌ Error loading artworks:', err);
      setError('Erro ao carregar obras. Tente novamente.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [currentFilters, lastDoc]);

  // Debounced filter change handler
  const debouncedLoadArtworks = useMemo(() => 
    cacheService.debounce(() => loadArtworks(true), 500),
    [loadArtworks]
  );

  // Fetch initial artworks only when filters actually change
  useEffect(() => {
    debouncedLoadArtworks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersString]); // Use stable string instead of object

  const handleFiltersChange = useCallback((newFilters: GalleryFilters) => {
    console.log('🔄 Filters changed:', newFilters);
    setCurrentFilters(newFilters);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      loadArtworks(false);
    }
  }, [loadingMore, hasMore, loadArtworks]);

  const handleLike = useCallback((artworkId: string) => {
    setLikedArtworks(prev =>
      prev.includes(artworkId)
        ? prev.filter(id => id !== artworkId)
        : [...prev, artworkId]
    );
    // TODO: Implement actual like functionality with Firebase
  }, []);

  const handleShare = useCallback(async (artwork: PublicArtworkWithOwner) => {
    try {
      const artworkUrl = artwork.owner?.username && artwork.title
        ? `${window.location.origin}/artwork/${artwork.owner.username}-${artwork.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`
        : `${window.location.origin}/artwork/${artwork.id}`;

      if (navigator.share) {
        await navigator.share({
          title: artwork.title,
          text: `Confira esta obra de ${artwork.owner?.displayName || 'Artista Anônimo'} na ArtEsfera`,
          url: artworkUrl,
        });
      } else {
        await navigator.clipboard.writeText(artworkUrl);
        // TODO: Add toast notification for copy success
        console.log('Link copiado para a área de transferência');
      }
    } catch (error) {
      console.error('Error sharing artwork:', error);
    }
  }, []);
  return (
    <div className="py-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-brand-black dark:text-brand-white mb-6">
          Galeria{" "}
          <span className="text-brand-navy-blue dark:text-brand-yellow">
            ArtEsfera
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-brand-black/80 dark:text-brand-white/80 max-w-3xl mx-auto leading-relaxed">
          Descubra projetos incríveis, artistas talentosos e a diversidade
          criativa que move nossa comunidade
        </p>
      </motion.div>

      {/* Dynamic Tag Filter */}
      <TagFilter 
        onFiltersChange={handleFiltersChange}
        currentFilters={currentFilters}
      />

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <div className="relative">
            <Loader2 className="w-12 h-12 text-brand-navy-blue dark:text-brand-yellow animate-spin" />
            <div className="absolute inset-0 w-12 h-12 border-t-2 border-brand-navy-blue/20 dark:border-brand-yellow/20 rounded-full animate-ping" />
          </div>
          <p className="mt-4 text-brand-black/60 dark:text-brand-white/60">
            Carregando obras incríveis...
          </p>
        </motion.div>
      )}

      {/* Error State */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <ImageOff className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-brand-black dark:text-brand-white mb-2">
            Erro ao carregar galeria
          </h3>
          <p className="text-brand-black/70 dark:text-brand-white/70 mb-4">
            {error}
          </p>
          <SecondaryButton onClick={() => loadArtworks(true)}>
            Tentar Novamente
          </SecondaryButton>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && !error && artworks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-navy-blue/10 dark:bg-brand-yellow/10 flex items-center justify-center">
            <Palette className="w-8 h-8 text-brand-navy-blue dark:text-brand-yellow" />
          </div>
          <h3 className="text-xl font-bold text-brand-black dark:text-brand-white mb-2">
            Nenhuma obra encontrada
          </h3>
          <p className="text-brand-black/70 dark:text-brand-white/70 mb-4">
            Não encontramos obras com os filtros selecionados. Tente ajustar os filtros ou volte mais tarde.
          </p>
          <SecondaryButton onClick={() => setCurrentFilters({ sortBy: 'createdAt', sortOrder: 'desc' })}>
            Limpar Filtros
          </SecondaryButton>
        </motion.div>
      )}

      {/* Gallery Grid */}
      {!loading && !error && artworks.length > 0 && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16"
          >
            {artworks.map((artwork) => (
              <GalleryCard
                key={artwork.id}
                artwork={artwork}
                onLike={handleLike}
                onShare={handleShare}
                isLiked={likedArtworks.includes(artwork.id)}
              />
            ))}
          </motion.div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center">
              <SecondaryButton 
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="relative"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Carregando...
                  </>
                ) : (
                  'Carregar Mais Obras'
                )}
              </SecondaryButton>
            </div>
          )}

          {/* Results Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8 text-sm text-brand-black/60 dark:text-brand-white/60"
          >
            Mostrando {artworks.length} obra{artworks.length !== 1 ? 's' : ''} 
            {Object.keys(currentFilters).length > 1 && ' com filtros aplicados'}
          </motion.div>
        </>
      )}
    </div>
  );
}
