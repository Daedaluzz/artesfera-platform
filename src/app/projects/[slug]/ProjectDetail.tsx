"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Calendar,
  DollarSign,
  Tag,
  Share2,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getProject,
  applyToProject,
  hasUserApplied,
  withdrawApplication,
  formatPayment,
  isApplicationDeadlinePassed,
  type Project,
  type ProjectApplication,
  type CreateApplicationData,
} from "@/lib/firestoreProjects";
import { useAuth } from "@/context/AuthContext";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ProjectDetailProps {
  projectId: string;
}

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateApplicationData) => void;
  loading: boolean;
}

function ApplicationModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
}: ApplicationModalProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Email é obrigatório");
      return;
    }

    onSubmit({
      applicantEmail: email.trim(),
      applicantPhone: phone.trim() || undefined,
      coverLetter: coverLetter.trim() || undefined,
      portfolioLink: portfolioLink.trim() || undefined,
    });
  };

  const handleClose = () => {
    if (!loading) {
      setEmail("");
      setPhone("");
      setCoverLetter("");
      setPortfolioLink("");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg rounded-xl backdrop-blur-md bg-white/90 dark:bg-zinc-800/90 border border-white/20 dark:border-zinc-700/30 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
                  Candidatar-se ao Projeto
                </h3>
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="p-2 rounded-lg hover:bg-white/20 dark:hover:bg-zinc-700/30 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="w-full px-3 py-2 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-zinc-700/50 border border-white/30 dark:border-zinc-600/30 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Telefone (Opcional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-zinc-700/50 border border-white/30 dark:border-zinc-600/30 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Carta de Apresentação (Opcional)
                  </label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Conte sobre sua experiência e por que você é ideal para este projeto..."
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-zinc-700/50 border border-white/30 dark:border-zinc-600/30 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 resize-none"
                    maxLength={1000}
                  />
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {coverLetter.length}/1000 caracteres
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Link do Portfólio (Opcional)
                  </label>
                  <input
                    type="url"
                    value={portfolioLink}
                    onChange={(e) => setPortfolioLink(e.target.value)}
                    placeholder="https://seu-portfolio.com"
                    className="w-full px-3 py-2 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-zinc-700/50 border border-white/30 dark:border-zinc-600/30 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <SecondaryButton
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="flex-1"
                  >
                    Cancelar
                  </SecondaryButton>
                  <PrimaryButton
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? "Enviando..." : "Enviar Candidatura"}
                  </PrimaryButton>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ProjectDetail({ projectId }: ProjectDetailProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [userApplication, setUserApplication] =
    useState<ProjectApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [applying, setApplying] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  // Load project and user application status
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const projectData = await getProject(projectId);
        if (!projectData) {
          setError("Projeto não encontrado");
          return;
        }
        setProject(projectData);

        // Check if user has applied
        if (user) {
          const application = await hasUserApplied(projectId, user.uid);
          setUserApplication(application);
        }
      } catch (err) {
        console.error("Error loading project:", err);
        setError("Erro ao carregar projeto. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [projectId, user]);

  // Handle application submission
  const handleApply = async (applicationData: CreateApplicationData) => {
    if (!user || !project) return;

    try {
      setApplying(true);
      const applicantName =
        user.displayName || user.email?.split("@")[0] || "Usuário";
      await applyToProject(projectId, user.uid, applicantName, applicationData);

      // Refresh application status
      const application = await hasUserApplied(projectId, user.uid);
      setUserApplication(application);
      setApplicationModalOpen(false);
    } catch (err: unknown) {
      console.error("Error applying to project:", err);
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      alert(message || "Erro ao enviar candidatura. Tente novamente.");
    } finally {
      setApplying(false);
    }
  };

  // Handle application withdrawal
  const handleWithdraw = async () => {
    if (!user || !userApplication || !project) return;

    const confirmed = window.confirm(
      "Tem certeza que deseja retirar sua candidatura? Esta ação não pode ser desfeita."
    );
    if (!confirmed) return;

    try {
      setWithdrawing(true);
      await withdrawApplication(projectId, userApplication.id, user.uid);
      setUserApplication(null);
    } catch (err: unknown) {
      console.error("Error withdrawing application:", err);
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      alert(message || "Erro ao retirar candidatura. Tente novamente.");
    } finally {
      setWithdrawing(false);
    }
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project?.title,
          text: project?.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-yellow" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">
            {error || "Projeto não encontrado"}
          </div>
          <SecondaryButton onClick={() => router.push("/projects")}>
            Voltar aos Projetos
          </SecondaryButton>
        </div>
      </div>
    );
  }

  const isOwner = user?.uid === project.createdBy;
  const deadlinePassed = isApplicationDeadlinePassed(
    project.applicationDeadline
  );
  const canApply =
    user &&
    !isOwner &&
    !userApplication &&
    project.status === "open" &&
    !deadlinePassed;
  const canWithdraw = userApplication && userApplication.status === "applied";

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

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge
                  variant={
                    project.type === "collaboration"
                      ? "default"
                      : project.type === "hire"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {project.type === "collaboration"
                    ? "Colaboração"
                    : project.type === "hire"
                    ? "Contratação"
                    : "Outro"}
                </Badge>
                <Badge
                  variant={project.status === "open" ? "default" : "secondary"}
                >
                  {project.status === "open" ? "Aberto" : "Fechado"}
                </Badge>
                {deadlinePassed && (
                  <Badge variant="destructive">Prazo Expirado</Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-zinc-800 dark:text-zinc-200 mb-4">
                {project.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-zinc-600 dark:text-zinc-400 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {project.city}, {project.state}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Até
                    {(project.applicationDeadline instanceof Date
                      ? project.applicationDeadline
                      : project.applicationDeadline.toDate()
                    ).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{project.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{project.applicantsCount} candidatos</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <SecondaryButton
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Compartilhar
              </SecondaryButton>

              {isOwner ? (
                <PrimaryButton
                  onClick={() =>
                    router.push(`/dashboard/projects/${project.id}`)
                  }
                  className="whitespace-nowrap"
                >
                  Gerenciar Projeto
                </PrimaryButton>
              ) : canApply ? (
                <PrimaryButton
                  onClick={() => setApplicationModalOpen(true)}
                  className="whitespace-nowrap"
                >
                  Candidatar-se
                </PrimaryButton>
              ) : canWithdraw ? (
                <SecondaryButton
                  onClick={handleWithdraw}
                  disabled={withdrawing}
                  className="whitespace-nowrap"
                >
                  {withdrawing ? "Retirando..." : "Retirar Candidatura"}
                </SecondaryButton>
              ) : userApplication ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-sm bg-white/20 dark:bg-zinc-700/30 border border-white/30 dark:border-zinc-600/30 text-sm">
                  {userApplication.status === "applied" && (
                    <>
                      <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-yellow-600 dark:text-yellow-400">
                        Candidatura Enviada
                      </span>
                    </>
                  )}
                  {userApplication.status === "accepted" && (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-green-600 dark:text-green-400">
                        Candidatura Aceita
                      </span>
                    </>
                  )}
                  {userApplication.status === "rejected" && (
                    <>
                      <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-red-600 dark:text-red-400">
                        Candidatura Rejeitada
                      </span>
                    </>
                  )}
                  {userApplication.status === "withdrawn" && (
                    <>
                      <AlertCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Candidatura Retirada
                      </span>
                    </>
                  )}
                </div>
              ) : !user ? (
                <PrimaryButton
                  onClick={() => router.push("/login")}
                  className="whitespace-nowrap"
                >
                  Fazer Login para Candidatar-se
                </PrimaryButton>
              ) : null}
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="rounded-xl backdrop-blur-md bg-white/10 dark:bg-zinc-800/10 border border-white/20 dark:border-zinc-700/30 p-6 mb-6">
              <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                Descrição do Projeto
              </h2>
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Tags */}
            {project.tags.length > 0 && (
              <div className="rounded-xl backdrop-blur-md bg-white/10 dark:bg-zinc-800/10 border border-white/20 dark:border-zinc-700/30 p-6">
                <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                  Tags do Projeto
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <div
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full backdrop-blur-sm bg-white/20 dark:bg-zinc-700/30 border border-white/30 dark:border-zinc-600/30 text-sm text-zinc-700 dark:text-zinc-300"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Details */}
            <div className="rounded-xl backdrop-blur-md bg-white/10 dark:bg-zinc-800/10 border border-white/20 dark:border-zinc-700/30 p-6">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                Detalhes do Projeto
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      Remuneração
                    </div>
                    <div className="font-semibold text-green-600 dark:text-green-400">
                      {formatPayment(project.payment)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-brand-yellow mt-0.5" />
                  <div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      Prazo de Candidatura
                    </div>
                    <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {(project.applicationDeadline instanceof Date
                        ? project.applicationDeadline
                        : project.applicationDeadline.toDate()
                      ).toLocaleDateString("pt-BR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      Duração
                    </div>
                    <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {project.duration}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      Candidatos
                    </div>
                    <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {project.applicantsCount} pessoas se candidataram
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning for deadline */}
            {deadlinePassed && (
              <div className="rounded-xl backdrop-blur-md bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
                <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Prazo Expirado</span>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  O prazo para candidatura neste projeto já expirou.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={applicationModalOpen}
        onClose={() => setApplicationModalOpen(false)}
        onSubmit={handleApply}
        loading={applying}
      />
    </div>
  );
}
