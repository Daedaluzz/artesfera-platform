"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Camera,
  Edit3,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  Globe,
  Instagram,
  Youtube,
  AlertCircle,
  CheckCircle,
  Loader2,
  Share2,
  ExternalLink,
  Palette,
  Briefcase,
  Calendar,
  Clock,
  Badge as BadgeIcon,
} from "lucide-react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getClientFirestore } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import { autoSyncProfile } from "@/services/profileSyncService";
import {
  getUserProjects,
  getUserApplications,
  generateProjectSlug,
  formatPayment,
  type Project,
  type ProjectApplication,
} from "@/lib/firestoreProjects";
import { Badge } from "@/components/ui/badge";

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
  username?: string;
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
  username: string;
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
    const img = new HTMLImageElement();

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

      if (ctx) {
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Could not compress image"));
            }
          },
          "image/jpeg",
          quality
        );
      } else {
        reject(new Error("Could not get canvas context"));
      }
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

export default function Profile() {
  const { user, userDocument, loading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State management
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<
    { project: Project; application: ProjectApplication }[]
  >([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  // Form data state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    artisticName: "",
    username: "",
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
        username:
          (userDocument as unknown as ExtendedUserDocument).username || "",
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

  // Load user projects and applications
  useEffect(() => {
    const loadProjectsData = async () => {
      if (!user?.uid) return;

      setProjectsLoading(true);
      try {
        const [userProjects, userApplications] = await Promise.all([
          getUserProjects(user.uid),
          getUserApplications(user.uid),
        ]);

        setProjects(userProjects);
        setApplications(userApplications);
      } catch (error) {
        console.error("Error loading projects data:", error);
        setError("Erro ao carregar dados dos projetos");
      } finally {
        setProjectsLoading(false);
      }
    };

    loadProjectsData();
  }, [user?.uid]);

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

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(newTag.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag.trim()],
        }));
      }
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

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecione um arquivo de imagem válido.");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("A imagem deve ter menos de 5MB.");
      return;
    }

    setIsUploadingPhoto(true);
    setError(null);

    try {
      // Compress image
      const compressedBlob = await compressImage(file);

      // Create unique filename
      const filename = `profile_${Date.now()}.jpg`;
      const storageRef = ref(storage, `profile-photos/${user.uid}/${filename}`);

      // Upload to Firebase Storage
      await uploadBytes(storageRef, compressedBlob);
      const downloadURL = await getDownloadURL(storageRef);

      // Update user profile
      if (user) {
        await updateProfile(user, {
          photoURL: downloadURL,
        });
      }

      // Update Firestore document
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        photoURL: downloadURL,
        updatedAt: serverTimestamp(),
      });

      // Trigger public profile sync
      await autoSyncProfile(
        {
          uid: user.uid,
          name: formData.name,
          email: user.email || "",
          photoURL: downloadURL,
          bio: formData.bio,
          tags: formData.tags,
          website: formData.socials?.website,
          location: formData.location,
          username: formData.username,
          artisticName: formData.artisticName,
          profileCompleted: true,
        },
        user
      );

      setSuccess("✅ Foto do perfil atualizada com sucesso!");
    } catch (error) {
      console.error("Error uploading photo:", error);
      setError("Erro ao fazer upload da foto. Tente novamente.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    if (!user || !userDocument) return;

    setIsSaving(true);
    setError(null);

    try {
      const userDocRef = doc(db, "users", user.uid);

      await updateDoc(userDocRef, {
        name: formData.name,
        artisticName: formData.artisticName,
        bio: formData.bio,
        location: formData.location,
        tags: formData.tags,
        phone: formData.phone,
        socials: formData.socials,
        updatedAt: serverTimestamp(),
      });

      // Update Auth profile if name changed
      if (formData.name !== user.displayName) {
        await updateProfile(user, {
          displayName: formData.name,
        });
      }

      // Trigger public profile sync
      await autoSyncProfile(
        {
          uid: user.uid,
          name: formData.name,
          email: user.email || "",
          photoURL: user.photoURL || undefined,
          bio: formData.bio,
          tags: formData.tags,
          website: formData.socials?.website,
          location: formData.location,
          username: formData.username,
          artisticName: formData.artisticName,
          profileCompleted: true,
        },
        user
      );

      setSuccess("✅ Perfil atualizado com sucesso!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Erro ao salvar alterações. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (userDocument && user) {
      setFormData({
        name: userDocument.name || user.displayName || "",
        email: userDocument.email || user.email || "",
        phone: (userDocument as unknown as ExtendedUserDocument).phone || "",
        artisticName: userDocument.artisticName || "",
        username:
          (userDocument as unknown as ExtendedUserDocument).username || "",
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
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  // Show loading state while auth is loading
  if (authLoading) {
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

  // Show error if user is not authenticated
  if (!user || !userDocument) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brand-black dark:text-brand-white mb-4">
            Acesso Negado
          </h1>
          <p className="text-brand-black/70 dark:text-brand-white/70">
            Você precisa estar logado para acessar seu perfil.
          </p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-white via-brand-white/90 to-brand-white/80 dark:from-brand-black dark:via-brand-black/90 dark:to-brand-black/80">
      {/* Header Section */}
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 text-brand-black dark:text-brand-white">
              Meu
              <span className="text-brand-navy-blue dark:text-brand-yellow">
                Perfil
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-brand-black/70 dark:text-brand-white/70 max-w-3xl mx-auto">
              Gerencie suas informações e configure sua experiência na ArtEsfera
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)] overflow-hidden sticky top-24">
              {/* Glassmorphic decorative elements */}
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full" />
              <div className="absolute top-4 left-0 w-px h-[calc(100%-2rem)] bg-gradient-to-b from-white/40 via-transparent to-white/10 rounded-full" />

              {/* Profile Picture */}
              <div className="text-center mb-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="rounded-full object-cover border-2 border-white/30 dark:border-white/20"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-brand-navy-blue to-brand-navy-blue/80 dark:from-brand-yellow dark:to-brand-yellow/80 flex items-center justify-center text-white dark:text-brand-black text-2xl font-bold border-2 border-white/30 dark:border-white/20">
                      {getInitials(formData.name || user.displayName || "User")}
                    </div>
                  )}

                  {/* Photo upload button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className="absolute -bottom-1 -right-1 p-2 rounded-full backdrop-blur-[10px] bg-white/[0.2] dark:bg-black/20 border border-white/30 dark:border-white/20 hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300 disabled:opacity-50"
                  >
                    {isUploadingPhoto ? (
                      <Loader2 className="w-4 h-4 animate-spin text-brand-navy-blue dark:text-brand-yellow" />
                    ) : (
                      <Camera className="w-4 h-4 text-brand-navy-blue dark:text-brand-yellow" />
                    )}
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>

                <h2 className="text-xl font-bold text-brand-black dark:text-brand-white">
                  {formData.name || user.displayName || "Usuário"}
                </h2>
                {formData.username && (
                  <p className="text-sm text-brand-navy-blue dark:text-brand-yellow font-medium">
                    @{formData.username}
                  </p>
                )}
                <p className="text-brand-black/70 dark:text-brand-white/70">
                  {formData.artisticName || "Artista"}
                </p>

                {/* Share Profile Button */}
                {formData.username && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={`/${formData.username}/portfolio`}
                      className="flex items-center gap-1 px-3 py-1 rounded-[8px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] text-xs text-brand-black/70 dark:text-brand-white/70 hover:text-brand-navy-blue dark:hover:text-brand-yellow transition-all duration-300 hover:backdrop-blur-xl hover:bg-white/20"
                    >
                      <Palette className="w-3 h-3" />
                      <span>Meu Portfólio</span>
                    </a>
                    <button
                      onClick={() => {
                        const shareUrl = `${window.location.origin}/@${formData.username}`;
                        if (navigator.share) {
                          navigator
                            .share({
                              title: `Perfil de ${formData.name} - ArtEsfera`,
                              text: `Confira o perfil de ${formData.name} na ArtEsfera!`,
                              url: shareUrl,
                            })
                            .catch(() => {
                              navigator.clipboard.writeText(shareUrl);
                            });
                        } else {
                          navigator.clipboard.writeText(shareUrl);
                        }
                      }}
                      className="flex items-center gap-1 px-3 py-1 rounded-[8px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] text-xs text-brand-black/70 dark:text-brand-white/70 hover:text-brand-navy-blue dark:hover:text-brand-yellow transition-all duration-300 hover:backdrop-blur-xl hover:bg-white/20"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>Compartilhar</span>
                    </button>
                    <a
                      href={`/@${formData.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1 rounded-[8px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] text-xs text-brand-black/70 dark:text-brand-white/70 hover:text-brand-navy-blue dark:hover:text-brand-yellow transition-all duration-300 hover:backdrop-blur-xl hover:bg-white/20"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Ver perfil público</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Portfolio Quick Access */}
              {formData.username && (
                <div className="mt-4 p-4 rounded-[12px] backdrop-blur-[10px] bg-gradient-to-br from-white/[0.15] to-white/[0.05] dark:from-white/[0.1] dark:to-white/[0.02] border border-white/[0.2] dark:border-white/[0.1]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-[8px] bg-gradient-to-br from-brand-navy-blue/10 to-brand-navy-blue/5 dark:from-brand-yellow/10 dark:to-brand-yellow/5">
                      <Palette className="w-4 h-4 text-brand-navy-blue dark:text-brand-yellow" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-brand-black dark:text-brand-white">
                        Meu Portfólio
                      </h3>
                      <p className="text-xs text-brand-black/60 dark:text-brand-white/60">
                        Gerencie suas obras de arte
                      </p>
                    </div>
                  </div>
                  <a
                    href={`/${formData.username}/portfolio`}
                    className="block w-full px-3 py-2 rounded-[8px] text-center text-sm font-medium bg-gradient-to-r from-brand-navy-blue/20 to-brand-navy-blue/10 dark:from-brand-yellow/20 dark:to-brand-yellow/10 text-brand-navy-blue dark:text-brand-yellow hover:from-brand-navy-blue/30 hover:to-brand-navy-blue/20 dark:hover:from-brand-yellow/30 dark:hover:to-brand-yellow/20 transition-all duration-300"
                  >
                    Acessar Portfólio
                  </a>
                </div>
              )}

              {/* Navigation */}
              <nav className="space-y-2">
                {[
                  { id: "personal", name: "Informações Pessoais", icon: User },
                  {
                    id: "portfolio",
                    name: "Portfolio",
                    icon: Palette,
                    href: formData.username
                      ? `/${formData.username}/portfolio`
                      : undefined,
                  },
                  {
                    id: "preferences",
                    name: "Preferências",
                    icon: Globe,
                    comingSoon: true,
                  },
                  {
                    id: "notifications",
                    name: "Notificações",
                    icon: Globe,
                    comingSoon: true,
                  },
                  {
                    id: "privacy",
                    name: "Privacidade",
                    icon: Globe,
                    comingSoon: true,
                  },
                  {
                    id: "settings",
                    name: "Configurações",
                    icon: Globe,
                    comingSoon: true,
                  },
                ].map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => !item.comingSoon && setActiveTab(item.id)}
                      disabled={item.comingSoon}
                      className={`w-full text-left px-4 py-3 rounded-[12px] transition-all duration-300 flex items-center gap-3 ${
                        activeTab === item.id
                          ? "bg-gradient-to-r from-brand-navy-blue/20 to-brand-navy-blue/10 dark:from-brand-yellow/20 dark:to-brand-yellow/10 text-brand-navy-blue dark:text-brand-yellow border border-brand-navy-blue/20 dark:border-brand-yellow/20"
                          : item.comingSoon
                          ? "text-brand-black/40 dark:text-brand-white/40 cursor-not-allowed"
                          : "text-brand-black/70 dark:text-brand-white/70 hover:bg-white/10 dark:hover:bg-black/20"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="flex-1">{item.name}</span>
                      {item.comingSoon && (
                        <span className="text-xs px-2 py-1 rounded-full bg-brand-navy-blue/10 dark:bg-brand-yellow/10 text-brand-navy-blue/60 dark:text-brand-yellow/60">
                          Em breve
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Success/Error Messages */}
            <AnimatePresence>
              {(error || success) && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-6"
                >
                  <div
                    className={`flex items-center gap-3 p-4 rounded-[16px] backdrop-blur-[10px] border ${
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
                    <span className="text-sm font-medium">
                      {error || success}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)] overflow-hidden">
              {/* Glassmorphic decorative elements */}
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full" />
              <div className="absolute top-4 left-0 w-px h-[calc(100%-2rem)] bg-gradient-to-b from-white/40 via-transparent to-white/10 rounded-full" />

              {/* Header with edit button */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-brand-black dark:text-brand-white">
                  Informações Pessoais
                </h2>

                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] text-brand-navy-blue dark:text-brand-yellow hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="text-sm font-medium">Editar</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] text-brand-black/70 dark:text-brand-white/70 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300"
                    >
                      <X className="w-4 h-4" />
                      <span className="text-sm font-medium">Cancelar</span>
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 rounded-[12px] backdrop-blur-[10px] bg-brand-navy-blue/20 dark:bg-brand-yellow/20 border border-brand-navy-blue/30 dark:border-brand-yellow/30 text-brand-navy-blue dark:text-brand-yellow hover:bg-brand-navy-blue/30 dark:hover:bg-brand-yellow/30 transition-all duration-300 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">
                        {isSaving ? "Salvando..." : "Salvar"}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Form Content */}
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2"
                    >
                      <User className="w-4 h-4 inline mr-2" />
                      Nome completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="artisticName"
                      className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2"
                    >
                      Nome artístico
                    </label>
                    <input
                      type="text"
                      id="artisticName"
                      name="artisticName"
                      value={formData.artisticName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      placeholder="Como você é conhecido artisticamente"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2"
                  >
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={true} // Email should not be editable
                    className="w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300 opacity-60 cursor-not-allowed"
                    placeholder="seu@email.com"
                  />
                  <p className="text-xs text-brand-black/50 dark:text-brand-white/50 mt-1">
                    O email não pode ser alterado por questões de segurança
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2"
                    >
                      <Phone className="w-4 h-4 inline mr-2" />
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      placeholder="+55 (11) 99999-9999"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2"
                    >
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Localização
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      placeholder="Cidade, Estado"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2"
                  >
                    Biografia
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed resize-none"
                    placeholder="Conte um pouco sobre você e sua arte..."
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2">
                    Especialidades/Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-brand-navy-blue/20 dark:bg-brand-yellow/20 text-brand-navy-blue dark:text-brand-yellow border border-brand-navy-blue/30 dark:border-brand-yellow/30"
                      >
                        {tag}
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:text-red-500 transition-colors"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {isEditing && (
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Digite uma especialidade e pressione Enter"
                      className="w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300"
                    />
                  )}
                </div>

                {/* Social Links */}
                <div className="border-t border-white/20 dark:border-white/10 pt-6">
                  <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white mb-4">
                    Redes Sociais
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="socials.website"
                        className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2"
                      >
                        <Globe className="w-4 h-4 inline mr-2" />
                        Website
                      </label>
                      <input
                        type="url"
                        id="socials.website"
                        name="socials.website"
                        value={formData.socials.website}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                        placeholder="https://seusite.com"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="socials.instagram"
                          className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2"
                        >
                          <Instagram className="w-4 h-4 inline mr-2" />
                          Instagram
                        </label>
                        <input
                          type="text"
                          id="socials.instagram"
                          name="socials.instagram"
                          value={formData.socials.instagram}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                          placeholder="@seuperfil"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="socials.youtube"
                          className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2"
                        >
                          <Youtube className="w-4 h-4 inline mr-2" />
                          YouTube
                        </label>
                        <input
                          type="text"
                          id="socials.youtube"
                          name="socials.youtube"
                          value={formData.socials.youtube}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                          placeholder="Seu canal"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  label: "Projetos Criados",
                  value: projects.length.toString(),
                  icon: "🎨",
                },
                {
                  label: "Candidaturas",
                  value: applications.length.toString(),
                  icon: "📝",
                },
                {
                  label: "Ativos",
                  value: projects
                    .filter((p) => p.status === "open")
                    .length.toString(),
                  icon: "✅",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[16px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)] text-center"
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-brand-black dark:text-brand-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-brand-black/70 dark:text-brand-white/70">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Projects Section */}
            <div className="mt-12">
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="w-6 h-6 text-brand-navy-blue dark:text-brand-yellow" />
                <h2 className="text-2xl font-bold text-brand-black dark:text-brand-white">
                  Projetos
                </h2>
              </div>

              {projectsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-navy-blue dark:text-brand-yellow" />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Created Projects */}
                  <div>
                    <h3 className="text-xl font-semibold text-brand-black dark:text-brand-white mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Projetos Criados ({projects.length})
                    </h3>

                    {projects.length === 0 ? (
                      <div className="backdrop-blur-[15px] bg-white/[0.1] dark:bg-black/10 border border-white/[0.2] dark:border-white/10 rounded-[16px] p-8 text-center">
                        <Briefcase className="w-12 h-12 text-brand-black/50 dark:text-brand-white/50 mx-auto mb-4" />
                        <p className="text-brand-black/70 dark:text-brand-white/70">
                          Nenhum projeto criado ainda
                        </p>
                        <Link href="/projects/create">
                          <button className="mt-4 px-4 py-2 rounded-lg bg-brand-navy-blue/20 dark:bg-brand-yellow/20 text-brand-navy-blue dark:text-brand-yellow hover:bg-brand-navy-blue/30 dark:hover:bg-brand-yellow/30 transition-colors">
                            Criar Primeiro Projeto
                          </button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {projects.slice(0, 3).map((project) => (
                          <Link
                            key={project.id}
                            href={`/projects/${generateProjectSlug(
                              project.title,
                              project.id
                            )}`}
                          >
                            <div className="backdrop-blur-[15px] bg-white/[0.1] dark:bg-black/10 border border-white/[0.2] dark:border-white/10 rounded-[16px] p-6 hover:border-white/[0.3] dark:hover:border-white/20 transition-all duration-300 hover:backdrop-blur-xl hover:bg-white/[0.15] dark:hover:bg-black/15 group">
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="font-semibold text-brand-black dark:text-brand-white group-hover:text-brand-navy-blue dark:group-hover:text-brand-yellow transition-colors line-clamp-2">
                                  {project.title}
                                </h4>
                                <Badge
                                  variant={
                                    project.status === "open"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {project.status === "open"
                                    ? "Aberto"
                                    : "Fechado"}
                                </Badge>
                              </div>

                              <p className="text-sm text-brand-black/70 dark:text-brand-white/70 line-clamp-2 mb-3">
                                {project.description}
                              </p>

                              <div className="flex items-center gap-4 text-xs text-brand-black/60 dark:text-brand-white/60">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {project.city}, {project.state}
                                </span>
                                <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                  <Clock className="w-3 h-3" />
                                  {formatPayment(project.payment)}
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}

                        {projects.length > 3 && (
                          <Link href="/projects?filter=my-projects">
                            <div className="text-center py-4">
                              <span className="text-brand-navy-blue dark:text-brand-yellow hover:underline">
                                Ver todos os {projects.length} projetos →
                              </span>
                            </div>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Applied Projects */}
                  <div>
                    <h3 className="text-xl font-semibold text-brand-black dark:text-brand-white mb-4 flex items-center gap-2">
                      <BadgeIcon className="w-5 h-5" />
                      Candidaturas ({applications.length})
                    </h3>

                    {applications.length === 0 ? (
                      <div className="backdrop-blur-[15px] bg-white/[0.1] dark:bg-black/10 border border-white/[0.2] dark:border-white/10 rounded-[16px] p-8 text-center">
                        <BadgeIcon className="w-12 h-12 text-brand-black/50 dark:text-brand-white/50 mx-auto mb-4" />
                        <p className="text-brand-black/70 dark:text-brand-white/70">
                          Nenhuma candidatura enviada ainda
                        </p>
                        <Link href="/projects">
                          <button className="mt-4 px-4 py-2 rounded-lg bg-brand-navy-blue/20 dark:bg-brand-yellow/20 text-brand-navy-blue dark:text-brand-yellow hover:bg-brand-navy-blue/30 dark:hover:bg-brand-yellow/30 transition-colors">
                            Explorar Projetos
                          </button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {applications
                          .slice(0, 3)
                          .map(({ project, application }) => (
                            <Link
                              key={application.id}
                              href={`/projects/${generateProjectSlug(
                                project.title,
                                project.id
                              )}`}
                            >
                              <div className="backdrop-blur-[15px] bg-white/[0.1] dark:bg-black/10 border border-white/[0.2] dark:border-white/10 rounded-[16px] p-6 hover:border-white/[0.3] dark:hover:border-white/20 transition-all duration-300 hover:backdrop-blur-xl hover:bg-white/[0.15] dark:hover:bg-black/15 group">
                                <div className="flex justify-between items-start mb-3">
                                  <h4 className="font-semibold text-brand-black dark:text-brand-white group-hover:text-brand-navy-blue dark:group-hover:text-brand-yellow transition-colors line-clamp-2">
                                    {project.title}
                                  </h4>
                                  <Badge
                                    variant={
                                      application.status === "accepted"
                                        ? "default"
                                        : application.status === "rejected"
                                        ? "destructive"
                                        : "secondary"
                                    }
                                  >
                                    {application.status === "applied"
                                      ? "Pendente"
                                      : application.status === "accepted"
                                      ? "Aceita"
                                      : application.status === "rejected"
                                      ? "Rejeitada"
                                      : "Retirada"}
                                  </Badge>
                                </div>

                                <p className="text-sm text-brand-black/70 dark:text-brand-white/70 line-clamp-2 mb-3">
                                  {project.description}
                                </p>

                                <div className="flex items-center gap-4 text-xs text-brand-black/60 dark:text-brand-white/60">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Candidatura:
                                    {application.createdAt instanceof Date
                                      ? application.createdAt.toLocaleDateString(
                                          "pt-BR"
                                        )
                                      : (
                                          application.createdAt as {
                                            toDate?: () => Date;
                                          }
                                        )
                                          ?.toDate?.()
                                          ?.toLocaleDateString("pt-BR") ||
                                        "Data não disponível"}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          ))}

                        {applications.length > 3 && (
                          <Link href="/projects?filter=my-applications">
                            <div className="text-center py-4">
                              <span className="text-brand-navy-blue dark:text-brand-yellow hover:underline">
                                Ver todas as {applications.length} candidaturas
                                →
                              </span>
                            </div>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
