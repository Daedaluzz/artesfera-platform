"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import {
  Camera,
  Upload,
  User,
  MapPin,
  Hash,
  Globe,
  Instagram,
  Youtube,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getClientFirestore } from "@/lib/firebase";

// Initialize Firebase services
const storage = getStorage();
const db = getClientFirestore();

interface ProfileFormData {
  name: string;
  username: string;
  artisticName: string;
  bio: string;
  location: string;
  tags: string;
  socials: {
    youtube: string;
    instagram: string;
    website: string;
  };
}

interface FormErrors {
  [key: string]: string;
}

// Image compression utility
const compressImage = (
  file: File,
  maxWidth = 800,
  quality = 0.8
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = document.createElement("img");

    img.onload = () => {
      try {
        // Calculate new dimensions
        const { width, height } = img;
        const aspectRatio = width / height;

        let newWidth = maxWidth;
        let newHeight = maxWidth / aspectRatio;

        if (newHeight > maxWidth) {
          newHeight = maxWidth;
          newWidth = maxWidth * aspectRatio;
        }

        // Set canvas dimensions
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
            // Clean up
            URL.revokeObjectURL(img.src);
          },
          "image/jpeg",
          quality
        );
      } catch (error) {
        reject(error);
        URL.revokeObjectURL(img.src);
      }
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
      URL.revokeObjectURL(img.src);
    };

    img.src = URL.createObjectURL(file);
  });
};

