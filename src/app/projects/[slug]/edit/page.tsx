"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import {
  getProject,
  updateProject,
  parseProjectSlug,
  type Project,
  type CreateProjectData,
} from "@/lib/firestoreProjects";
import { useAuth } from "@/context/AuthContext";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";

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
  status: "open" | "closed";
}

export default function EditProject() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
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
    status: "open",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      if (!slug || !user?.uid) return;

      try {
        setLoading(true);
        const { id: projectId } = parseProjectSlug(slug);
        const projectData = await getProject(projectId);

        if (!projectData) {
          router.push('/dashboard');
          return;
        }

        // Check if user owns this project
        if (projectData.createdBy !== user.uid) {
          router.push('/dashboard');
          return;
        }

        setProject(projectData);
        
        // Populate form with project data
        const deadline = projectData.applicationDeadline instanceof Date 
          ? projectData.applicationDeadline 
          : (projectData.applicationDeadline as { toDate?: () => Date })?.toDate?.() || new Date();

        setFormData({
          title: projectData.title,
          description: projectData.description,
          city: projectData.city,
          state: projectData.state,
          duration: projectData.duration,
          applicationDeadline: deadline.toISOString().split('T')[0],
          tags: projectData.tags || [],
          type: projectData.type,
          paymentMode: projectData.payment.mode,
          paymentAmount: projectData.payment.amount?.toString() || "",
          paymentCurrency: projectData.payment.currency || "BRL",
          paymentRaw: projectData.payment.raw || "",
          status: projectData.status,
        });
      } catch (error) {
        console.error("Error loading project:", error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [slug, user?.uid, router]);

  // Handle form field changes
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
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
    } else if (formData.description.length < 20) {
      newErrors.description = "Descrição deve ter pelo menos 20 caracteres";
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
      newErrors.applicationDeadline = "Prazo para candidaturas é obrigatório";
    } else {
      const deadline = new Date(formData.applicationDeadline);
      if (deadline <= new Date()) {
        newErrors.applicationDeadline = "Prazo deve ser futuro";
      }
    }

    if (formData.paymentMode === "currency") {
      if (!formData.paymentAmount || parseFloat(formData.paymentAmount) <= 0) {
        newErrors.paymentAmount = "Valor deve ser maior que zero";
      }
    } else if (formData.paymentMode === "other" && !formData.paymentRaw.trim()) {
      newErrors.paymentRaw = "Descrição do pagamento é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !project || !user?.uid) {
      return;
    }

    try {
      setSaving(true);

      // Prepare payment data
      const payment: CreateProjectData["payment"] = {
        mode: formData.paymentMode,
      };

      if (formData.paymentMode === "currency") {
        payment.amount = parseFloat(formData.paymentAmount);
        payment.currency = formData.paymentCurrency;
      } else if (formData.paymentMode === "other") {
        payment.raw = formData.paymentRaw;
      }

      // Prepare update data
      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        city: formData.city.trim(),
        state: formData.state,
        duration: formData.duration.trim(),
        applicationDeadline: new Date(formData.applicationDeadline),
        tags: formData.tags,
        type: formData.type,
        payment,
        status: formData.status,
      };

      await updateProject(project.id, updateData, user.uid);

      // Redirect back to project management
      router.push(`/dashboard/projects/${project.id}`);
    } catch (err: unknown) {
      console.error("Error updating project:", err);
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      alert(message || "Erro ao atualizar projeto. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-yellow mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <SecondaryButton
            onClick={() => router.push(`/dashboard/projects/${project.id}`)}
            className="flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Gerenciamento
          </SecondaryButton>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-200 mb-2">
              Editar Projeto
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Faça as alterações necessárias no seu projeto
            </p>
          </motion.div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="rounded-xl backdrop-blur-md bg-white/10 dark:bg-zinc-800/10 border border-white/20 dark:border-zinc-700/30 p-6">
                <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-6">
                  Informações Básicas
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Título do Projeto *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="Ex: Ilustração para livro infantil"
                      className="w-full px-4 py-3 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-zinc-700/50 border border-white/30 dark:border-zinc-600/30 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                      maxLength={100}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                    )}
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      {formData.title.length}/100 caracteres
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Descrição *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      placeholder="Descreva detalhadamente o que você precisa..."
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-zinc-700/50 border border-white/30 dark:border-zinc-600/30 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 resize-none"
                      maxLength={2000}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      {formData.description.length}/2000 caracteres
                    </p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="rounded-xl backdrop-blur-md bg-white/10 dark:bg-zinc-800/10 border border-white/20 dark:border-zinc-700/30 p-6">
                <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                  Status do Projeto
                </h2>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-white/20 dark:border-zinc-700/30 hover:bg-white/10 dark:hover:bg-zinc-700/20 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="open"
                      checked={formData.status === "open"}
                      onChange={(e) => handleChange("status", e.target.value)}
                      className="text-brand-yellow focus:ring-brand-yellow/50"
                    />
                    <div>
                      <p className="font-medium text-zinc-800 dark:text-zinc-200">
                        Aberto
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Aceita candidaturas
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg border border-white/20 dark:border-zinc-700/30 hover:bg-white/10 dark:hover:bg-zinc-700/20 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="closed"
                      checked={formData.status === "closed"}
                      onChange={(e) => handleChange("status", e.target.value)}
                      className="text-brand-yellow focus:ring-brand-yellow/50"
                    />
                    <div>
                      <p className="font-medium text-zinc-800 dark:text-zinc-200">
                        Fechado
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Não aceita mais candidaturas
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="flex gap-3">
                <SecondaryButton
                  type="button"
                  onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                  disabled={saving}
                  className="flex-1"
                >
                  Cancelar
                </SecondaryButton>
                <PrimaryButton
                  type="submit"
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </PrimaryButton>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}