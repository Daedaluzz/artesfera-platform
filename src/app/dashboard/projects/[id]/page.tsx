"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Edit3,
  Users,
  Eye,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Settings,
  Trash2,
  ExternalLink,
  Loader2,
  User,
  FileText,
  Link as LinkIcon,
  Check,
  X
} from "lucide-react";
import { 
  getProject,
  listApplications,
  acceptApplication,
  rejectApplication,
  generateProjectSlug,
  formatPayment,
  type Project,
  type ProjectApplication 
} from "@/lib/firestoreProjects";
import { Timestamp } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";

function ProjectManagementContent() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [applications, setApplications] = useState<ProjectApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [processingApplication, setProcessingApplication] = useState<string | null>(null);

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      if (!projectId || !user?.uid) return;

      try {
        setLoading(true);
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
      } catch (error) {
        console.error("Error loading project:", error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, user?.uid, router]);

  // Load applications when project is loaded
  useEffect(() => {
    const loadApplications = async () => {
      if (!project?.id || !user?.uid) return;

      try {
        setApplicationsLoading(true);
        const applicationsData = await listApplications(project.id, user.uid);
        setApplications(applicationsData);
      } catch (error) {
        console.error("Error loading applications:", error);
      } finally {
        setApplicationsLoading(false);
      }
    };

    loadApplications();
  }, [project?.id, user?.uid]);

  const handleApplicationAction = async (applicationId: string, status: 'accepted' | 'rejected') => {
    if (!user?.uid || !project?.id) return;

    try {
      setProcessingApplication(applicationId);
      
      if (status === 'accepted') {
        await acceptApplication(project.id, applicationId, user.uid);
      } else {
        await rejectApplication(project.id, applicationId, user.uid);
      }
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status, decisionAt: Timestamp.now(), decisionBy: user.uid }
            : app
        )
      );
    } catch (error) {
      console.error("Error updating application:", error);
      alert("Erro ao atualizar candidatura. Tente novamente.");
    } finally {
      setProcessingApplication(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-white via-brand-white/95 to-brand-white/90 dark:from-brand-black dark:via-brand-black/95 dark:to-brand-black/90 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-navy-blue dark:text-brand-yellow" />
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-white via-brand-white/95 to-brand-white/90 dark:from-brand-black dark:via-brand-black/95 dark:to-brand-black/90">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-6 mb-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
        >
          <div className="flex items-center justify-between mb-4">
            <SecondaryButton
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Dashboard
            </SecondaryButton>

            <div className="flex items-center gap-3">
              <Link href={`/projects/${generateProjectSlug(project.title, project.id)}`}>
                <SecondaryButton className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Ver Projeto
                  <ExternalLink className="w-3 h-3" />
                </SecondaryButton>
              </Link>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-brand-black dark:text-brand-white mb-2">
                {project.title}
              </h1>
              <p className="text-brand-black/70 dark:text-brand-white/70 mb-4">
                {project.description}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-brand-black/60 dark:text-brand-white/60">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {project.city}, {project.state}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {project.duration}
                </span>
                <Badge variant={project.status === 'open' ? 'default' : 'secondary'}>
                  {project.status === 'open' ? 'Aberto' : 'Fechado'}
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Project Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
            >
              <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Informações do Projeto
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-black dark:text-brand-white mb-1">
                    Tipo
                  </label>
                  <Badge variant="outline">
                    {project.type === 'collaboration' ? 'Colaboração' : 
                     project.type === 'hire' ? 'Contratação' : 'Outro'}
                  </Badge>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-black dark:text-brand-white mb-1">
                    Pagamento
                  </label>
                  <div className="flex items-center gap-1 text-sm text-brand-black/70 dark:text-brand-white/70">
                    <DollarSign className="w-4 h-4" />
                    {formatPayment(project.payment)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-black dark:text-brand-white mb-1">
                    Prazo para Candidaturas
                  </label>
                  <div className="flex items-center gap-1 text-sm text-brand-black/70 dark:text-brand-white/70">
                    <Calendar className="w-4 h-4" />
                    {project.applicationDeadline instanceof Date ? 
                      project.applicationDeadline.toLocaleDateString('pt-BR') :
                      (project.applicationDeadline as { toDate?: () => Date })?.toDate?.()?.toLocaleDateString('pt-BR') || 'Data não disponível'
                    }
                  </div>
                </div>

                {project.tags && project.tags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-brand-black dark:text-brand-white mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
            >
              <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white mb-4">
                Ações Rápidas
              </h3>

              <div className="space-y-3">
                <SecondaryButton className="w-full flex items-center gap-2">
                  <Edit3 className="w-4 h-4" />
                  Editar Projeto
                </SecondaryButton>

                <SecondaryButton className="w-full flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Gerenciar Candidaturas
                </SecondaryButton>

                <SecondaryButton 
                  className="w-full flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir Projeto
                </SecondaryButton>
              </div>
            </motion.div>
          </div>

          {/* Applications */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Candidaturas ({applications.length})
                </h3>
              </div>

              {applicationsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-navy-blue dark:text-brand-yellow" />
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-brand-black/30 dark:text-brand-white/30 mx-auto mb-4" />
                  <p className="text-brand-black/70 dark:text-brand-white/70">
                    Nenhuma candidatura recebida ainda
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div
                      key={application.id}
                      className="backdrop-blur-[10px] bg-white/[0.05] dark:bg-black/5 border border-white/[0.15] dark:border-white/5 rounded-[16px] p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-navy-blue to-brand-navy-blue/80 dark:from-brand-yellow dark:to-brand-yellow/80 flex items-center justify-center">
                            <User className="w-5 h-5 text-white dark:text-brand-black" />
                          </div>
                          <div>
                            <h4 className="font-medium text-brand-black dark:text-brand-white">
                              Candidato #{application.id.slice(-6)}
                            </h4>
                            <p className="text-xs text-brand-black/60 dark:text-brand-white/60">
                              {application.createdAt instanceof Date ? 
                                application.createdAt.toLocaleDateString('pt-BR') :
                                (application.createdAt as { toDate?: () => Date })?.toDate?.()?.toLocaleDateString('pt-BR') || 'Data não disponível'
                              }
                            </p>
                          </div>
                        </div>

                        <Badge 
                          variant={
                            application.status === 'accepted' ? 'default' : 
                            application.status === 'rejected' ? 'destructive' : 
                            'secondary'
                          }
                        >
                          {application.status === 'applied' ? 'Pendente' :
                           application.status === 'accepted' ? 'Aceita' : 
                           application.status === 'rejected' ? 'Rejeitada' : 'Retirada'}
                        </Badge>
                      </div>

                      {application.coverLetter && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-brand-black/60 dark:text-brand-white/60" />
                            <span className="text-sm font-medium text-brand-black dark:text-brand-white">
                              Carta de Apresentação
                            </span>
                          </div>
                          <p className="text-sm text-brand-black/70 dark:text-brand-white/70 bg-white/5 dark:bg-black/5 rounded-lg p-3">
                            {application.coverLetter}
                          </p>
                        </div>
                      )}

                      {application.portfolioLink && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <LinkIcon className="w-4 h-4 text-brand-black/60 dark:text-brand-white/60" />
                            <span className="text-sm font-medium text-brand-black dark:text-brand-white">
                              Portfólio
                            </span>
                          </div>
                          <a
                            href={application.portfolioLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-brand-navy-blue dark:text-brand-yellow hover:underline flex items-center gap-1"
                          >
                            {application.portfolioLink}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}

                      {application.status === 'applied' && (
                        <div className="flex items-center gap-3 pt-4 border-t border-white/10 dark:border-white/5">
                          <PrimaryButton
                            onClick={() => handleApplicationAction(application.id, 'accepted')}
                            disabled={processingApplication === application.id}
                            className="flex items-center gap-2"
                          >
                            {processingApplication === application.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                            Aceitar
                          </PrimaryButton>

                          <SecondaryButton
                            onClick={() => handleApplicationAction(application.id, 'rejected')}
                            disabled={processingApplication === application.id}
                            className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <X className="w-4 h-4" />
                            Rejeitar
                          </SecondaryButton>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectManagementPage() {
  return (
    <AuthGuard>
      <ProjectManagementContent />
    </AuthGuard>
  );
}