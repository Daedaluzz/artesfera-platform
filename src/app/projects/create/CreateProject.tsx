"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import { createProject, generateProjectSlug, type CreateProjectData } from "@/lib/firestoreProjects";
import { useAuth } from "@/context/AuthContext";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Location options
const ESTADOS_BRASILEIROS = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

const PROJECT_TYPES = [
  { value: "collaboration", label: "Colaboração", description: "Projeto colaborativo entre artistas" },
  { value: "hire", label: "Contratação", description: "Contratação de profissionais" },
  { value: "other", label: "Outro", description: "Outros tipos de projeto" },
];

const CURRENCY_OPTIONS = [
  { value: "BRL", label: "Real (R$)" },
  { value: "USD", label: "Dólar (US$)" },
  { value: "EUR", label: "Euro (€)" },
];

interface FormData {
  title: string;
  description: string;
  city: string;
  state: string;
  duration: string;
  applicationDeadline: string;
  tags: string[];
  type: "collaboration" | "hire" | "other";
  paymentMode: "currency" | "a_combinar" | "other";
  paymentAmount: string;
  paymentCurrency: string;
  paymentRaw: string;
}

export default function CreateProject() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    city: "",
    state: "",
    duration: "",
    applicationDeadline: "",
    tags: [],
    type: "collaboration",
    paymentMode: "a_combinar",
    paymentAmount: "",
    paymentCurrency: "BRL",
    paymentRaw: "",
  });
  
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if user is logged in
  if (!user) {
    router.push("/login");
    return null;
  }

  // Handle form field changes
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Add tag
  const addTag = () => {
    const tag = newTag.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setNewTag("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Título é obrigatório";
    } else if (formData.title.length < 5) {
      newErrors.title = "Título deve ter pelo menos 5 caracteres";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    } else if (formData.description.length < 50) {
      newErrors.description = "Descrição deve ter pelo menos 50 caracteres";
    }

    if (!formData.city.trim()) {
      newErrors.city = "Cidade é obrigatória";
    }

    if (!formData.state) {
      newErrors.state = "Estado é obrigatório";
    }

    if (!formData.duration.trim()) {
      newErrors.duration = "Duração é obrigatória";
    }

    if (!formData.applicationDeadline) {
      newErrors.applicationDeadline = "Prazo de candidatura é obrigatório";
    } else {
      const deadline = new Date(formData.applicationDeadline);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (deadline < tomorrow) {
        newErrors.applicationDeadline = "Prazo deve ser pelo menos amanhã";
      }
    }

    if (formData.paymentMode === "currency") {
      if (!formData.paymentAmount || parseFloat(formData.paymentAmount) <= 0) {
        newErrors.paymentAmount = "Valor deve ser maior que zero";
      }
    }

    if (formData.paymentMode === "other" && !formData.paymentRaw.trim()) {
      newErrors.paymentRaw = "Descrição da remuneração é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Prepare payment data
      const payment: CreateProjectData['payment'] = {
        mode: formData.paymentMode,
      };

      if (formData.paymentMode === "currency") {
        payment.amount = parseFloat(formData.paymentAmount);
        payment.currency = formData.paymentCurrency;
      } else if (formData.paymentMode === "other") {
        payment.raw = formData.paymentRaw;
      }

      // Prepare project data
      const projectData: CreateProjectData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        city: formData.city.trim(),
        state: formData.state,
        duration: formData.duration.trim(),
        applicationDeadline: new Date(formData.applicationDeadline),
        tags: formData.tags,
        type: formData.type,
        payment,
      };

      // Create project
      const projectId = await createProject(projectData, user.uid);
      
      // Generate slug and redirect
      const slug = generateProjectSlug(projectData.title, projectId);
      router.push(`/projects/${slug}`);
    } catch (err: unknown) {
      console.error("Error creating project:", err);
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      alert(message || "Erro ao criar projeto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <SecondaryButton
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </SecondaryButton>

          <h1 className="text-3xl md:text-4xl font-bold text-zinc-800 dark:text-zinc-200 mb-2">
            Criar Novo Projeto
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Publique seu projeto e encontre colaboradores talentosos na comunidade
          </p>
        </div>

        <Separator className="mb-8" />

        {/* Form */}
        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="rounded-xl backdrop-blur-md bg-white/10 dark:bg-zinc-800/10 border border-white/20 dark:border-zinc-700/30 p-6">
                <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                  Informações Básicas
                </h2>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Título do Projeto *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="Ex: Ilustrações para livro infantil"
                      className={`w-full px-3 py-2 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-zinc-700/50 border ${
                        errors.title ? 'border-red-500' : 'border-white/30 dark:border-zinc-600/30'
                      } text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow/50`}
                      maxLength={100}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                    )}
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      {formData.title.length}/100 caracteres
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Descrição do Projeto *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      placeholder="Descreva detalhadamente o projeto, expectativas, requisitos, entregáveis, etc."
                      rows={6}
                      className={`w-full px-3 py-2 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-zinc-700/50 border ${
                        errors.description ? 'border-red-500' : 'border-white/30 dark:border-zinc-600/30'
                      } text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 resize-none`}
                      maxLength={2000}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      {formData.description.length}/2000 caracteres (mínimo 50)
                    </p>
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Tipo do Projeto *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {PROJECT_TYPES.map((type) => (
                        <label
                          key={type.value}
                          className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                            formData.type === type.value
                              ? 'border-brand-yellow bg-brand-yellow/10'
                              : 'border-white/30 dark:border-zinc-600/30 bg-white/20 dark:bg-zinc-700/20'
                          }`}
                        >
                          <input
                            type="radio"
                            name="type"
                            value={type.value}
                            checked={formData.type === type.value}
                            onChange={(e) => handleChange("type", e.target.value as "collaboration" | "hire" | "other")}
                            className="sr-only"
                          />
                          <div className="flex w-full items-center justify-between">
                            <div className="flex items-center">
                              <div className="text-sm">
                                <p className="font-medium text-zinc-800 dark:text-zinc-200">
                                  {type.label}
                                </p>
                                <p className="text-zinc-600 dark:text-zinc-400">
                                  {type.description}
                                </p>
                              </div>
                            </div>
                            {formData.type === type.value && (
                              <div className="shrink-0 text-brand-yellow">
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Timeline */}
              <div className="rounded-xl backdrop-blur-md bg-white/10 dark:bg-zinc-800/10 border border-white/20 dark:border-zinc-700/30 p-6">
                <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                  Localização e Cronograma
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      placeholder="Ex: São Paulo"
                      className={`w-full px-3 py-2 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-zinc-700/50 border ${
                        errors.city ? 'border-red-500' : 'border-white/30 dark:border-zinc-600/30'
                      } text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow/50`}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Estado *
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => handleChange("state", e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-zinc-700/50 border ${
                        errors.state ? 'border-red-500' : 'border-white/30 dark:border-zinc-600/30'
                      } text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow/50`}
                    >
                      <option value="">Selecione um estado</option>
                      {ESTADOS_BRASILEIROS.map((estado) => (
                        <option key={estado.value} value={estado.value}>
                          {estado.label}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                    )}
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Duração *
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => handleChange("duration", e.target.value)}
                      placeholder="Ex: 3 meses, 2 semanas, etc."
                      className={`w-full px-3 py-2 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-zinc-700/50 border ${
                        errors.duration ? 'border-red-500' : 'border-white/30 dark:border-zinc-600/30'
                      } text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow/50`}
                    />
                    {errors.duration && (
                      <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                    )}
                  </div>

                  {/* Application Deadline */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Prazo para Candidaturas *
                    </label>
                    <input
                      type="date"
                      value={formData.applicationDeadline}
                      onChange={(e) => handleChange("applicationDeadline", e.target.value)}
                      min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      className={`w-full px-3 py-2 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-zinc-700/50 border ${
                        errors.applicationDeadline ? 'border-red-500' : 'border-white/30 dark:border-zinc-600/30'
                      } text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow/50`}
                    />
                    {errors.applicationDeadline && (
                      <p className="text-red-500 text-sm mt-1">{errors.applicationDeadline}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="rounded-xl backdrop-blur-md bg-white/10 dark:bg-zinc-800/10 border border-white/20 dark:border-zinc-700/30 p-6">
                <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                  Remuneração
                </h2>

                <div className="space-y-4">
                  {/* Payment Mode */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Tipo de Remuneração
                    </label>
                    <select
                      value={formData.paymentMode}
                      onChange={(e) => handleChange("paymentMode", e.target.value as "currency" | "a_combinar" | "other")}
                      className="w-full px-3 py-2 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-zinc-700/50 border border-white/30 dark:border-zinc-600/30 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                    >
                      <option value="a_combinar">A combinar</option>
                      <option value="currency">Valor específico</option>
                      <option value="other">Outro</option>
                    </select>
                  </div>

                  {/* Payment Amount */}
                  {formData.paymentMode === "currency" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                          Valor *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.paymentAmount}
                          onChange={(e) => handleChange("paymentAmount", e.target.value)}
                          placeholder="0.00"
                          className={`w-full px-3 py-2 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-zinc-700/50 border ${
                            errors.paymentAmount ? 'border-red-500' : 'border-white/30 dark:border-zinc-600/30'
                          } text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow/50`}
                        />
                        {errors.paymentAmount && (
                          <p className="text-red-500 text-sm mt-1">{errors.paymentAmount}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                          Moeda
                        </label>
                        <select
                          value={formData.paymentCurrency}
                          onChange={(e) => handleChange("paymentCurrency", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-zinc-700/50 border border-white/30 dark:border-zinc-600/30 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                        >
                          {CURRENCY_OPTIONS.map((currency) => (
                            <option key={currency.value} value={currency.value}>
                              {currency.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Custom Payment */}
                  {formData.paymentMode === "other" && (
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Descrição da Remuneração *
                      </label>
                      <input
                        type="text"
                        value={formData.paymentRaw}
                        onChange={(e) => handleChange("paymentRaw", e.target.value)}
                        placeholder="Ex: Participação nos lucros, porcentagem das vendas, etc."
                        className={`w-full px-3 py-2 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-zinc-700/50 border ${
                          errors.paymentRaw ? 'border-red-500' : 'border-white/30 dark:border-zinc-600/30'
                        } text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow/50`}
                        maxLength={200}
                      />
                      {errors.paymentRaw && (
                        <p className="text-red-500 text-sm mt-1">{errors.paymentRaw}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="rounded-xl backdrop-blur-md bg-white/10 dark:bg-zinc-800/10 border border-white/20 dark:border-zinc-700/30 p-6">
                <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                  Tags
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  Adicione tags relevantes para ajudar outros a encontrarem seu projeto (máximo 10)
                </p>

                <div className="space-y-4">
                  {/* Add Tag */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      placeholder="Ex: ilustração, design, fotografia..."
                      className="flex-1 px-3 py-2 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-zinc-700/50 border border-white/30 dark:border-zinc-600/30 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                      maxLength={30}
                    />
                    <SecondaryButton
                      type="button"
                      onClick={addTag}
                      disabled={!newTag.trim() || formData.tags.length >= 10}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar
                    </SecondaryButton>
                  </div>

                  {/* Tags List */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1 px-3 py-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {formData.tags.length}/10 tags
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Preview */}
              <div className="rounded-xl backdrop-blur-md bg-white/10 dark:bg-zinc-800/10 border border-white/20 dark:border-zinc-700/30 p-6">
                <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                  Preview
                </h3>
                
                {formData.title && (
                  <div className="mb-3">
                    <h4 className="font-medium text-zinc-800 dark:text-zinc-200 line-clamp-2">
                      {formData.title}
                    </h4>
                  </div>
                )}

                {(formData.city || formData.state) && (
                  <div className="flex items-center gap-2 mb-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {formData.city && formData.state ? `${formData.city}, ${formData.state}` : 
                       formData.city || formData.state}
                    </span>
                  </div>
                )}

                {formData.duration && (
                  <div className="flex items-center gap-2 mb-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <Calendar className="w-4 h-4" />
                    <span>{formData.duration}</span>
                  </div>
                )}

                {formData.description && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-3">
                    {formData.description}
                  </p>
                )}

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {formData.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {formData.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{formData.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <PrimaryButton
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Criando Projeto..." : "Criar Projeto"}
                </PrimaryButton>
                
                <SecondaryButton
                  type="button"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="w-full"
                >
                  Cancelar
                </SecondaryButton>
              </div>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
}