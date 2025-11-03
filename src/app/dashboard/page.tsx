"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { motion } from "framer-motion";
import {
  User,
  LogOut,
  Settings,
  BarChart3,
  Folder,
  Users,
  Calendar,
  MapPin,
  Clock,
  Badge as BadgeIcon,
  Briefcase,
  Plus,
  Loader2,
  ExternalLink,
} from "lucide-react";
import {
  getUserProjects,
  getUserApplications,
  generateProjectSlug,
  formatPayment,
  type Project,
  type ProjectApplication,
} from "@/lib/firestoreProjects";
import { Badge } from "@/components/ui/badge";

function DashboardContent() {
  const { user, userDocument, signOut, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<
    { project: Project; application: ProjectApplication }[]
  >([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  // Redirect to profile setup if profile is incomplete
  useEffect(() => {
    if (!loading && user && userDocument && !userDocument.profileCompleted) {
      console.log(
        "🔀 Dashboard: Redirecting to profile setup for incomplete profile"
      );
      router.push("/dashboard/profile-setup");
    }
  }, [user, userDocument, loading, router]);

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
      } finally {
        setProjectsLoading(false);
      }
    };

    loadProjectsData();
  }, [user?.uid]);

  const handleSignOut = async () => {
    try {
      await signOut();
      // User will be redirected by AuthGuard when auth state changes
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-white via-brand-white/95 to-brand-white/90 dark:from-brand-black dark:via-brand-black/95 dark:to-brand-black/90">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-6 mb-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-navy-blue to-brand-navy-blue/80 dark:from-brand-yellow dark:to-brand-yellow/80 flex items-center justify-center">
                <User className="w-6 h-6 text-white dark:text-brand-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-brand-black dark:text-brand-white">
                  Bem-vindo,
                  {user?.displayName || user?.email?.split("@")[0] || "Usuário"}
                  !
                </h1>
                <p className="text-brand-black/70 dark:text-brand-white/70">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-black/10 border border-white/[0.2] dark:border-white/10 text-brand-black dark:text-brand-white hover:bg-white/[0.2] dark:hover:bg-black/20 transition-all duration-200 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </motion.div>

        {/* Dashboard Cards */}
        <div className="space-y-6 mb-8">
          {/* Projects Section - Full Width */}
          {/* Projects Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] col-span-1 md:col-span-2 lg:col-span-3"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-brand-navy-blue to-brand-navy-blue/80 dark:from-brand-yellow dark:to-brand-yellow/80 flex items-center justify-center">
                  <Folder className="w-5 h-5 text-white dark:text-brand-black" />
                </div>
                <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white">
                  Meus Projetos
                </h3>
              </div>
              <Link href="/projects/create">
                <button className="flex items-center gap-2 px-4 py-2 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-black/10 border border-white/[0.2] dark:border-white/10 text-brand-black dark:text-brand-white hover:bg-white/[0.2] dark:hover:bg-black/20 transition-all duration-200 cursor-pointer">
                  <Plus className="w-4 h-4" />
                  Criar Projeto
                </button>
              </Link>
            </div>

            {projectsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-brand-navy-blue dark:text-brand-yellow" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Created Projects */}
                <div>
                  <h4 className="text-md font-semibold text-brand-black dark:text-brand-white mb-4 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Projetos Criados ({projects.length})
                  </h4>

                  {projects.length === 0 ? (
                    <div className="backdrop-blur-[10px] bg-white/[0.05] dark:bg-black/5 border border-white/[0.15] dark:border-white/5 rounded-[16px] p-6 text-center">
                      <Briefcase className="w-10 h-10 text-brand-black/50 dark:text-brand-white/50 mx-auto mb-3" />
                      <p className="text-brand-black/70 dark:text-brand-white/70 text-sm mb-3">
                        Nenhum projeto criado ainda
                      </p>
                      <Link href="/projects/create">
                        <button className="px-3 py-2 text-sm rounded-lg bg-brand-navy-blue/20 dark:bg-brand-yellow/20 text-brand-navy-blue dark:text-brand-yellow hover:bg-brand-navy-blue/30 dark:hover:bg-brand-yellow/30 transition-colors cursor-pointer">
                          Criar Primeiro Projeto
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {projects.slice(0, 3).map((project) => (
                        <Link
                          key={project.id}
                          href={`/projects/${generateProjectSlug(
                            project.title,
                            project.id
                          )}`}
                        >
                          <div className="backdrop-blur-[10px] bg-white/[0.05] dark:bg-black/5 border border-white/[0.15] dark:border-white/5 rounded-[16px] p-4 hover:border-white/[0.25] dark:hover:border-white/15 transition-all duration-300 hover:backdrop-blur-xl hover:bg-white/[0.1] dark:hover:bg-black/10 group">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-brand-black dark:text-brand-white group-hover:text-brand-navy-blue dark:group-hover:text-brand-yellow transition-colors line-clamp-1 text-sm">
                                {project.title}
                              </h5>
                              <Badge
                                variant={
                                  project.status === "open"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {project.status === "open"
                                  ? "Aberto"
                                  : "Fechado"}
                              </Badge>
                            </div>

                            <p className="text-xs text-brand-black/70 dark:text-brand-white/70 line-clamp-2 mb-2">
                              {project.description}
                            </p>

                            <div className="flex items-center gap-3 text-xs text-brand-black/60 dark:text-brand-white/60">
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
                          <div className="text-center py-3">
                            <span className="text-sm text-brand-navy-blue dark:text-brand-yellow hover:underline flex items-center justify-center gap-1">
                              Ver todos os {projects.length} projetos
                              <ExternalLink className="w-3 h-3" />
                            </span>
                          </div>
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                {/* Applied Projects */}
                <div>
                  <h4 className="text-md font-semibold text-brand-black dark:text-brand-white mb-4 flex items-center gap-2">
                    <BadgeIcon className="w-4 h-4" />
                    Candidaturas ({applications.length})
                  </h4>

                  {applications.length === 0 ? (
                    <div className="backdrop-blur-[10px] bg-white/[0.05] dark:bg-black/5 border border-white/[0.15] dark:border-white/5 rounded-[16px] p-6 text-center">
                      <BadgeIcon className="w-10 h-10 text-brand-black/50 dark:text-brand-white/50 mx-auto mb-3" />
                      <p className="text-brand-black/70 dark:text-brand-white/70 text-sm mb-3">
                        Nenhuma candidatura enviada ainda
                      </p>
                      <Link href="/projects">
                        <button className="px-3 py-2 text-sm rounded-lg bg-brand-navy-blue/20 dark:bg-brand-yellow/20 text-brand-navy-blue dark:text-brand-yellow hover:bg-brand-navy-blue/30 dark:hover:bg-brand-yellow/30 transition-colors cursor-pointer">
                          Explorar Projetos
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
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
                            <div className="backdrop-blur-[10px] bg-white/[0.05] dark:bg-black/5 border border-white/[0.15] dark:border-white/5 rounded-[16px] p-4 hover:border-white/[0.25] dark:hover:border-white/15 transition-all duration-300 hover:backdrop-blur-xl hover:bg-white/[0.1] dark:hover:bg-black/10 group">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-medium text-brand-black dark:text-brand-white group-hover:text-brand-navy-blue dark:group-hover:text-brand-yellow transition-colors line-clamp-1 text-sm">
                                  {project.title}
                                </h5>
                                <Badge
                                  variant={
                                    application.status === "accepted"
                                      ? "default"
                                      : application.status === "rejected"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                  className="text-xs"
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

                              <p className="text-xs text-brand-black/70 dark:text-brand-white/70 line-clamp-2 mb-2">
                                {project.description}
                              </p>

                              <div className="flex items-center gap-3 text-xs text-brand-black/60 dark:text-brand-white/60">
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
                          <div className="text-center py-3">
                            <span className="text-sm text-brand-navy-blue dark:text-brand-yellow hover:underline flex items-center justify-center gap-1">
                              Ver todas as {applications.length} candidaturas
                              <ExternalLink className="w-3 h-3" />
                            </span>
                          </div>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Other Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Analytics Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:bg-white/[0.25] dark:hover:bg-black/25 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-brand-navy-blue to-brand-navy-blue/80 dark:from-brand-yellow dark:to-brand-yellow/80 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white dark:text-brand-black" />
                </div>
                <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white">
                  Analytics
                </h3>
              </div>
              <p className="text-brand-black/70 dark:text-brand-white/70 text-sm mb-3">
                Acompanhe o desempenho dos seus projetos
              </p>
              <div className="text-lg font-bold text-brand-navy-blue dark:text-brand-yellow">
                Em Breve
              </div>
            </motion.div>

            {/* Community Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:bg-white/[0.25] dark:hover:bg-black/25 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-brand-navy-blue to-brand-navy-blue/80 dark:from-brand-yellow dark:to-brand-yellow/80 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white dark:text-brand-black" />
                </div>
                <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white">
                  Comunidade
                </h3>
              </div>
              <p className="text-brand-black/70 dark:text-brand-white/70 text-sm mb-3">
                Conecte-se com outros artistas
              </p>
              <div className="text-lg font-bold text-brand-navy-blue dark:text-brand-yellow">
                Em Breve
              </div>
            </motion.div>
          </div>
        </div>

        {/* User Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-brand-navy-blue to-brand-navy-blue/80 dark:from-brand-yellow dark:to-brand-yellow/80 flex items-center justify-center">
              <Settings className="w-5 h-5 text-white dark:text-brand-black" />
            </div>
            <h2 className="text-xl font-semibold text-brand-black dark:text-brand-white">
              Informações da Conta
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-brand-black dark:text-brand-white mb-2">
                Nome de Exibição
              </label>
              <div className="px-4 py-3 rounded-[12px] bg-white/[0.1] dark:bg-black/10 border border-white/[0.2] dark:border-white/10 text-brand-black dark:text-brand-white">
                {user?.displayName || "Não definido"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-black dark:text-brand-white mb-2">
                Email
              </label>
              <div className="px-4 py-3 rounded-[12px] bg-white/[0.1] dark:bg-black/10 border border-white/[0.2] dark:border-white/10 text-brand-black dark:text-brand-white">
                {user?.email}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-black dark:text-brand-white mb-2">
                Método de Autenticação
              </label>
              <div className="px-4 py-3 rounded-[12px] bg-white/[0.1] dark:bg-black/10 border border-white/[0.2] dark:border-white/10 text-brand-black dark:text-brand-white">
                {user?.providerData?.[0]?.providerId === "google.com"
                  ? "Google"
                  : "Email/Senha"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-black dark:text-brand-white mb-2">
                Status de Verificação
              </label>
              <div className="px-4 py-3 rounded-[12px] bg-white/[0.1] dark:bg-black/10 border border-white/[0.2] dark:border-white/10 text-brand-black dark:text-brand-white">
                {user?.emailVerified ? "✅ Verificado" : "❌ Não verificado"}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Dashboard Page
 *
 * This page demonstrates the complete auth protection setup:
 * 1. Protected by middleware.ts (server-side)
 * 2. Wrapped with AuthGuard (client-side)
 * 3. Uses useAuth hook for user data and actions
 */
export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
