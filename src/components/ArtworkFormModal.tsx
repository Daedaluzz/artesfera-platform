"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Loader2, AlertCircle } from "lucide-react";
import {
  Artwork,
  ArtworkFormData,
  ArtworkValidationErrors,
  PORTFOLIO_CONFIG,
  ImageUploadProgress,
} from "@/types/artwork";
import { TagList } from "@/components/TagBadge";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import artworkService, {
  imageUtils,
  youtubeUtils,
} from "@/services/artworkService";
import { cn } from "@/lib/utils";

interface ArtworkFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  artwork?: Artwork | null; // For editing
  userId: string;
}

export const ArtworkFormModal: React.FC<ArtworkFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  artwork,
  userId,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<ImageUploadProgress[]>(
    []
  );

  // Form state
  const [formData, setFormData] = useState<ArtworkFormData>({
    title: "",
    description: "",
    youtubeLinks: [""],
    tags: [],
    isPublic: true,
  });

  const [errors, setErrors] = useState<ArtworkValidationErrors>({});
  const [newTag, setNewTag] = useState("");
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Initialize form data when editing
  useEffect(() => {
    if (artwork) {
      setFormData({
        title: artwork.title,
        description: artwork.description,
        youtubeLinks:
          artwork.youtubeLinks.length > 0 ? artwork.youtubeLinks : [""],
        tags: artwork.tags || [],
        isPublic: artwork.isPublic,
      });
      setExistingImages(artwork.images || []);
    } else {
      // Reset form for new artwork
      setFormData({
        title: "",
        description: "",
        youtubeLinks: [""],
        tags: [],
        isPublic: true,
      });
      setExistingImages([]);
    }
    setErrors({});
    setUploadProgress([]);
  }, [artwork, isOpen]);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: ArtworkValidationErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Título é obrigatório";
    } else if (formData.title.length > 100) {
      newErrors.title = "Título muito longo (máximo 100 caracteres)";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    } else if (formData.description.length > 2000) {
      newErrors.description = "Descrição muito longa (máximo 2000 caracteres)";
    }

    // Validate images
    const totalImages =
      existingImages.length + uploadProgress.filter((p) => p.url).length;
    if (totalImages === 0) {
      newErrors.images = "Pelo menos uma imagem é obrigatória";
    } else if (totalImages > PORTFOLIO_CONFIG.maxImagesPerArtwork) {
      newErrors.images = `Máximo ${PORTFOLIO_CONFIG.maxImagesPerArtwork} imagens permitidas`;
    }

    // Validate YouTube links
    const validLinks = formData.youtubeLinks.filter((link) => link.trim());
    if (validLinks.length > 0) {
      const { invalid } = youtubeUtils.validateUrls(validLinks);
      if (invalid.length > 0) {
        newErrors.youtubeLinks = `URLs inválidas: ${invalid.join(", ")}`;
      }
    }

    // Validate tags
    if (formData.tags.length > PORTFOLIO_CONFIG.maxTags) {
      newErrors.tags = `Máximo ${PORTFOLIO_CONFIG.maxTags} tags permitidas`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (
    field: keyof ArtworkFormData,
    value: string | string[] | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle YouTube link changes
  const handleYouTubeChange = (index: number, value: string) => {
    const newLinks = [...formData.youtubeLinks];
    newLinks[index] = value;
    handleInputChange("youtubeLinks", newLinks);
  };

  const addYouTubeField = () => {
    handleInputChange("youtubeLinks", [...formData.youtubeLinks, ""]);
  };

  const removeYouTubeField = (index: number) => {
    const newLinks = formData.youtubeLinks.filter((_, i) => i !== index);
    handleInputChange("youtubeLinks", newLinks.length > 0 ? newLinks : [""]);
  };

  // Handle tag management
  const handleAddTag = () => {
    const tag = newTag.trim().toLowerCase();
    if (
      tag &&
      !formData.tags.includes(tag) &&
      formData.tags.length < PORTFOLIO_CONFIG.maxTags
    ) {
      handleInputChange("tags", [...formData.tags, tag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange(
      "tags",
      formData.tags.filter((tag) => tag !== tagToRemove)
    );
  };

  // Handle file selection
  const handleFileSelect = async (files: FileList) => {
    const fileArray = Array.from(files);
    const totalImages =
      existingImages.length +
      uploadProgress.filter((p) => p.url).length +
      fileArray.length;

    if (totalImages > PORTFOLIO_CONFIG.maxImagesPerArtwork) {
      setErrors((prev) => ({
        ...prev,
        images: `Máximo ${PORTFOLIO_CONFIG.maxImagesPerArtwork} imagens permitidas`,
      }));
      return;
    }

    // Initialize upload progress for new files
    const newUploads: ImageUploadProgress[] = fileArray.map((file) => ({
      file,
      progress: 0,
    }));

    setUploadProgress((prev) => [...prev, ...newUploads]);

    // Upload files
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const uploadIndex = uploadProgress.length + i;

      try {
        // Validate file
        const validation = imageUtils.validateImage(file);
        if (!validation.valid) {
          setUploadProgress((prev) =>
            prev.map((upload, index) =>
              index === uploadIndex
                ? { ...upload, error: validation.error }
                : upload
            )
          );
          continue;
        }

        // Upload image
        const tempArtworkId = artwork?.id || `temp_${Date.now()}`;
        const imageUrl = await imageUtils.uploadImage(
          file,
          userId,
          tempArtworkId
        );

        setUploadProgress((prev) =>
          prev.map((upload, index) =>
            index === uploadIndex
              ? { ...upload, progress: 100, url: imageUrl }
              : upload
          )
        );
      } catch (error) {
        console.error("Error uploading image:", error);
        setUploadProgress((prev) =>
          prev.map((upload, index) =>
            index === uploadIndex
              ? { ...upload, error: "Erro no upload" }
              : upload
          )
        );
      }
    }
  };

  // Remove existing image
  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove uploaded image
  const handleRemoveUploadedImage = (index: number) => {
    setUploadProgress((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Prepare image URLs
      const uploadedImages = uploadProgress
        .filter((upload) => upload.url)
        .map((upload) => upload.url!);

      const allImages = [...existingImages, ...uploadedImages];

      // Prepare artwork data
      const artworkData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        images: allImages,
        youtubeLinks: formData.youtubeLinks.filter((link) => link.trim()),
        tags: formData.tags,
        isPublic: formData.isPublic,
      };

      if (artwork) {
        // Update existing artwork
        await artworkService.update(artwork.id, artworkData);
      } else {
        // Create new artwork
        await artworkService.create(userId, artworkData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving artwork:", error);
      setErrors({ general: "Erro ao salvar obra. Tente novamente." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const totalImages =
    existingImages.length + uploadProgress.filter((p) => p.url).length;
  const canAddMoreImages = totalImages < PORTFOLIO_CONFIG.maxImagesPerArtwork;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-4xl h-[calc(100vh-16px)] sm:h-[calc(100vh-32px)] max-h-[800px] bg-white/[0.95] dark:bg-brand-black/15 backdrop-blur-[15px] border border-white/[0.4] dark:border-brand-navy-500/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-brand-navy-200/50 dark:border-white/[0.1] bg-white/[0.6] dark:bg-black/5">
            <h2 className="text-lg sm:text-xl font-semibold text-brand-black dark:text-brand-white">
              {artwork ? "Editar Obra" : "Adicionar Nova Obra"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-brand-navy-100/50 dark:hover:bg-brand-navy-600/30 transition-colors duration-200 cursor-pointer"
            >
              <X className="w-5 h-5 text-brand-black dark:text-brand-white" />
            </button>
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <form
              onSubmit={handleSubmit}
              className="p-4 sm:p-6 space-y-6"
              id="artwork-form"
            >
              {/* General Error */}
              {errors.general && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="text-red-600 dark:text-red-400 text-sm">
                    {errors.general}
                  </span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-brand-black dark:text-brand-white mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/[0.7] dark:bg-black/10 border text-brand-black dark:text-brand-white placeholder-brand-black/60 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 transition-all duration-200",
                    errors.title
                      ? "border-red-300 dark:border-red-700 focus:ring-red-300 dark:focus:ring-red-700"
                      : "border-brand-navy-200/50 dark:border-white/[0.1] focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30"
                  )}
                  placeholder="Digite o título da obra..."
                  maxLength={100}
                />
                {errors.title && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-brand-black dark:text-brand-white mb-2">
                  Descrição *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/[0.7] dark:bg-black/10 border text-brand-black dark:text-brand-white placeholder-brand-black/60 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 transition-all duration-200 resize-none",
                    errors.description
                      ? "border-red-300 dark:border-red-700 focus:ring-red-300 dark:focus:ring-red-700"
                      : "border-brand-navy-200/50 dark:border-white/[0.1] focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30"
                  )}
                  placeholder="Descreva sua obra, técnicas utilizadas, inspiração..."
                  maxLength={2000}
                />
                <div className="flex justify-between mt-1">
                  {errors.description && (
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      {errors.description}
                    </p>
                  )}
                  <p className="text-brand-black/50 dark:text-brand-white/50 text-sm ml-auto">
                    {formData.description.length}/2000
                  </p>
                </div>
              </div>

              {/* Images Section */}
              <div>
                <label className="block text-sm font-medium text-brand-black dark:text-brand-white mb-2">
                  Imagens * (máximo {PORTFOLIO_CONFIG.maxImagesPerArtwork})
                </label>

                {/* Image Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {/* Existing Images */}
                  {existingImages.map((image, index) => (
                    <div
                      key={`existing-${index}`}
                      className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800"
                    >
                      <Image
                        src={image}
                        alt={`Imagem ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(index)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 z-10 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Uploaded Images */}
                  {uploadProgress.map((upload, index) => (
                    <div
                      key={`upload-${index}`}
                      className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800"
                    >
                      {upload.url ? (
                        <>
                          <Image
                            src={upload.url}
                            alt={`Upload ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 33vw"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveUploadedImage(index)}
                            className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 z-10 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      ) : upload.error ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                            <p className="text-xs text-red-600 dark:text-red-400">
                              {upload.error}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-brand-navy-blue dark:text-brand-yellow animate-spin" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Add Image Button */}
                  {canAddMoreImages && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-brand-navy-blue/30 dark:border-brand-yellow/30 hover:border-brand-navy-blue/50 dark:hover:border-brand-yellow/50 flex items-center justify-center transition-colors duration-200 cursor-pointer"
                    >
                      <div className="text-center">
                        <Plus className="w-8 h-8 text-brand-navy-blue dark:text-brand-yellow mx-auto mb-2" />
                        <p className="text-sm text-brand-navy-blue dark:text-brand-yellow">
                          Adicionar
                        </p>
                      </div>
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={PORTFOLIO_CONFIG.allowedImageTypes.join(",")}
                  onChange={(e) =>
                    e.target.files && handleFileSelect(e.target.files)
                  }
                  className="hidden"
                />

                {errors.images && (
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {errors.images}
                  </p>
                )}

                <p className="text-brand-black/50 dark:text-brand-white/50 text-sm">
                  Formatos aceitos: JPG, PNG, WebP (máximo
                  {PORTFOLIO_CONFIG.maxImageSizeMB}MB cada)
                </p>
              </div>

              {/* YouTube Links */}
              <div>
                <label className="block text-sm font-medium text-brand-black dark:text-brand-white mb-2">
                  Vídeos do YouTube (opcional)
                </label>
                <div className="space-y-2">
                  {formData.youtubeLinks.map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={link}
                        onChange={(e) =>
                          handleYouTubeChange(index, e.target.value)
                        }
                        className="flex-1 px-4 py-3 rounded-xl backdrop-blur-md bg-white/[0.7] dark:bg-black/10 border border-brand-navy-200/50 dark:border-white/[0.1] text-brand-black dark:text-brand-white placeholder-brand-black/60 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 transition-all duration-200"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                      {formData.youtubeLinks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeYouTubeField(index)}
                          className="p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addYouTubeField}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/[0.1] dark:hover:bg-black/10 text-brand-navy-blue dark:text-brand-yellow transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar vídeo
                  </button>
                </div>
                {errors.youtubeLinks && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                    {errors.youtubeLinks}
                  </p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-brand-black dark:text-brand-white mb-2">
                  Tags (máximo {PORTFOLIO_CONFIG.maxTags})
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), handleAddTag())
                    }
                    className="flex-1 px-4 py-2 rounded-lg backdrop-blur-md bg-white/[0.7] dark:bg-black/10 border border-brand-navy-200/50 dark:border-white/[0.1] text-brand-black dark:text-brand-white placeholder-brand-black/60 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 transition-all duration-200"
                    placeholder="Digite uma tag..."
                    maxLength={PORTFOLIO_CONFIG.maxTagLength}
                  />
                  <SecondaryButton
                    type="button"
                    onClick={handleAddTag}
                    disabled={
                      !newTag.trim() ||
                      formData.tags.length >= PORTFOLIO_CONFIG.maxTags
                    }
                    className="text-sm"
                  >
                    Adicionar
                  </SecondaryButton>
                </div>

                {formData.tags.length > 0 && (
                  <TagList
                    tags={formData.tags}
                    variant="removable"
                    size="sm"
                    onTagRemove={handleRemoveTag}
                  />
                )}

                {errors.tags && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                    {errors.tags}
                  </p>
                )}
              </div>

              {/* Visibility */}
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) =>
                      handleInputChange("isPublic", e.target.checked)
                    }
                    className="w-4 h-4 rounded border-white/[0.2] dark:border-white/[0.1] text-brand-navy-blue dark:text-brand-yellow focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30"
                  />
                  <span className="text-sm text-brand-black dark:text-brand-white">
                    Tornar obra pública (visível para todos)
                  </span>
                </label>
              </div>
            </form>
          </div>

          {/* Fixed Footer */}
          <div className="flex-shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 sm:p-6 border-t border-brand-navy-200/50 dark:border-white/[0.1] bg-white/[0.6] dark:bg-black/5">
            <SecondaryButton
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              fullWidth
              className="sm:w-auto"
            >
              Cancelar
            </SecondaryButton>

            <PrimaryButton
              type="button"
              onClick={() => {
                const form = document.getElementById(
                  "artwork-form"
                ) as HTMLFormElement;
                if (form) {
                  form.requestSubmit();
                }
              }}
              disabled={isSubmitting}
              fullWidth
              className="sm:w-auto"
              leftIcon={
                isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : undefined
              }
            >
              {isSubmitting
                ? artwork
                  ? "Salvando..."
                  : "Criando..."
                : artwork
                ? "Salvar Alterações"
                : "Criar Obra"}
            </PrimaryButton>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ArtworkFormModal;
