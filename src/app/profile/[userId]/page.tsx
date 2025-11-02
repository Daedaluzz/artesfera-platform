"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Instagram,
  Youtube,
  Tag,
  ArrowLeft,
} from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { useParams, useRouter } from "next/navigation";

interface PublicUserProfile {
  uid: string;
  name: string;
  photoURL: string | null;
  artisticName?: string;
  bio?: string;
  location?: string; // city and state
  tags?: string[]; // interests and specialties
  socials?: {
    website?: string;
    instagram?: string;
    youtube?: string;
  };
}

interface ExtendedUserDocument {
  uid: string;
  name: string;
  email: string;
  photoURL: string | null;
  createdAt: Date | string | undefined;
  tags: string[];
  bio: string;
  artisticName: string;
  location: string;
  profileCompleted: boolean;
  phone?: string;
  socials?: {
    website?: string;
    instagram?: string;
    youtube?: string;
  };
}

export default function UserProfilePage() {
  const { user, userDocument, loading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const userId = params?.userId as string;
  
  const [profileData, setProfileData] = useState<PublicUserProfile | ExtendedUserDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwnProfile = user?.uid === userId;

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId || authLoading) return;

      try {
        setLoading(true);
        setError(null);

        if (isOwnProfile && userDocument) {
          // Use private data for own profile
          setProfileData(userDocument as unknown as ExtendedUserDocument);
        } else {
          // Fetch public profile data for other users
          const publicProfileRef = doc(db, "publicProfiles", userId);
          const publicProfileSnap = await getDoc(publicProfileRef);

          if (publicProfileSnap.exists()) {
            setProfileData(publicProfileSnap.data() as PublicUserProfile);
          } else {
            // Fallback: try to get basic info from main user document (if accessible)
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              const userData = userSnap.data();
              // Extract only public fields
              const publicData: PublicUserProfile = {
                uid: userData.uid,
                name: userData.name,
                photoURL: userData.photoURL,
                artisticName: userData.artisticName,
                bio: userData.bio,
                location: userData.location,
                tags: userData.tags,
                socials: userData.socials,
              };
              setProfileData(publicData);
            } else {
              setError("Perfil não encontrado");
            }
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Erro ao carregar perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, authLoading, isOwnProfile, userDocument]);

  // Show loading state
  if (authLoading || loading) {
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
          <PrimaryButton onClick={() => router.back()}>
            Voltar
          </PrimaryButton>
        </motion.div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Profile not found</div>
      </div>
    );
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
                  {profileData?.artisticName && (
                    <p className="text-xl text-brand-navy-blue dark:text-brand-yellow font-medium">
                      @{profileData.artisticName}
                    </p>
                  )}
                </div>

                {/* Edit Button - only show for own profile */}
                {isOwnProfile && (
                  <div className="md:ml-auto">
                    <PrimaryButton
                      onClick={() => (window.location.href = "/profile/edit")}
                    >
                      Editar Perfil
                    </PrimaryButton>
                  </div>
                )}
              </div>

              {/* Bio */}
              {profileData?.bio && (
                <p className="text-brand-black/70 dark:text-brand-white/70 text-lg mb-6 leading-relaxed">
                  {profileData.bio}
                </p>
              )}

              {/* Contact Info - Only show for own profile */}
              {isOwnProfile && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {(profileData as ExtendedUserDocument)?.email && (
                    <div className="flex items-center gap-3 text-brand-black/60 dark:text-brand-white/60">
                      <Mail className="w-5 h-5 text-brand-navy-blue dark:text-brand-yellow" />
                      <span>{(profileData as ExtendedUserDocument).email}</span>
                    </div>
                  )}

                  {(profileData as ExtendedUserDocument)?.phone && (
                    <div className="flex items-center gap-3 text-brand-black/60 dark:text-brand-white/60">
                      <Phone className="w-5 h-5 text-brand-navy-blue dark:text-brand-yellow" />
                      <span>{(profileData as ExtendedUserDocument).phone}</span>
                    </div>
                  )}

                  {profileData?.location && (
                    <div className="flex items-center gap-3 text-brand-black/60 dark:text-brand-white/60">
                      <MapPin className="w-5 h-5 text-brand-navy-blue dark:text-brand-yellow" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Location - Show for public profiles */}
              {!isOwnProfile && profileData?.location && (
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
      </div>
    </div>
  );
}