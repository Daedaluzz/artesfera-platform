"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Share2,
  Eye,
  Calendar,
  Play,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { TagList } from "@/components/TagBadge";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { Artwork } from "@/types/artwork";
import artworkService, { youtubeUtils } from "@/services/artworkService";
import { doc, getDoc, query, collection, where, getDocs, limit } from "firebase/firestore";
import { getClientFirestore } from "@/lib/firebase";

const db = getClientFirestore();

interface ArtworkCreator {
  uid: string;
  name: string;
  artisticName?: string;
  photoURL?: string;
  username?: string;
}

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

// Utility function to parse slug back to username and title
function parseArtworkSlug(slug: string): { username: string; titleSlug: string } | null {
  const parts = slug.split("-");
  if (parts.length < 2) return null;
  
  const username = parts[0];
  const titleSlug = parts.slice(1).join("-");
  
  return { username, titleSlug };
}

export default function ArtworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const slug = params?.id as string; // Using 'id' param but treating it as slug

  // State management
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [creator, setCreator] = useState<ArtworkCreator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const isOwner = user && artwork && user.uid === artwork.userId;

  // Fetch artwork and creator data
  useEffect(() => {
    const fetchArtworkData = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);

        // First try to parse as slug (username-title format)
        const parsedSlug = parseArtworkSlug(slug);
        
        if (parsedSlug) {
          // Handle slug-based lookup
          const { username } = parsedSlug;

          // First, get the user by username to get their userId
          const userQuery = query(
            collection(db, "publicProfiles"),
            where("username", "==", username),
            limit(1)
          );
          const userSnapshot = await getDocs(userQuery);

          if (userSnapshot.empty) {
            setError("Usuário não encontrado");
            return;
          }

          const userData = userSnapshot.docs[0].data() as ArtworkCreator;
          setCreator(userData);

          // Now search for artwork by userId and title slug match
          const artworksQuery = query(
            collection(db, "artworks"),
            where("userId", "==", userData.uid)
          );
          const artworksSnapshot = await getDocs(artworksQuery);

          let foundArtwork: Artwork | null = null;

          // Find artwork by matching title slug
          for (const doc of artworksSnapshot.docs) {
            const artworkData = { id: doc.id, ...doc.data() } as Artwork;
            const artworkSlug = createArtworkSlug(username, artworkData.title);
            
            if (artworkSlug === slug) {
              foundArtwork = artworkData;
              break;
            }
          }

          if (!foundArtwork) {
            setError("Obra não encontrada");
            return;
          }

          // Check if artwork is public or if user is the owner
          if (
            !foundArtwork.isPublic &&
            (!user || user.uid !== foundArtwork.userId)
          ) {
            setError("Esta obra não está disponível publicamente");
            return;
          }

          setArtwork(foundArtwork);
        } else {
          // Fallback: treat as artwork ID for backward compatibility
          const artworkData = await artworkService.getById(slug);

          if (!artworkData) {
            setError("Obra não encontrada");
            return;
          }

          // Check if artwork is public or if user is the owner
          if (
            !artworkData.isPublic &&
            (!user || user.uid !== artworkData.userId)
          ) {
            setError("Esta obra não está disponível publicamente");
            return;
          }

          setArtwork(artworkData);

          // Fetch creator data from public profiles
          const creatorRef = doc(db, "publicProfiles", artworkData.userId);
          const creatorSnap = await getDoc(creatorRef);

          if (creatorSnap.exists()) {
            setCreator(creatorSnap.data() as ArtworkCreator);
          }
        }

      } catch (err) {
        console.error("Error fetching artwork:", err);
        setError("Erro ao carregar obra");
      } finally {
        setLoading(false);
      }
    };

    fetchArtworkData();
  }, [slug, user]);

  // Handle navigation
  const handleGoBack = () => {
    if (creator?.username) {
      router.push(`/${creator.username}/portfolio`);
    } else {
      router.back();
    }
  };

  // Handle share
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/artwork/${slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: artwork?.title,
          text: artwork?.description,
          url: shareUrl,
        });
      } catch {
        // User cancelled or error occurred
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copiado para a área de transferência!");
      } catch (err) {
        console.error("Error copying to clipboard:", err);
      }
    }
  };

  // Handle edit
  const handleEdit = () => {
    console.log("Edit artwork - modal will be implemented");
    // TODO: Open ArtworkFormModal with existing data
  };

  // Handle delete
  const handleDelete = async () => {
    if (!artwork || !isOwner) return;

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir "${artwork.title}"? Esta ação não pode ser desfeita.`
    );

    if (confirmed) {
      try {
        await artworkService.delete(artwork.id, artwork.userId);
        router.push(`/${creator?.username}/portfolio`);
      } catch (err) {
        console.error("Error deleting artwork:", err);
        alert("Erro ao excluir obra. Tente novamente.");
      }
    }
  };

  // Handle image navigation
  const handlePrevImage = () => {
    if (!artwork?.images?.length) return;
    setSelectedImageIndex((prev) =>
      prev === 0 ? artwork.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!artwork?.images?.length) return;
    setSelectedImageIndex((prev) =>
      prev === artwork.images.length - 1 ? 0 : prev + 1
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-brand-cream to-brand-beige dark:from-brand-black dark:via-brand-navy-900 dark:to-brand-navy-800">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy-blue dark:border-brand-yellow"></div>
          <div className="absolute inset-0 rounded-full h-12 w-12 border-t-2 border-brand-navy-blue/20 dark:border-brand-yellow/20 animate-ping"></div>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error || !artwork) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-white via-brand-cream to-brand-beige dark:from-brand-black dark:via-brand-navy-900 dark:to-brand-navy-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <Eye className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-brand-black dark:text-brand-white mb-2">
            {error || "Obra não encontrada"}
          </h1>
          <p className="text-brand-black/70 dark:text-brand-white/70 mb-6">
            A obra que você está procurando não existe ou foi removida.
          </p>
          <SecondaryButton
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={handleGoBack}
          >
            Voltar
          </SecondaryButton>
        </motion.div>
      </div>
    );
  }

  const hasImages = artwork.images && artwork.images.length > 0;
  const hasVideos = artwork.youtubeLinks && artwork.youtubeLinks.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-brand-cream to-brand-beige dark:from-brand-black dark:via-brand-navy-900 dark:to-brand-navy-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <SecondaryButton
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={handleGoBack}
              className="text-sm"
            >
              Voltar
            </SecondaryButton>

            <div className="flex items-center gap-2">
              <SecondaryButton
                leftIcon={<Share2 className="w-4 h-4" />}
                onClick={handleShare}
                className="text-sm"
              >
                Compartilhar
              </SecondaryButton>

              {isOwner && (
                <>
                  <SecondaryButton
                    leftIcon={<Edit className="w-4 h-4" />}
                    onClick={handleEdit}
                    className="text-sm"
                  >
                    Editar
                  </SecondaryButton>
                  <SecondaryButton
                    leftIcon={<Trash2 className="w-4 h-4" />}
                    onClick={handleDelete}
                    className="text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Excluir
                  </SecondaryButton>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Media Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Images Gallery */}
            {hasImages && (
              <div className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-brand-black/15 border border-white/[0.25] dark:border-brand-navy-500/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white mb-4">
                  Imagens ({artwork.images.length})
                </h3>

                {/* Main Image */}
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-black">
                  <Image
                    src={artwork.images[selectedImageIndex]}
                    alt={`${artwork.title} - Imagem ${selectedImageIndex + 1}`}
                    fill
                    className="object-contain cursor-pointer"
                    onClick={() => setIsImageModalOpen(true)}
                  />

                  {/* Navigation arrows */}
                  {artwork.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full backdrop-blur-md bg-black/50 text-white hover:bg-black/70 transition-colors duration-200 cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full backdrop-blur-md bg-black/50 text-white hover:bg-black/70 transition-colors duration-200 cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Image counter */}
                  <div className="absolute bottom-2 right-2 px-3 py-1 rounded-lg backdrop-blur-md bg-black/50 text-white text-sm">
                    {selectedImageIndex + 1} / {artwork.images.length}
                  </div>
                </div>

                {/* Image Thumbnails */}
                {artwork.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {artwork.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          index === selectedImageIndex
                            ? "border-brand-navy-blue dark:border-brand-yellow scale-105"
                            : "border-white/30 dark:border-white/20 hover:border-brand-navy-blue/50 dark:hover:border-brand-yellow/50"
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Videos Section */}
            {hasVideos && (
              <div className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-brand-black/15 border border-white/[0.25] dark:border-brand-navy-500/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Vídeos ({artwork.youtubeLinks.length})
                </h3>

                <div className="space-y-4">
                  {artwork.youtubeLinks.map((url, index) => {
                    const videoInfo = youtubeUtils.getVideoInfo(url);
                    if (!videoInfo) return null;

                    return (
                      <div
                        key={index}
                        className="relative aspect-video rounded-xl overflow-hidden bg-black"
                      >
                        <iframe
                          src={videoInfo.embedUrl}
                          title={`${artwork.title} - Vídeo ${index + 1}`}
                          className="w-full h-full"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>

          {/* Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Artwork Info */}
            <div className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-brand-black/15 border border-white/[0.25] dark:border-brand-navy-500/30 rounded-2xl p-6">
              <h1 className="text-2xl font-bold text-brand-black dark:text-brand-white mb-2">
                {artwork.title}
              </h1>

              {artwork.description && (
                <div className="mb-4">
                  <p className="text-brand-black/80 dark:text-brand-white/80 whitespace-pre-wrap">
                    {artwork.description}
                  </p>
                </div>
              )}

              {/* Tags */}
              {artwork.tags && artwork.tags.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-brand-black dark:text-brand-white mb-2">
                    Tags:
                  </h4>
                  <TagList tags={artwork.tags} size="sm" />
                </div>
              )}

              {/* Meta info */}
              <div className="flex items-center gap-4 text-sm text-brand-black/70 dark:text-brand-white/70">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {artwork.createdAt ? (() => {
                    try {
                      const dateValue = artwork.createdAt;
                      if (typeof dateValue === 'string') {
                        return new Date(dateValue).toLocaleDateString("pt-BR");
                      } else if (dateValue && typeof dateValue === 'object' && 'toDate' in dateValue) {
                        return new Date((dateValue as { toDate(): Date }).toDate()).toLocaleDateString("pt-BR");
                      } else {
                        return new Date(dateValue).toLocaleDateString("pt-BR");
                      }
                    } catch {
                      return 'Data não disponível';
                    }
                  })() : 'Data não disponível'}
                </span>
              </div>
            </div>

            {/* Creator Info */}
            {creator && (
              <div className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-brand-black/15 border border-white/[0.25] dark:border-brand-navy-500/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white mb-4">
                  Artista
                </h3>

                <Link href={`/${creator.username}`} className="block">
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.1] dark:hover:bg-black/10 transition-colors duration-200">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 dark:border-white/20 flex-shrink-0 relative">
                      {creator.photoURL ? (
                        <Image
                          src={creator.photoURL}
                          alt={creator.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-brand-navy-blue/10 to-brand-yellow/10 dark:from-brand-yellow/10 dark:to-brand-navy-blue/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-brand-navy-blue dark:text-brand-yellow">
                            {creator.name?.[0]?.toUpperCase() || "U"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-brand-black dark:text-brand-white truncate">
                        {creator.artisticName || creator.name}
                      </h4>
                      <p className="text-sm text-brand-black/70 dark:text-brand-white/70 truncate">
                        @{creator.username}
                      </p>
                    </div>
                  </div>
                </Link>

                <div className="mt-4">
                  <Link href={`/${creator.username}/portfolio`}>
                    <PrimaryButton fullWidth className="text-sm">
                      Ver Portfólio
                    </PrimaryButton>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Image Modal */}
        <AnimatePresence>
          {isImageModalOpen && hasImages && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setIsImageModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-7xl max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={artwork.images[selectedImageIndex]}
                  alt={`${artwork.title} - Imagem ${selectedImageIndex + 1}`}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-[90vh] object-contain"
                />

                {/* Close button */}
                <button
                  onClick={() => setIsImageModalOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Navigation in modal */}
                {artwork.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors duration-200 cursor-pointer"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors duration-200 cursor-pointer"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Image counter in modal */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg bg-black/50 text-white text-sm">
                  {selectedImageIndex + 1} / {artwork.images.length}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
