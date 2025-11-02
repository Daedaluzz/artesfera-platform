"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, Grid3X3, Grid2X2, List } from "lucide-react";
import { Artwork, PORTFOLIO_CONFIG } from "@/types/artwork";
import { ArtworkCard } from "@/components/ArtworkCard";
import { TagList } from "@/components/TagBadge";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { cn } from "@/lib/utils";

interface PortfolioGalleryProps {
  artworks: Artwork[];
  username?: string; // Username of the portfolio owner
  isOwner?: boolean;
  loading?: boolean;
  onAddArtwork?: () => void;
  onEditArtwork?: (artwork: Artwork) => void;
  onDeleteArtwork?: (artwork: Artwork) => void;
  className?: string;
}

type ViewMode = "grid3" | "grid2" | "list";
type SortMode = "newest" | "oldest" | "title" | "popular";

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({
  artworks,
  username,
  isOwner = false,
  loading = false,
  onAddArtwork,
  onEditArtwork,
  onDeleteArtwork,
  className,
}) => {
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>(artworks);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid3");
  const [showFilters, setShowFilters] = useState(false);

  // Get all unique tags from artworks
  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    artworks.forEach((artwork) => {
      artwork.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [artworks]);

  // Filter and sort artworks
  useEffect(() => {
    let filtered = [...artworks];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (artwork) =>
          artwork.title.toLowerCase().includes(query) ||
          artwork.description.toLowerCase().includes(query) ||
          artwork.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((artwork) =>
        selectedTags.every((tag) => artwork.tags?.includes(tag))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortMode) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "title":
          return a.title.localeCompare(b.title);
        case "popular":
          // For now, sort by number of images + videos as a popularity proxy
          const aMedia =
            (a.images?.length || 0) + (a.youtubeLinks?.length || 0);
          const bMedia =
            (b.images?.length || 0) + (b.youtubeLinks?.length || 0);
          return bMedia - aMedia;
        default:
          return 0;
      }
    });

    setFilteredArtworks(filtered);
  }, [artworks, searchQuery, selectedTags, sortMode]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
  };

  const canAddArtwork =
    isOwner && artworks.length < PORTFOLIO_CONFIG.maxArtworks;

  const gridClasses = {
    grid3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    grid2: "grid-cols-1 md:grid-cols-2",
    list: "grid-cols-1",
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-black dark:text-brand-white">
            Portfólio
          </h2>
          <p className="text-brand-black/70 dark:text-brand-white/70">
            {artworks.length} de {PORTFOLIO_CONFIG.maxArtworks} obras
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* View mode toggles */}
          <div className="flex items-center rounded-lg backdrop-blur-md bg-white/[0.1] dark:bg-black/10 border border-white/[0.2] dark:border-white/[0.1] p-1">
            <button
              onClick={() => setViewMode("grid3")}
              className={cn(
                "p-2 rounded-md transition-colors duration-200",
                viewMode === "grid3"
                  ? "bg-brand-navy-blue/20 dark:bg-brand-yellow/20 text-brand-navy-blue dark:text-brand-yellow"
                  : "text-brand-black/70 dark:text-brand-white/70 hover:text-brand-navy-blue dark:hover:text-brand-yellow"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid2")}
              className={cn(
                "p-2 rounded-md transition-colors duration-200",
                viewMode === "grid2"
                  ? "bg-brand-navy-blue/20 dark:bg-brand-yellow/20 text-brand-navy-blue dark:text-brand-yellow"
                  : "text-brand-black/70 dark:text-brand-white/70 hover:text-brand-navy-blue dark:hover:text-brand-yellow"
              )}
            >
              <Grid2X2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-md transition-colors duration-200",
                viewMode === "list"
                  ? "bg-brand-navy-blue/20 dark:bg-brand-yellow/20 text-brand-navy-blue dark:text-brand-yellow"
                  : "text-brand-black/70 dark:text-brand-white/70 hover:text-brand-navy-blue dark:hover:text-brand-yellow"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {canAddArtwork && (
            <PrimaryButton
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={onAddArtwork}
              className="text-sm"
            >
              Adicionar Obra
            </PrimaryButton>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-black/50 dark:text-brand-white/50" />
          <input
            type="text"
            placeholder="Buscar por título, descrição ou tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl backdrop-blur-md bg-white/[0.1] dark:bg-black/10 border border-white/[0.2] dark:border-white/[0.1] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 transition-all duration-200"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <SecondaryButton
              leftIcon={<Filter className="w-4 h-4" />}
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm"
            >
              Filtros
            </SecondaryButton>

            {(searchQuery || selectedTags.length > 0) && (
              <button
                onClick={clearFilters}
                className="text-sm text-brand-navy-blue dark:text-brand-yellow hover:underline"
              >
                Limpar filtros
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className="px-3 py-2 rounded-lg backdrop-blur-md bg-white/[0.1] dark:bg-brand-black/80 border border-white/[0.2] dark:border-white/[0.1] text-brand-black dark:text-brand-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30"
            style={{
              colorScheme: "dark",
            }}
          >
            <option
              value="newest"
              className="bg-white dark:bg-brand-black text-brand-black dark:text-brand-white"
            >
              Mais recentes
            </option>
            <option
              value="oldest"
              className="bg-white dark:bg-brand-black text-brand-black dark:text-brand-white"
            >
              Mais antigas
            </option>
            <option
              value="title"
              className="bg-white dark:bg-brand-black text-brand-black dark:text-brand-white"
            >
              Título A-Z
            </option>
            <option
              value="popular"
              className="bg-white dark:bg-brand-black text-brand-black dark:text-brand-white"
            >
              Mais populares
            </option>
          </select>
        </div>

        {/* Tag filters */}
        <AnimatePresence>
          {showFilters && allTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-xl backdrop-blur-md bg-white/[0.1] dark:bg-black/10 border border-white/[0.2] dark:border-white/[0.1]">
                <h4 className="text-sm font-medium text-brand-black dark:text-brand-white mb-3">
                  Filtrar por tags:
                </h4>
                <TagList
                  tags={allTags}
                  variant="interactive"
                  size="sm"
                  onTagClick={handleTagToggle}
                  className="gap-2"
                />
                {selectedTags.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/[0.2] dark:border-white/[0.1]">
                    <p className="text-xs text-brand-black/70 dark:text-brand-white/70 mb-2">
                      Tags selecionadas:
                    </p>
                    <TagList
                      tags={selectedTags}
                      variant="removable"
                      size="sm"
                      onTagRemove={(tag) =>
                        setSelectedTags((prev) => prev.filter((t) => t !== tag))
                      }
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Gallery */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl backdrop-blur-md bg-white/[0.1] dark:bg-black/10 border border-white/[0.2] dark:border-white/[0.1] animate-pulse"
            />
          ))}
        </div>
      ) : filteredArtworks.length > 0 ? (
        <motion.div layout className={cn("grid gap-6", gridClasses[viewMode])}>
          <AnimatePresence mode="popLayout">
            {filteredArtworks.map((artwork) => (
              <motion.div
                key={artwork.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ArtworkCard
                  artwork={artwork}
                  username={username}
                  isOwner={isOwner}
                  onEdit={() => onEditArtwork?.(artwork)}
                  onDelete={() => onDeleteArtwork?.(artwork)}
                  className={viewMode === "list" ? "flex-row" : ""}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-brand-navy-blue/10 dark:bg-brand-yellow/10 flex items-center justify-center">
            <Search className="w-12 h-12 text-brand-navy-blue dark:text-brand-yellow" />
          </div>
          <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white mb-2">
            {artworks.length === 0
              ? "Nenhuma obra encontrada"
              : "Nenhuma obra corresponde aos filtros"}
          </h3>
          <p className="text-brand-black/70 dark:text-brand-white/70 mb-6">
            {artworks.length === 0
              ? isOwner
                ? "Comece adicionando sua primeira obra ao portfólio."
                : "Este artista ainda não publicou nenhuma obra."
              : "Tente ajustar os filtros ou termos de busca."}
          </p>
          {canAddArtwork && artworks.length === 0 && (
            <PrimaryButton
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={onAddArtwork}
            >
              Adicionar Primeira Obra
            </PrimaryButton>
          )}
        </div>
      )}
    </div>
  );
};

export default PortfolioGallery;
