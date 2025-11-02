"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  Edit3,
  Mail,
  Phone,
  MapPin,
  Globe,
  Instagram,
  Youtube,
  Tag,
} from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";

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

export default function ProfileExhibition() {
  const { user, userDocument, loading: authLoading } = useAuth();

  // Show loading state
  if (authLoading || !user) {
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

  const extendedUser = userDocument as unknown as ExtendedUserDocument;

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="pt-24 pb-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 text-brand-black dark:text-brand-white">
              Meu{" "}
              <span className="text-brand-navy-blue dark:text-brand-yellow">
                Perfil
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-brand-black/70 dark:text-brand-white/70 max-w-3xl mx-auto">
              Sua presença na comunidade artística da ArtEsfera
            </p>
          </div>
        </div>

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
                {extendedUser?.photoURL ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={extendedUser.photoURL}
                      alt="Profile"
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-navy-blue/10 to-brand-yellow/10 dark:from-brand-yellow/10 dark:to-brand-navy-blue/10 flex items-center justify-center">
                    <span className="text-3xl md:text-4xl font-bold text-brand-navy-blue dark:text-brand-yellow flex items-center justify-center w-full h-full">
                      {user.displayName?.[0]?.toUpperCase() ||
                        extendedUser?.name?.[0]?.toUpperCase() ||
                        "U"}
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
                    {extendedUser?.name || user.displayName || "Usuário"}
                  </h1>
                  {extendedUser?.artisticName && (
                    <p className="text-xl text-brand-navy-blue dark:text-brand-yellow font-medium">
                      @{extendedUser.artisticName}
                    </p>
                  )}
                </div>

                {/* Edit Button */}
                <div className="md:ml-auto">
                  <PrimaryButton
                    leftIcon={<Edit3 className="w-4 h-4" />}
                    onClick={() => (window.location.href = "/profile/edit")}
                  >
                    Editar Perfil
                  </PrimaryButton>
                </div>
              </div>

              {/* Bio */}
              {extendedUser?.bio && (
                <p className="text-brand-black/70 dark:text-brand-white/70 text-lg mb-6 leading-relaxed">
                  {extendedUser.bio}
                </p>
              )}

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {extendedUser?.email && (
                  <div className="flex items-center gap-3 text-brand-black/60 dark:text-brand-white/60">
                    <Mail className="w-5 h-5 text-brand-navy-blue dark:text-brand-yellow" />
                    <span>{extendedUser.email}</span>
                  </div>
                )}

                {extendedUser?.phone && (
                  <div className="flex items-center gap-3 text-brand-black/60 dark:text-brand-white/60">
                    <Phone className="w-5 h-5 text-brand-navy-blue dark:text-brand-yellow" />
                    <span>{extendedUser.phone}</span>
                  </div>
                )}

                {extendedUser?.location && (
                  <div className="flex items-center gap-3 text-brand-black/60 dark:text-brand-white/60">
                    <MapPin className="w-5 h-5 text-brand-navy-blue dark:text-brand-yellow" />
                    <span>{extendedUser.location}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {(extendedUser?.socials?.website ||
                extendedUser?.socials?.instagram ||
                extendedUser?.socials?.youtube) && (
                <div className="flex flex-wrap gap-4 mb-6">
                  {extendedUser.socials.website && (
                    <a
                      href={extendedUser.socials.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] text-brand-black/70 dark:text-brand-white/70 hover:text-brand-navy-blue dark:hover:text-brand-yellow transition-all duration-300 hover:backdrop-blur-xl hover:bg-white/20"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Website</span>
                    </a>
                  )}

                  {extendedUser.socials.instagram && (
                    <a
                      href={`https://instagram.com/${extendedUser.socials.instagram.replace(
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

                  {extendedUser.socials.youtube && (
                    <a
                      href={extendedUser.socials.youtube}
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
        {extendedUser?.tags && extendedUser.tags.length > 0 && (
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
              {extendedUser.tags.map((tag, index) => (
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

        {/* Empty State for incomplete profiles */}
        {(!extendedUser?.profileCompleted ||
          (!extendedUser?.bio && !extendedUser?.tags?.length)) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)] overflow-hidden text-center mt-6"
          >
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full" />
            <div className="absolute top-4 left-0 w-px h-[calc(100%-2rem)] bg-gradient-to-b from-white/40 via-transparent to-white/10 rounded-full" />

            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-navy-blue/10 dark:bg-brand-yellow/10 flex items-center justify-center">
              <Edit3 className="w-8 h-8 text-brand-navy-blue dark:text-brand-yellow" />
            </div>

            <h3 className="text-xl font-semibold text-brand-black dark:text-brand-white mb-2">
              Complete seu perfil
            </h3>
            <p className="text-brand-black/60 dark:text-brand-white/60 mb-6">
              Adicione uma bio, interesses e links sociais para que outros
              artistas possam conhecer melhor seu trabalho.
            </p>

            <PrimaryButton
              leftIcon={<Edit3 className="w-4 h-4" />}
              onClick={() => (window.location.href = "/profile/edit")}
            >
              Editar Perfil
            </PrimaryButton>
          </motion.div>
        )}
      </div>
    </div>
  );
}