export default function ProfileSetup() {
  const {
    user,
    userDocument,
    loading: authLoading,
    syncPublicProfile,
    validateUsername,
    checkUsernameAvailability,
  } = useAuth();
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.displayName || "",
    username: "",
    artisticName: "",
    bio: "",
    location: "",
    tags: "",
    socials: {
      youtube: "",
      instagram: "",
      website: "",
    },
  });

  // UI state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user?.photoURL || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [usernameValidation, setUsernameValidation] = useState<{
    isValid: boolean;
    isAvailable: boolean;
    isChecking: boolean;
    message: string;
  }>({
    isValid: true,
    isAvailable: true,
    isChecking: false,
    message: "",
  });

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image selection (must be before any conditional returns)
  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          setErrors((prev) => ({
            ...prev,
            image: "Por favor, selecione uma imagem válida",
          }));
          return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          setErrors((prev) => ({
            ...prev,
            image: "Imagem deve ter menos de 5MB",
          }));
          return;
        }

        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, image: "" }));
      }
    },
    []
  );

  // Redirect if already completed profile
  if (!authLoading && userDocument?.profileCompleted) {
    router.push("/dashboard");
    return null;
  }

  // Redirect if not authenticated
  if (!authLoading && !user) {
    router.push("/login");
    return null;
  }

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("socials.")) {
      const socialKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socials: {
          ...prev.socials,
          [socialKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Handle username validation
    if (name === "username") {
      handleUsernameValidation(value);
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Username validation handler
  const handleUsernameValidation = async (usernameValue: string) => {
    if (!usernameValue.trim()) {
      setUsernameValidation({
        isValid: true,
        isAvailable: true,
        isChecking: false,
        message: "",
      });
      return;
    }

    // Check format first
    const validation = validateUsername(usernameValue);
    if (!validation.isValid) {
      setUsernameValidation({
        isValid: false,
        isAvailable: false,
        isChecking: false,
        message: validation.error || "Username inválido",
      });
      return;
    }

    // Check availability if format is valid
    setUsernameValidation((prev) => ({
      ...prev,
      isChecking: true,
      message: "Verificando disponibilidade...",
    }));

    try {
      const isAvailable = await checkUsernameAvailability(usernameValue);
      setUsernameValidation({
        isValid: true,
        isAvailable,
        isChecking: false,
        message: isAvailable
          ? "Username disponível!"
          : "Este username já está em uso",
      });
    } catch (error) {
      console.error("Error checking username availability:", error);
      setUsernameValidation({
        isValid: true,
        isAvailable: false,
        isChecking: false,
        message: "Erro ao verificar disponibilidade",
      });
    }
  };

  // Upload image to Firebase Storage
  const uploadImage = async (file: File): Promise<string> => {
    try {
      // Compress image
      const compressedImage = await compressImage(file);

      // Create storage reference
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name.replace(
        /[^a-zA-Z0-9.-]/g,
        "_"
      )}`;
      const storageRef = ref(
        storage,
        `profile-photos/${user!.uid}/${fileName}`
      );

      // Upload compressed image
      const snapshot = await uploadBytes(storageRef, compressedImage);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Falha no upload da imagem");
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Only name is required
    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    // Validate username if provided (since we auto-generate if empty)
    if (
      formData.username &&
      (!usernameValidation.isValid || !usernameValidation.isAvailable)
    ) {
      newErrors.username =
        "Por favor, escolha um username válido e disponível.";
    }

    // Optional field validations (only validate if field has content)
    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = "Bio deve ter no máximo 500 caracteres";
    }

    // Validate social media URLs if provided
    const urlRegex = /^https?:\/\/.+/;
    if (formData.socials.website && !urlRegex.test(formData.socials.website)) {
      newErrors["socials.website"] =
        "URL do website deve começar com http:// ou https://";
    }

    if (formData.socials.youtube && !urlRegex.test(formData.socials.youtube)) {
      newErrors["socials.youtube"] =
        "URL do YouTube deve começar com http:// ou https://";
    }

    if (
      formData.socials.instagram &&
      !urlRegex.test(formData.socials.instagram)
    ) {
      newErrors["socials.instagram"] =
        "URL do Instagram deve começar com http:// ou https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!user) return;

    try {
      setIsLoading(true);
      setErrors({});
      setSuccess(null);

      let photoURL = user.photoURL;

      // Upload new image if selected
      if (selectedImage) {
        photoURL = await uploadImage(selectedImage);
      }

      // Process tags
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Prepare profile data
      const profileData = {
        displayName: formData.name,
        username: formData.username || undefined, // Only save if provided
        artisticName: formData.artisticName,
        bio: formData.bio,
        location: formData.location,
        tags: tagsArray,
        photoURL,
        socials: formData.socials,
        profileCompleted: true,
        lastUpdatedAt: serverTimestamp(),
      };

      // Update user document in Firestore (private data)
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, profileData);

      // Sync public profile data using the AuthContext function for consistency
      // This ensures the public profile has all the correct fields and structure
      await syncPublicProfile(user.uid);

      setSuccess("✅ Perfil criado com sucesso!");

      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error saving profile:", error);
      setErrors({
        general: "Erro ao salvar perfil. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking auth
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

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-white via-brand-cream to-brand-beige dark:from-brand-black dark:via-brand-navy-900 dark:to-brand-navy-800">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-brand-black dark:text-brand-white mb-2">
            Complete seu{" "}
            <span className="text-brand-navy-blue dark:text-brand-yellow">
              Perfil
            </span>
          </h1>
          <p className="text-base sm:text-lg text-brand-black/70 dark:text-brand-white/70">
            Adicione suas informações para começar a conectar com a comunidade
          </p>
        </motion.div>

        {/* Profile Setup Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)] overflow-hidden"
        >
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full" />
          <div className="absolute top-4 left-0 w-px h-[calc(100%-2rem)] bg-gradient-to-b from-white/40 via-transparent to-white/10 rounded-full" />

          {/* Error/Success Messages */}
          <AnimatePresence>
            {(errors.general || success) && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-6"
              >
                <div
                  className={`flex items-center gap-2 p-3 rounded-[12px] backdrop-blur-[10px] border ${
                    errors.general
                      ? "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                      : "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
                  }`}
                >
                  {errors.general ? (
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span className="text-sm">{errors.general || success}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Upload */}
            <div className="text-center">
              <label className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-4">
                Foto do Perfil
              </label>

              <div className="relative inline-block">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-32 h-32 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-brand-navy-blue/20 to-brand-yellow/20 border-2 border-white/30 dark:border-white/20 cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="w-8 h-8 text-brand-black/50 dark:text-brand-white/50" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                </motion.div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>

              {errors.image && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.image}
                </p>
              )}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2"
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300 disabled:opacity-50 ${
                    errors.name
                      ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/30"
                      : "border-white/[0.2] dark:border-white/[0.1]"
                  }`}
                  placeholder="Seu nome completo"
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="artisticName"
                  className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2"
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Nome Artístico (opcional)
                </label>
                <input
                  type="text"
                  id="artisticName"
                  name="artisticName"
                  value={formData.artisticName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300 disabled:opacity-50 ${
                    errors.artisticName
                      ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/30"
                      : "border-white/[0.2] dark:border-white/[0.1]"
                  }`}
                  placeholder="Como você é conhecido"
                />
                {errors.artisticName && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.artisticName}
                  </p>
                )}
              </div>
            </div>

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2"
              >
                @username (opcional)
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300 disabled:opacity-50 ${
                  errors.username ||
                  (!usernameValidation.isValid && formData.username) ||
                  (!usernameValidation.isAvailable && formData.username)
                    ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/30"
                    : usernameValidation.isValid &&
                      usernameValidation.isAvailable &&
                      formData.username
                    ? "border-green-500/50 focus:border-green-500/50 focus:ring-green-500/30"
                    : "border-white/[0.2] dark:border-white/[0.1]"
                }`}
                placeholder="seuusername"
              />
              <div className="flex justify-between mt-1">
                {errors.username ? (
                  <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.username}
                  </p>
                ) : usernameValidation.message ? (
                  <p
                    className={`text-xs flex items-center gap-1 ${
                      usernameValidation.isChecking
                        ? "text-brand-black/60 dark:text-brand-white/60"
                        : usernameValidation.isValid &&
                          usernameValidation.isAvailable
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {usernameValidation.isChecking ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-current" />
                    ) : usernameValidation.isValid &&
                      usernameValidation.isAvailable ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <AlertCircle className="w-3 h-3" />
                    )}
                    {usernameValidation.message}
                  </p>
                ) : null}
              </div>
              <p className="text-xs text-brand-black/50 dark:text-brand-white/50 mt-1">
                Seu username será usado para compartilhar seu perfil:
                artesfera.com/{formData.username || "username"}
              </p>
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2"
              >
                Bio (opcional)
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={isLoading}
                rows={4}
                className={`w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300 disabled:opacity-50 resize-none ${
                  errors.bio
                    ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/30"
                    : "border-white/[0.2] dark:border-white/[0.1]"
                }`}
                placeholder="Conte um pouco sobre você e sua arte..."
              />
              <div className="flex justify-between mt-1">
                {errors.bio ? (
                  <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.bio}
                  </p>
                ) : (
                  <div />
                )}
                <span className="text-xs text-brand-black/50 dark:text-brand-white/50">
                  {formData.bio.length}/500
                </span>
              </div>
            </div>

            {/* Location and Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2"
                >
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Localização (opcional)
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300 disabled:opacity-50"
                  placeholder="Cidade, Estado"
                />
              </div>

              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2"
                >
                  <Hash className="w-4 h-4 inline mr-2" />
                  Tags (opcional)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300 disabled:opacity-50"
                  placeholder="pintura, digital, abstrato"
                />
                <p className="mt-1 text-xs text-brand-black/50 dark:text-brand-white/50">
                  Separe as tags com vírgulas
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <label className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-4">
                Redes Sociais (Opcional)
              </label>

              <div className="space-y-3">
                <div>
                  <div className="relative">
                    <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-black/50 dark:text-brand-white/50" />
                    <input
                      type="url"
                      name="socials.youtube"
                      value={formData.socials.youtube}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300 disabled:opacity-50"
                      placeholder="https://youtube.com/@seucanal"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-black/50 dark:text-brand-white/50" />
                    <input
                      type="url"
                      name="socials.instagram"
                      value={formData.socials.instagram}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300 disabled:opacity-50"
                      placeholder="https://instagram.com/seuperfil"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-black/50 dark:text-brand-white/50" />
                    <input
                      type="url"
                      name="socials.website"
                      value={formData.socials.website}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className={`w-full pl-10 pr-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300 disabled:opacity-50 ${
                        errors["socials.website"]
                          ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/30"
                          : "border-white/[0.2] dark:border-white/[0.1]"
                      }`}
                      placeholder="https://seusite.com"
                    />
                  </div>
                  {errors["socials.website"] && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors["socials.website"]}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <SecondaryButton
                type="button"
                onClick={() => router.push("/login")}
                disabled={isLoading}
                className="flex-1"
              >
                Voltar
              </SecondaryButton>

              <PrimaryButton
                type="submit"
                disabled={isLoading}
                leftIcon={
                  isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )
                }
                className="flex-1"
              >
                {isLoading ? "Salvando..." : "Completar Perfil"}
              </PrimaryButton>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
