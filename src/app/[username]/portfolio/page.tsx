"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { PortfolioGallery } from "@/components/PortfolioGallery";
import { ArtworkFormModal } from "@/components/ArtworkFormModal";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Artwork } from "@/types/artwork";
import artworkService from "@/services/artworkService";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getClientFirestore } from "@/lib/firebase";

const db = getClientFirestore();

interface PublicUserProfile {
  uid: string;
  name: string;
  photoURL: string | null;
  artisticName?: string;
  bio?: string;
  username?: string;
  location?: string;
  tags?: string[];
}

export default function UserPortfolioPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const username = params?.username as string;

  // State management
  const [profileData, setProfileData] = useState<PublicUserProfile | null>(
    null
  );
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [artworksLoading, setArtworksLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showArtworkModal, setShowArtworkModal] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  // Check if current user is the owner of this profile
  const isOwner = user && profileData && user.uid === profileData.uid;

  // Fetch profile data by username
  useEffect(() => {
    const fetchProfileByUsername = async () => {
      if (!username) return;

      try {
        setLoading(true);
        setError(null);

        // Clean username (remove @ if present)
        const cleanUsername = username.startsWith("@")
          ? username.slice(1)
          : username;

        console.log("Fetching profile for username:", cleanUsername);

        // Query publicProfiles collection by username (same as main profile page)
        const profilesQuery = query(
          collection(db, "publicProfiles"),
          where("username", "==", cleanUsername.toLowerCase())
        );
        console.log("Querying for username:", cleanUsername.toLowerCase());
        const profilesSnapshot = await getDocs(profilesQuery);

        console.log(
          "Query result:",
          profilesSnapshot.empty
            ? "No documents found"
            : `Found ${profilesSnapshot.docs.length} documents`
        );

        if (!profilesSnapshot.empty) {
          const profileDoc = profilesSnapshot.docs[0];
          console.log("Profile data:", profileDoc.data());
          setProfileData(profileDoc.data() as PublicUserProfile);
        } else {
          console.log("No profile found for username:", cleanUsername);
          setError("Perfil não encontrado");
        }
      } catch (err) {
        console.error("Error fetching profile by username:", err);
        setError("Erro ao carregar perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileByUsername();
  }, [username]);

  // Fetch artworks when profile is loaded
  useEffect(() => {
    const fetchArtworks = async () => {
      if (!profileData) return;

      try {
        setArtworksLoading(true);

        // Get artworks - show private ones only if user is owner
        const userArtworks = await artworkService.getUserArtworks(
          profileData.uid,
          isOwner || false
        );

        console.log("Fetched artworks:", userArtworks);
        setArtworks(userArtworks);
      } catch (err) {
        console.error("Error fetching artworks:", err);
        // Don't set error for artworks, just show empty state
      } finally {
        setArtworksLoading(false);
      }
    };

    if (profileData) {
      fetchArtworks();
    }
  }, [profileData, isOwner]);

  // Handle back navigation
  const handleGoBack = () => {
    router.push(`/${username}`);
  };

  // Handle refresh artworks (after adding/editing/deleting)
  const handleRefreshArtworks = async () => {
    if (!profileData) return;

    try {
      setArtworksLoading(true);
      const userArtworks = await artworkService.getUserArtworks(
        profileData.uid,
        isOwner || false
      );
      setArtworks(userArtworks);
    } catch (err) {
      console.error("Error refreshing artworks:", err);
    } finally {
      setArtworksLoading(false);
    }
  };

  // Placeholder handlers for artwork management
  const handleAddArtwork = () => {
    setEditingArtwork(null);
    setShowArtworkModal(true);
  };

  const handleEditArtwork = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    setShowArtworkModal(true);
  };

  const handleCloseModal = () => {
    setShowArtworkModal(false);
    setEditingArtwork(null);
  };

  const handleArtworkSuccess = async () => {
    await handleRefreshArtworks();
  };

  const handleDeleteArtwork = async (artwork: Artwork) => {
    if (!isOwner) return;

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir "${artwork.title}"? Esta ação não pode ser desfeita.`
    );

    if (confirmed) {
      try {
        await artworkService.delete(artwork.id, artwork.userId);
        await handleRefreshArtworks();
      } catch (err) {
        console.error("Error deleting artwork:", err);
        alert("Erro ao excluir obra. Tente novamente.");
      }
    }
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
  if (error || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-white via-brand-cream to-brand-beige dark:from-brand-black dark:via-brand-navy-900 dark:to-brand-navy-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <User className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-brand-black dark:text-brand-white mb-2">
            {error || "Perfil não encontrado"}
          </h1>
          <p className="text-brand-black/70 dark:text-brand-white/70 mb-6">
            O perfil que você está procurando não existe ou foi removido.
          </p>
          <SecondaryButton
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => router.push("/")}
          >
            Voltar ao Início
          </SecondaryButton>
        </motion.div>
      </div>
    );
  }

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
              Voltar ao Perfil
            </SecondaryButton>

            {isOwner && (
              <PrimaryButton onClick={handleAddArtwork} className="text-sm">
                Adicionar Obra
              </PrimaryButton>
            )}
          </div>

          {/* Profile header */}
          <div className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-brand-black/15 border border-white/[0.25] dark:border-brand-navy-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-6">
              {/* Profile Photo */}
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 dark:border-white/20 shadow-lg flex-shrink-0 relative">
                {profileData.photoURL ? (
                  <Image
                    src={profileData.photoURL}
                    alt="Profile"
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-navy-blue/10 to-brand-yellow/10 dark:from-brand-yellow/10 dark:to-brand-navy-blue/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-brand-navy-blue dark:text-brand-yellow">
                      {profileData.name?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-brand-black dark:text-brand-white">
                  Portfólio de {profileData.artisticName || profileData.name}
                </h1>
                <p className="text-brand-black/70 dark:text-brand-white/70">
                  @{profileData.username || "username"}
                </p>
                {profileData.bio && (
                  <div className="mt-2">
                    <motion.p 
                      className={`text-brand-black/80 dark:text-brand-white/80 ${
                        isBioExpanded ? '' : 'line-clamp-2'
                      }`}
                      initial={false}
                      animate={{ 
                        height: isBioExpanded ? 'auto' : 'auto'
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      {profileData.bio}
                    </motion.p>
                    {profileData.bio.length > 100 && (
                      <div className="flex justify-end mt-1">
                        <button
                          onClick={() => setIsBioExpanded(!isBioExpanded)}
                          className="text-sm text-brand-navy-blue dark:text-brand-yellow hover:text-brand-navy-blue/80 dark:hover:text-brand-yellow/80 transition-colors duration-200 font-medium"
                        >
                          {isBioExpanded ? 'Mostrar menos' : 'Mostrar mais'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Portfolio Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PortfolioGallery
            artworks={artworks}
            username={username}
            isOwner={isOwner || false}
            loading={artworksLoading}
            onAddArtwork={handleAddArtwork}
            onEditArtwork={handleEditArtwork}
            onDeleteArtwork={handleDeleteArtwork}
          />
        </motion.div>

        {/* Artwork Form Modal */}
        {profileData && (
          <ArtworkFormModal
            isOpen={showArtworkModal}
            onClose={handleCloseModal}
            onSuccess={handleArtworkSuccess}
            artwork={editingArtwork}
            userId={profileData.uid}
          />
        )}
      </div>
    </div>
  );
}
