"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  MapPin,
  Globe,
  Instagram,
  Youtube,
  Tag,
  ArrowLeft,
  Share2,
  ExternalLink,
  Edit3,
} from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { useParams, useRouter } from "next/navigation";

interface PublicUserProfile {
  uid: string;
  name: string;
  photoURL: string | null;
  artisticName?: string;
  username?: string;
  bio?: string;
  location?: string; // city and state
  tags?: string[]; // interests and specialties
  socials?: {
    website?: string;
    instagram?: string;
    youtube?: string;
  };
}

export default function UsernameProfilePage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const username = params?.username as string;

  const [profileData, setProfileData] = useState<PublicUserProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwnProfile = user && profileData && user.uid === profileData.uid;

  useEffect(() => {
    const fetchProfileByUsername = async () => {
      if (!username) return;

      try {
        setLoading(true);
        setError(null);

        // Handle both @username and username formats
        let cleanUsername = username;
        
        console.log("Original username param:", username);
        
        // First decode any URL encoding
        cleanUsername = decodeURIComponent(cleanUsername);
        console.log("After decoding:", cleanUsername);
        
        // Remove @ symbol if present
        if (cleanUsername.startsWith("@")) {
          cleanUsername = cleanUsername.substring(1);
        }
        
        console.log("Final clean username:", cleanUsername);

        // First try to get all documents to see what's in the collection
        console.log("Testing collection access...");
        const testQuery = query(collection(db, "publicProfiles"));
        try {
          const testSnapshot = await getDocs(testQuery);
          console.log("Collection access test:", testSnapshot.empty ? "Collection is empty" : `Collection has ${testSnapshot.docs.length} documents`);
          
          if (!testSnapshot.empty) {
            console.log("Sample document usernames:", testSnapshot.docs.map(doc => doc.data().username));
          }
        } catch (testError) {
          console.error("Collection access test failed:", testError);
        }

        // Query publicProfiles collection by username
        const profilesQuery = query(
          collection(db, "publicProfiles"),
          where("username", "==", cleanUsername.toLowerCase())
        );
        console.log("Querying for username:", cleanUsername.toLowerCase());
        const profilesSnapshot = await getDocs(profilesQuery);

        console.log("Query result:", profilesSnapshot.empty ? "No documents found" : `Found ${profilesSnapshot.docs.length} documents`);

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

  const handleShare = async () => {
    if (!profileData) return;

    const shareUrl = `${window.location.origin}/${profileData.username}`;
    const shareText = `Confira o perfil de @${profileData.name} na ArtEsfera!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Perfil de ${profileData.name} - ArtEsfera`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Error sharing:", err);
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl);
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareUrl);
      // You could show a toast notification here
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <ArrowLeft className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-brand-black dark:text-brand-white mb-2">
            {error}
          </h3>
          <p className="text-brand-black/60 dark:text-brand-white/60 mb-6">
            O username @{username} não foi encontrado.
          </p>
          <PrimaryButton onClick={() => router.push("/")}>
            Voltar ao Início
          </PrimaryButton>
        </motion.div>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button for viewing other profiles */}
        {!isOwnProfile && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-brand-black/60 dark:text-brand-white/60 hover:text-brand-navy-blue dark:hover:text-brand-yellow transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
          </motion.div>
        )}

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[24px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)] overflow-hidden mb-6"
        >
          {/* Glassmorphic border effects */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full" />
          <div className="absolute top-4 left-0 w-px h-[calc(100%-2rem)] bg-gradient-to-b from-white/40 via-transparent to-white/10 rounded-full" />

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Photo */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/30 dark:border-white/20 shadow-lg">
                {profileData?.photoURL ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={profileData.photoURL}
                      alt="Profile"
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-navy-blue/10 to-brand-yellow/10 dark:from-brand-yellow/10 dark:to-brand-navy-blue/10 flex items-center justify-center">
                    <span className="text-3xl md:text-4xl font-bold text-brand-navy-blue dark:text-brand-yellow flex items-center justify-center w-full h-full">
                      {profileData?.name?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-brand-black dark:text-brand-white mb-2">
                    {profileData?.name || "Usuário"}
                  </h1>
                  {profileData?.username && (
                    <p className="text-lg text-brand-navy-blue dark:text-brand-yellow font-medium">
                      @{profileData.username}
                    </p>
                  )}
                  {profileData?.artisticName && (
                    <p className="text-base text-brand-black/70 dark:text-brand-white/70 font-medium">
                      {profileData.artisticName}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="md:ml-auto flex gap-3">
                  <SecondaryButton
                    leftIcon={<Share2 className="w-4 h-4" />}
                    onClick={handleShare}
                  >
                    Compartilhar
                  </SecondaryButton>

                  {isOwnProfile && (
                    <PrimaryButton
                      leftIcon={<ExternalLink className="w-4 h-4" />}
                      onClick={() => router.push("/profile/edit")}
                    >
                      Editar Perfil
                    </PrimaryButton>
                  )}
                </div>
              </div>

              {/* Bio */}
              {profileData?.bio && (
                <p className="text-brand-black/70 dark:text-brand-white/70 text-lg mb-6 leading-relaxed">
                  {profileData.bio}
                </p>
              )}

              {/* Location - Show for public profiles */}
              {profileData?.location && (
                <div className="mb-6">
                  <div className="flex items-center gap-3 text-brand-black/60 dark:text-brand-white/60">
                    <MapPin className="w-5 h-5 text-brand-navy-blue dark:text-brand-yellow" />
                    <span>{profileData.location}</span>
                  </div>
                </div>
              )}

              {/* Social Links */}
              {(profileData?.socials?.website ||
                profileData?.socials?.instagram ||
                profileData?.socials?.youtube) && (
                <div className="flex flex-wrap gap-4 mb-6">
                  {profileData.socials.website && (
                    <a
                      href={profileData.socials.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] text-brand-black/70 dark:text-brand-white/70 hover:text-brand-navy-blue dark:hover:text-brand-yellow transition-all duration-300 hover:backdrop-blur-xl hover:bg-white/20"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Website</span>
                    </a>
                  )}

                  {profileData.socials.instagram && (
                    <a
                      href={`https://instagram.com/${profileData.socials.instagram.replace(
                        "@",
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] text-brand-black/70 dark:text-brand-white/70 hover:text-brand-navy-blue dark:hover:text-brand-yellow transition-all duration-300 hover:backdrop-blur-xl hover:bg-white/20"
                    >
                      <Instagram className="w-4 h-4" />
                      <span>Instagram</span>
                    </a>
                  )}

                  {profileData.socials.youtube && (
                    <a
                      href={profileData.socials.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] text-brand-black/70 dark:text-brand-white/70 hover:text-brand-navy-blue dark:hover:text-brand-yellow transition-all duration-300 hover:backdrop-blur-xl hover:bg-white/20"
                    >
                      <Youtube className="w-4 h-4" />
                      <span>YouTube</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Profile Actions for Own Profile */}
        {isOwnProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)] overflow-hidden mb-6"
          >
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full" />
            <div className="absolute top-4 left-0 w-px h-[calc(100%-2rem)] bg-gradient-to-b from-white/40 via-transparent to-white/10 rounded-full" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full backdrop-blur-[10px] bg-brand-navy-blue/10 dark:bg-brand-yellow/10 border border-brand-navy-blue/20 dark:border-brand-yellow/20">
                  <Edit3 className="w-5 h-5 text-brand-navy-blue dark:text-brand-yellow" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white">
                    Gerenciar Perfil
                  </h3>
                  <p className="text-brand-black/60 dark:text-brand-white/60 text-sm">
                    Edite suas informações pessoais e configurações
                  </p>
                </div>
              </div>

              <PrimaryButton onClick={() => router.push("/profile/edit")}>
                <Edit3 className="w-4 h-4 mr-2" />
                Editar Perfil
              </PrimaryButton>
            </div>
          </motion.div>
        )}

        {/* Share Profile for All Users */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)] overflow-hidden mb-6"
          >
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full" />
            <div className="absolute top-4 left-0 w-px h-[calc(100%-2rem)] bg-gradient-to-b from-white/40 via-transparent to-white/10 rounded-full" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full backdrop-blur-[10px] bg-brand-navy-blue/10 dark:bg-brand-yellow/10 border border-brand-navy-blue/20 dark:border-brand-yellow/20">
                  <Share2 className="w-5 h-5 text-brand-navy-blue dark:text-brand-yellow" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white">
                    Compartilhar Perfil
                  </h3>
                  <p className="text-brand-black/60 dark:text-brand-white/60 text-sm">
                    Compartilhe este perfil com outras pessoas
                  </p>
                </div>
              </div>

              <SecondaryButton onClick={() => handleShare()}>
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </SecondaryButton>
            </div>
          </motion.div>
        )}

        {/* Tags Section */}
        {profileData?.tags && profileData.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)] overflow-hidden"
          >
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full" />
            <div className="absolute top-4 left-0 w-px h-[calc(100%-2rem)] bg-gradient-to-b from-white/40 via-transparent to-white/10 rounded-full" />

            <div className="flex items-center gap-3 mb-4">
              <Tag className="w-5 h-5 text-brand-navy-blue dark:text-brand-yellow" />
              <h2 className="text-xl font-semibold text-brand-black dark:text-brand-white">
                Interesses & Especialidades
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {profileData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full backdrop-blur-[10px] bg-brand-navy-blue/10 dark:bg-brand-yellow/10 border border-brand-navy-blue/20 dark:border-brand-yellow/20 text-brand-navy-blue dark:text-brand-yellow text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Call to Action for non-authenticated users */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)] overflow-hidden text-center mt-6"
          >
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full" />
            <div className="absolute top-4 left-0 w-px h-[calc(100%-2rem)] bg-gradient-to-b from-white/40 via-transparent to-white/10 rounded-full" />

            <h3 className="text-xl font-semibold text-brand-black dark:text-brand-white mb-2">
              Junte-se à ArtEsfera
            </h3>
            <p className="text-brand-black/60 dark:text-brand-white/60 mb-6">
              Crie seu perfil e conecte-se com uma comunidade vibrante de
              artistas e criadores.
            </p>

            <div className="flex gap-3 justify-center">
              <PrimaryButton onClick={() => router.push("/register")}>
                Criar Conta
              </PrimaryButton>
              <SecondaryButton onClick={() => router.push("/login")}>
                Entrar
              </SecondaryButton>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
