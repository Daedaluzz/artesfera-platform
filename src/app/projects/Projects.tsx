"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Clock, Users, Tag, Plus } from "lucide-react";
import { motion } from "framer-motion";
import {
  listPublicProjects,
  type Project,
  formatPayment,
  generateProjectSlug,
} from "@/lib/firestoreProjects";
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const slug = generateProjectSlug(project.title, project.id);
  const isDeadlineSoon =
    project.applicationDeadline &&
    (project.applicationDeadline instanceof Date
      ? project.applicationDeadline
      : project.applicationDeadline.toDate()
    ).getTime() -
      Date.now() <
      7 * 24 * 60 * 60 * 1000; // 7 days

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link href={`/projects/${slug}`}>
        <div className="relative overflow-hidden rounded-xl backdrop-blur-md bg-white/10 dark:bg-zinc-800/10 border border-white/20 dark:border-zinc-700/30 hover:border-white/40 dark:hover:border-zinc-600/50 transition-all duration-300 hover:backdrop-blur-xl hover:bg-white/20 dark:hover:bg-zinc-800/20 hover:translate-y-[-2px] hover:shadow-lg">
          {/* Reflexive hover effect */}
          <div className="absolute inset-0 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] group-hover:before:translate-x-full before:transition-transform before:duration-700 before:ease-out" />

          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-brand-navy-blue dark:group-hover:text-brand-yellow transition-colors line-clamp-2">
                  {project.title}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {project.city}, {project.state}
                  </span>
                </div>
              </div>
              <Badge
                variant={
                  project.type === "collaboration"
                    ? "default"
                    : project.type === "hire"
                    ? "secondary"
                    : "outline"
                }
                className="ml-4"
              >
                {project.type === "collaboration"
                  ? "Colaboração"
                  : project.type === "hire"
                  ? "Contratação"
                  : project.type === "other"
                  ? "Outro"
                  : project.type}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 line-clamp-3">
              {project.description}
            </p>

            {/* Tags */}
            {project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.slice(0, 3).map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full backdrop-blur-sm bg-white/20 dark:bg-zinc-700/30 border border-white/30 dark:border-zinc-600/30 text-xs text-zinc-700 dark:text-zinc-300"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </div>
                ))}
                {project.tags.length > 3 && (
                  <div className="inline-flex items-center px-2 py-1 rounded-full backdrop-blur-sm bg-white/20 dark:bg-zinc-700/30 border border-white/30 dark:border-zinc-600/30 text-xs text-zinc-700 dark:text-zinc-300">
                    +{project.tags.length - 3}
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/20 dark:border-zinc-700/30">
              <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{project.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{project.applicantsCount}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-medium text-green-600 dark:text-green-400">
                  {formatPayment(project.payment)}
                </div>
                <div
                  className={`text-xs ${
                    isDeadlineSoon
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-zinc-500 dark:text-zinc-500"
                  }`}
                >
                  até
                  {(project.applicationDeadline instanceof Date
                    ? project.applicationDeadline
                    : project.applicationDeadline.toDate()
                  ).toLocaleDateString("pt-BR")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Projects() {
  const router = useRouter();
  const { user } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  // Load projects
  const loadProjects = useCallback(
    async (isLoadMore = false) => {
      try {
        console.log(
          `[Projects] Loading projects - isLoadMore: ${isLoadMore}, lastDoc: ${
            lastDoc ? "present" : "null"
          }`
        );

        if (isLoadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
          setError(null);
        }

        const result = await listPublicProjects({
          limit: 12,
          cursor: isLoadMore && lastDoc ? lastDoc : undefined,
        });

        console.log(
          `[Projects] Loaded ${result.projects.length} projects, hasMore: ${result.hasMore}`
        );

        if (isLoadMore) {
          setProjects((prev) => [...prev, ...result.projects]);
        } else {
          setProjects(result.projects);
        }

        setHasMore(result.hasMore);
        setLastDoc(result.lastDoc || null);
      } catch (err) {
        console.error("Error loading projects:", err);
        setError("Erro ao carregar projetos. Tente novamente.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // Intentionally omitting lastDoc dependency to prevent infinite loop
  );

  // Load projects on mount
  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally omitting loadProjects dependency to prevent infinite loop

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      console.log("[Projects] Loading more projects triggered");
      // Create a new load function that captures the current lastDoc
      const loadMoreProjects = async () => {
        try {
          setLoadingMore(true);

          const result = await listPublicProjects({
            limit: 12,
            cursor: lastDoc || undefined,
          });

          console.log(
            `[Projects] Load more: got ${result.projects.length} additional projects`
          );

          setProjects((prev) => [...prev, ...result.projects]);
          setHasMore(result.hasMore);
          setLastDoc(result.lastDoc || null);
        } catch (err) {
          console.error("Error loading more projects:", err);
          setError("Erro ao carregar mais projetos. Tente novamente.");
        } finally {
          setLoadingMore(false);
        }
      };

      loadMoreProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingMore, hasMore]); // Intentionally omitting lastDoc to prevent dependency issues

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-zinc-800 dark:text-zinc-200 mb-2">
                Projetos
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                Descubra oportunidades de colaboração e contratação na
                comunidade artística
              </p>
            </div>

            {user && (
              <PrimaryButton
                onClick={() => router.push("/projects/create")}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Criar Projeto
              </PrimaryButton>
            )}
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="rounded-xl backdrop-blur-md bg-white/10 dark:bg-zinc-800/10 border border-white/20 dark:border-zinc-700/30 p-6">
                  <div className="h-6 bg-zinc-300 dark:bg-zinc-600 rounded mb-4" />
                  <div className="h-4 bg-zinc-300 dark:bg-zinc-600 rounded mb-2" />
                  <div className="h-4 bg-zinc-300 dark:bg-zinc-600 rounded w-3/4 mb-4" />
                  <div className="flex justify-between">
                    <div className="h-4 bg-zinc-300 dark:bg-zinc-600 rounded w-1/4" />
                    <div className="h-4 bg-zinc-300 dark:bg-zinc-600 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
            <SecondaryButton onClick={() => loadProjects()}>
              Tentar Novamente
            </SecondaryButton>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-zinc-600 dark:text-zinc-400 mb-4">
              Nenhum projeto encontrado.
            </div>
            <SecondaryButton onClick={() => loadProjects()}>
              Atualizar
            </SecondaryButton>
          </div>
        ) : (
          <div>
            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center">
                <SecondaryButton
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="min-w-[120px]"
                >
                  {loadingMore ? "Carregando..." : "Carregar Mais"}
                </SecondaryButton>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
