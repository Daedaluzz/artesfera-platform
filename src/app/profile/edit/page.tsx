"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Camera,
  Save,
  X,
  Mail,
  Globe,
  Instagram,
  Youtube,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getClientFirestore } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";

// Initialize Firebase services
const storage = getStorage();
const db = getClientFirestore();

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

interface FormData {
  name: string;
  email: string;
  phone: string;
  artisticName: string;
  bio: string;
  location: string;
  tags: string[];
  socials: {
    website: string;
    instagram: string;
    youtube: string;
  };
}

// Image compression utility
const compressImage = (
  file: File,
  maxWidth = 400,
  quality = 0.8
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = document.createElement("img");

    img.onload = () => {
      const { width, height } = img;
      const aspectRatio = width / height;

      let newWidth = maxWidth;
      let newHeight = maxWidth / aspectRatio;

      if (height > width) {
        newHeight = maxWidth;
        newWidth = maxWidth * aspectRatio;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, newWidth, newHeight);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to compress image"));
          }
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = URL.createObjectURL(file);
  });
};

export default function ProfileEdit() {
  const { user, userDocument, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State management
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");

  // Form data state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    artisticName: "",
    bio: "",
    location: "",
    tags: [],
    socials: {
      website: "",
      instagram: "",
      youtube: "",
    },
  });

  // Initialize form data when user document loads
  useEffect(() => {
    if (userDocument && user) {
      setFormData({
        name: userDocument.name || user.displayName || "",
        email: userDocument.email || user.email || "",
        phone: (userDocument as unknown as ExtendedUserDocument).phone || "",
        artisticName: userDocument.artisticName || "",
        bio: userDocument.bio || "",
        location: userDocument.location || "",
        tags: userDocument.tags || [],
        socials: {
          website:
            (userDocument as unknown as ExtendedUserDocument).socials
              ?.website || "",
          instagram:
            (userDocument as unknown as ExtendedUserDocument).socials
              ?.instagram || "",
          youtube:
            (userDocument as unknown as ExtendedUserDocument).socials
              ?.youtube || "",
        },
      });
    }
  }, [userDocument, user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("socials.")) {
      const socialField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socials: {
          ...prev.socials,
          [socialField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear messages when user starts typing
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploadingPhoto(true);
    setError(null);

    try {
      // Compress image
      const compressedImage = await compressImage(file);

      // Create storage reference
      const photoRef = ref(
        storage,
        `profile-photos/${user.uid}/${Date.now()}-${file.name}`
      );

      // Upload to Firebase Storage
      await uploadBytes(photoRef, compressedImage);
      const photoURL = await getDownloadURL(photoRef);

      // Update user document in Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        photoURL,
        updatedAt: serverTimestamp(),
      });

      // Update Firebase Auth profile
      await updateProfile(user, { photoURL });

      setSuccess("✅ Foto atualizada com sucesso!");
    } catch (error) {
      console.error("Error uploading photo:", error);
      setError("❌ Erro ao fazer upload da foto. Tente novamente.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    setError(null);

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        name: formData.name,
        artisticName: formData.artisticName,
        bio: formData.bio,
        location: formData.location,
        phone: formData.phone,
        tags: formData.tags,
        socials: formData.socials,
        profileCompleted: true,
        updatedAt: serverTimestamp(),
      });

      // Update Firebase Auth display name if changed
      if (formData.name !== user.displayName) {
        await updateProfile(user, { displayName: formData.name });
      }

      setSuccess("✅ Perfil atualizado com sucesso!");

      // Redirect back to profile after success
      setTimeout(() => {
        router.push("/profile");
      }, 2000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("❌ Erro ao salvar perfil. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

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

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-6"
        >
          <SecondaryButton
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={handleCancel}
          >
            Voltar
          </SecondaryButton>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-black dark:text-brand-white">
            Editar Perfil
          </h1>
        </motion.div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {(error || success) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <div
                className={`flex items-center gap-3 p-4 rounded-[16px] backdrop-blur-[15px] border ${
                  error
                    ? "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                    : "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
                }`}
              >
                {error ? (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span>{error || success}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[24px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)] overflow-hidden"
        >
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full" />
          <div className="absolute top-4 left-0 w-px h-[calc(100%-2rem)] bg-gradient-to-b from-white/40 via-transparent to-white/10 rounded-full" />

          {/* Photo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4 group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 dark:border-white/20 shadow-lg">
                {userDocument?.photoURL ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={userDocument.photoURL}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-navy-blue/10 to-brand-yellow/10 dark:from-brand-yellow/10 dark:to-brand-navy-blue/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-brand-navy-blue dark:text-brand-yellow flex items-center justify-center w-full h-full">
                      {user.displayName?.[0]?.toUpperCase() ||
                        formData.name?.[0]?.toUpperCase() ||
                        "U"}
                    </span>
                  </div>
                )}
              </div>

              {/* Remove Photo Button - positioned outside the circle */}
              {userDocument?.photoURL && (
                <button
                  onClick={async () => {
                    if (!user) return;
                    try {
                      const userRef = doc(db, "users", user.uid);
                      await updateDoc(userRef, {
                        photoURL: null,
                        updatedAt: serverTimestamp(),
                      });
                      await updateProfile(user, { photoURL: null });
                      setSuccess("✅ Foto removida com sucesso!");
                    } catch (error) {
                      console.error("Error removing photo:", error);
                      setError("❌ Erro ao remover foto. Tente novamente.");
                    }
                  }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 shadow-lg border-2 border-white/50"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Camera Button - positioned at bottom-right */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-navy-blue dark:bg-brand-yellow text-white dark:text-brand-black rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 disabled:opacity-50"
              >
                {isUploadingPhoto ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Camera className="w-5 h-5" />
                )}
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            <p className="text-sm text-brand-black/60 dark:text-brand-white/60 text-center">
              Clique na câmera para alterar sua foto de perfil
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8 p-1 rounded-[16px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-black/10 border border-white/[0.2] dark:border-white/[0.1]">
            {[
              {
                id: "personal",
                label: "Pessoal",
                icon: <Mail className="w-4 h-4" />,
              },
              {
                id: "social",
                label: "Redes Sociais",
                icon: <Globe className="w-4 h-4" />,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-[12px] text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-brand-navy-blue dark:bg-brand-yellow text-white dark:text-brand-black shadow-md"
                    : "text-brand-black/70 dark:text-brand-white/70 hover:text-brand-navy-blue dark:hover:text-brand-yellow"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            {activeTab === "personal" && (
              <>
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2">
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                {/* Artistic Name */}
                <div>
                  <label className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2">
                    Nome artístico
                  </label>
                  <input
                    type="text"
                    name="artisticName"
                    value={formData.artisticName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300"
                    placeholder="Como você é conhecido artisticamente"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2">
                    Localização
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300"
                    placeholder="São Paulo, SP"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2">
                    Biografia
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300 resize-none"
                    placeholder="Conte um pouco sobre você e sua arte..."
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2">
                    Interesses & Especialidades
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddTag())
                      }
                      className="flex-1 px-4 py-2 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300"
                      placeholder="Ex: Pintura, Música, Fotografia..."
                    />
                    <SecondaryButton
                      onClick={handleAddTag}
                      disabled={!newTag.trim()}
                    >
                      Adicionar
                    </SecondaryButton>
                  </div>

                  {/* Tags Display */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-[10px] bg-brand-navy-blue/10 dark:bg-brand-yellow/10 border border-brand-navy-blue/20 dark:border-brand-yellow/20 text-brand-navy-blue dark:text-brand-yellow text-sm"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="text-brand-navy-blue/70 dark:text-brand-yellow/70 hover:text-brand-navy-blue dark:hover:text-brand-yellow transition-colors duration-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === "social" && (
              <>
                {/* Website */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2">
                    <Globe className="w-4 h-4" />
                    Website
                  </label>
                  <input
                    type="url"
                    name="socials.website"
                    value={formData.socials.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300"
                    placeholder="https://meusite.com"
                  />
                </div>

                {/* Instagram */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2">
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </label>
                  <input
                    type="text"
                    name="socials.instagram"
                    value={formData.socials.instagram}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300"
                    placeholder="@meuinstagram"
                  />
                </div>

                {/* YouTube */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2">
                    <Youtube className="w-4 h-4" />
                    YouTube
                  </label>
                  <input
                    type="url"
                    name="socials.youtube"
                    value={formData.socials.youtube}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300"
                    placeholder="https://youtube.com/@meucanal"
                  />
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-white/10 dark:border-white/5">
            <SecondaryButton
              fullWidth
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancelar
            </SecondaryButton>

            <PrimaryButton
              fullWidth
              onClick={handleSave}
              disabled={isSaving || !formData.name.trim()}
              leftIcon={
                isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )
              }
            >
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </PrimaryButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
