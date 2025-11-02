"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit,
  Trash2,
  Eye,
  Play,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";
import { Artwork } from "@/types/artwork";
import { TagList } from "@/components/TagBadge";
import { cn } from "@/lib/utils";

// Utility function to create URL slug
function createArtworkSlug(username: string, title: string): string {
  const cleanTitle = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .trim();

  return `${username}-${cleanTitle}`;
}

interface ArtworkCardProps {
  artwork: Artwork;
  username?: string; // Username of the artwork owner
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
  showActions?: boolean;
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({
  artwork,
  username,
  isOwner = false,
  onEdit,
  onDelete,
  className,
  showActions = true,
}) => {
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  // Generate artwork URL
  const artworkUrl = username
    ? `/artwork/${createArtworkSlug(username, artwork.title)}`
    : `/artwork/${artwork.id}`; // Fallback to ID-based URL
  const [imageError, setImageError] = useState(false);

  // Get the first image as thumbnail
  const thumbnailImage = artwork.images?.[0];
  const hasVideo = artwork.youtubeLinks && artwork.youtubeLinks.length > 0;
  const imageCount = artwork.images?.length || 0;

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15",
        "border border-white/[0.25] dark:border-white/15",
        "shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]",
        "hover:bg-white/[0.25] dark:hover:bg-black/25",
        "transition-all duration-300",
        className
      )}
    >
      {/* Image/Thumbnail Section */}
      <div className="relative aspect-square overflow-hidden">
        {thumbnailImage && !imageError ? (
          <Image
            src={thumbnailImage}
            alt={artwork.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-navy-blue/10 to-brand-yellow/10 dark:from-brand-yellow/10 dark:to-brand-navy-blue/10 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-brand-navy-blue/20 dark:bg-brand-yellow/20 flex items-center justify-center">
                <Eye className="w-8 h-8 text-brand-navy-blue dark:text-brand-yellow" />
              </div>
              <p className="text-sm text-brand-black/70 dark:text-brand-white/70">
                Sem imagem
              </p>
            </div>
          </div>
        )}

        {/* Image count indicator */}
        {imageCount > 1 && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-lg backdrop-blur-md bg-black/50 text-white text-xs font-medium">
            +{imageCount - 1}
          </div>
        )}

        {/* Video indicator */}
        {hasVideo && (
          <div className="absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur-md bg-red-500/80 text-white">
            <Play className="w-4 h-4" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link href={artworkUrl}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full backdrop-blur-md bg-white/20 border border-white/30 text-white hover:bg-white/30 transition-colors duration-200"
            >
              <ExternalLink className="w-6 h-6" />
            </motion.div>
          </Link>
        </div>

        {/* Owner actions menu */}
        {isOwner && showActions && (
          <div className="absolute top-2 right-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowActionsMenu(!showActionsMenu)}
              className="p-1.5 rounded-lg backdrop-blur-md bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <MoreHorizontal className="w-4 h-4" />
            </motion.button>

            <AnimatePresence>
              {showActionsMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  className="absolute top-full right-0 mt-1 min-w-[120px] rounded-lg backdrop-blur-md bg-white/90 dark:bg-black/90 border border-white/30 dark:border-white/20 shadow-lg overflow-hidden z-10"
                >
                  <button
                    onClick={() => {
                      onEdit?.();
                      setShowActionsMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-brand-black dark:text-brand-white hover:bg-brand-navy-blue/10 dark:hover:bg-brand-yellow/10 transition-colors duration-200 flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      onDelete?.();
                      setShowActionsMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title */}
        <Link href={artworkUrl}>
          <h3 className="font-semibold text-lg text-brand-black dark:text-brand-white mb-2 line-clamp-2 hover:text-brand-navy-blue dark:hover:text-brand-yellow transition-colors duration-200">
            {artwork.title}
          </h3>
        </Link>

        {/* Description Preview */}
        {artwork.description && (
          <p className="text-sm text-brand-black/70 dark:text-brand-white/70 mb-3 line-clamp-2">
            {artwork.description}
          </p>
        )}

        {/* Tags */}
        {artwork.tags && artwork.tags.length > 0 && (
          <TagList
            tags={artwork.tags}
            size="sm"
            maxDisplay={3}
            className="mb-2"
          />
        )}

        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-brand-black/50 dark:text-brand-white/50">
          <span>{new Date(artwork.createdAt).toLocaleDateString("pt-BR")}</span>
          <div className="flex items-center gap-2">
            {imageCount > 0 && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {imageCount}
              </span>
            )}
            {hasVideo && (
              <span className="flex items-center gap-1">
                <Play className="w-3 h-3" />
                {artwork.youtubeLinks.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close actions menu */}
      {showActionsMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActionsMenu(false)}
        />
      )}
    </motion.div>
  );
};

export default ArtworkCard;
