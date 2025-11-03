/**
 * GalleryCard Component
 *
 * Card component for displaying artworks in the public gallery
 * Similar to portfolio cards but includes owner information
 */

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Eye, Share2, Calendar, ExternalLink, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PublicArtworkWithOwner } from "@/services/publicGalleryService";
import { useAuth } from "@/context/AuthContext";

interface GalleryCardProps {
  artwork: PublicArtworkWithOwner;
  onLike?: (artworkId: string) => void;
  onShare?: (artwork: PublicArtworkWithOwner) => void;
  isLiked?: boolean;
}

export function GalleryCard({
  artwork,
  onLike,
  onShare,
  isLiked = false,
}: GalleryCardProps) {
  const { user } = useAuth();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Generate artwork URL (slug-based if possible)
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const artworkUrl =
    artwork.owner?.username && artwork.title
      ? `/artwork/${artwork.owner.username}-${generateSlug(artwork.title)}`
      : `/artwork/${artwork.id}`;

  // Generate owner profile URL
  const ownerProfileUrl = artwork.owner?.username
    ? `/${artwork.owner.username}`
    : `/${artwork.owner?.uid?.slice(0, 8) || "unknown"}`;

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onLike) {
      onLike(artwork.id);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onShare) {
      onShare(artwork);
    }
  };

  const formatDate = (
    date: Date | string | { toDate?: () => Date } | null | undefined
  ) => {
    try {
      if (!date) return "Data não disponível";

      let dateObj: Date;

      if (
        typeof date === "object" &&
        date !== null &&
        "toDate" in date &&
        typeof date.toDate === "function"
      ) {
        // Firestore Timestamp
        dateObj = date.toDate();
      } else if (typeof date === "string") {
        dateObj = new Date(date);
      } else if (date instanceof Date) {
        dateObj = date;
      } else {
        return "Data não disponível";
      }

      if (isNaN(dateObj.getTime())) {
        return "Data não disponível";
      }

      return dateObj.getFullYear().toString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Data não disponível";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative rounded-[20px] backdrop-blur-[15px] bg-white/[0.2] dark:bg-black/20 border border-white/[0.3] dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)] overflow-hidden hover:shadow-[0_16px_48px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)] transition-all duration-500 cursor-pointer"
    >
      <Link href={artworkUrl} className="block">
        {/* Artwork Image */}
        <div className="relative aspect-square overflow-hidden">
          {!imageError ? (
            <Image
              src={artwork.images?.[0] || "/placeholder-artwork.jpg"}
              alt={artwork.title}
              fill
              className={`object-cover transition-all duration-500 group-hover:scale-110 ${
                imageLoading ? "blur-sm" : "blur-0"
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
              <div className="text-center text-gray-400 dark:text-gray-600">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Image
                    width={24}
                    height={24}
                    alt="No image"
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'/%3E%3C/svg%3E"
                  />
                </div>
                <p className="text-sm">Imagem não disponível</p>
              </div>
            </div>
          )}

          {/* Loading overlay */}
          {imageLoading && !imageError && (
            <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse" />
          )}

          {/* Featured badge */}
          {artwork.featured && (
            <div className="absolute top-4 left-4 z-10">
              <Badge className="bg-brand-yellow/90 dark:bg-brand-navy-blue/90 text-brand-black dark:text-brand-white border-0">
                Destaque
              </Badge>
            </div>
          )}

          {/* Overlay with Actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {user && (
                  <motion.button
                    onClick={handleLike}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-full backdrop-blur-[10px] bg-white/20 border border-white/30 transition-colors cursor-pointer ${
                      isLiked ? "text-red-500" : "text-white hover:text-red-400"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                    />
                  </motion.button>
                )}
                <motion.button
                  onClick={handleShare}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full backdrop-blur-[10px] bg-white/20 border border-white/30 text-white hover:text-brand-blue transition-colors cursor-pointer"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="p-2 rounded-full backdrop-blur-[10px] bg-white/20 border border-white/30 text-white"
                >
                  <ExternalLink className="w-5 h-5" />
                </motion.div>
              </div>
              <div className="flex items-center gap-3 text-white text-sm">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {artwork.views || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {artwork.likes || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Artwork Details */}
        <div className="p-5">
          {/* Owner Info */}
          <div className="flex items-center gap-3 mb-4">
            <Link
              href={ownerProfileUrl}
              className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 dark:border-white/20 shadow-lg flex-shrink-0">
                {artwork.owner?.photoURL ? (
                  <Image
                    src={artwork.owner.photoURL}
                    alt={artwork.owner.displayName}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-navy-blue/10 to-brand-yellow/10 dark:from-brand-yellow/10 dark:to-brand-navy-blue/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-brand-navy-blue dark:text-brand-yellow" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brand-black dark:text-brand-white truncate">
                  {artwork.owner?.displayName || "Artista Anônimo"}
                </p>
                {artwork.owner?.username && (
                  <p className="text-xs text-brand-black/60 dark:text-brand-white/60 truncate">
                    @{artwork.owner.username}
                  </p>
                )}
              </div>
            </Link>
          </div>

          {/* Artwork Title */}
          <h3 className="text-lg font-bold mb-2 text-brand-black dark:text-brand-white line-clamp-2 group-hover:text-brand-navy-blue dark:group-hover:text-brand-yellow transition-colors">
            {artwork.title}
          </h3>

          {/* Category & Date */}
          <div className="flex items-center gap-2 mb-3 text-sm text-brand-black/70 dark:text-brand-white/70">
            {artwork.category && (
              <>
                <span>{artwork.category}</span>
                <span className="text-xs text-brand-black/40 dark:text-brand-white/40">
                  •
                </span>
              </>
            )}
            <Calendar className="w-3 h-3" />
            <span>{formatDate(artwork.createdAt)}</span>
          </div>

          {/* Description */}
          {artwork.description && (
            <p className="text-sm text-brand-black/60 dark:text-brand-white/60 mb-4 line-clamp-2">
              {artwork.description}
            </p>
          )}

          {/* Tags */}
          {artwork.tags && artwork.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {artwork.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-white/50 dark:bg-white/10 text-brand-black dark:text-brand-white border-white/30 text-xs hover:bg-brand-navy-blue/20 dark:hover:bg-brand-yellow/20 transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // TODO: Add tag filtering functionality
                  }}
                >
                  {tag}
                </Badge>
              ))}
              {artwork.tags.length > 3 && (
                <Badge
                  variant="secondary"
                  className="bg-white/30 dark:bg-white/10 text-brand-black/60 dark:text-brand-white/60 border-white/20 text-xs"
                >
                  +{artwork.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
