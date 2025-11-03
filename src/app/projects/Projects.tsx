"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Users,
  Tag,
  Plus,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  listPublicProjects,
  type Project,
  type ProjectFilters,
  formatPayment,
  generateProjectSlug,
} from "@/lib/firestoreProjects";
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Location options for filters
const ESTADOS_BRASILEIROS = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

const PROJECT_TYPES = [
  { value: "collaboration", label: "Colaboração" },
  { value: "hire", label: "Contratação" },
  { value: "other", label: "Outro" },
];

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
                {PROJECT_TYPES.find((t) => t.value === project.type)?.label ||
                  project.type}
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
                <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {formatPayment(project.payment)}
                </div>
                <div
                  className={`text-xs ${
                    isDeadlineSoon
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-zinc-500 dark:text-zinc-500"
                  }`}
                >
                  até{" "}
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

function FilterPanel({
  filters,
  onFiltersChange,
  isOpen,
  onToggle,
}: {
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <SecondaryButton onClick={onToggle} className="flex items-center gap-2">
        <Filter className="w-4 h-4" />
        Filtros
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </SecondaryButton>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-80 p-4 rounded-xl backdrop-blur-md bg-white/90 dark:bg-zinc-800/90 border border-white/20 dark:border-zinc-700/30 shadow-lg z-10"
          >
            {/* Type Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Tipo
              </label>
              <select
                value={filters.type || ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    type: (e.target.value ||
                      undefined) as ProjectFilters["type"],
                  })
                }
                className="w-full px-3 py-2 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-zinc-700/50 border border-white/30 dark:border-zinc-600/30 text-zinc-800 dark:text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 [&>option]:bg-white [&>option]:dark:bg-zinc-800 [&>option]:text-zinc-800 [&>option]:dark:text-zinc-200"
              >
                <option value="">Todos os tipos</option>
                {PROJECT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* State Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Estado
              </label>
              <select
                value={filters.state || ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    state: e.target.value || undefined,
                  })
                }
                className="w-full px-3 py-2 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-zinc-700/50 border border-white/30 dark:border-zinc-600/30 text-zinc-800 dark:text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 [&>option]:bg-white [&>option]:dark:bg-zinc-800 [&>option]:text-zinc-800 [&>option]:dark:text-zinc-200"
              >
                <option value="">Todos os estados</option>
                {ESTADOS_BRASILEIROS.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Cidade
              </label>
              <input
                type="text"
                placeholder="Digite a cidade..."
                value={filters.city || ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    city: e.target.value || undefined,
                  })
                }
                className="w-full px-3 py-2 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-zinc-700/50 border border-white/30 dark:border-zinc-600/30 text-zinc-800 dark:text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Status
              </label>
              <select
                value={filters.status || ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    status: (e.target.value ||
                      undefined) as ProjectFilters["status"],
                  })
                }
                className="w-full px-3 py-2 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-zinc-700/50 border border-white/30 dark:border-zinc-600/30 text-zinc-800 dark:text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 [&>option]:bg-white [&>option]:dark:bg-zinc-800 [&>option]:text-zinc-800 [&>option]:dark:text-zinc-200"
              >
                <option value="">Todos</option>
                <option value="open">Abertos</option>
                <option value="closed">Fechados</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Projects() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  // Filters state
  const [filters, setFilters] = useState<ProjectFilters>({
    status: "open", // Default to open projects
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Initialize filters from URL
  useEffect(() => {
    const urlFilters: ProjectFilters = { status: "open" };

    if (searchParams.get("type"))
      urlFilters.type = searchParams.get("type") as ProjectFilters["type"];
    if (searchParams.get("state"))
      urlFilters.state = searchParams.get("state") || undefined;
    if (searchParams.get("city"))
      urlFilters.city = searchParams.get("city") || undefined;
    if (searchParams.get("status"))
      urlFilters.status = searchParams.get(
        "status"
      ) as ProjectFilters["status"];
    if (searchParams.get("search")) {
      urlFilters.search = searchParams.get("search") || undefined;
      setSearchTerm(searchParams.get("search") || "");
    }

    setFilters(urlFilters);
  }, [searchParams]);

  // Update URL when filters change
  const updateUrl = useCallback(
    (newFilters: ProjectFilters, search?: string) => {
      const params = new URLSearchParams();

      if (newFilters.type) params.set("type", newFilters.type);
      if (newFilters.state) params.set("state", newFilters.state);
      if (newFilters.city) params.set("city", newFilters.city);
      if (newFilters.status && newFilters.status !== "open")
        params.set("status", newFilters.status);
      if (search) params.set("search", search);

      const queryString = params.toString();
      const newUrl = queryString ? `/projects?${queryString}` : "/projects";

      router.replace(newUrl, { scroll: false });
    },
    [router]
  );

  // Load projects
  const loadProjects = useCallback(
    async (isLoadMore = false) => {
      try {
        if (isLoadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
          setError(null);
        }

        const result = await listPublicProjects({
          filters: { ...filters, search: searchTerm || undefined },
          limit: 12,
          cursor: isLoadMore && lastDoc ? lastDoc : undefined,
        });

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
    [filters, searchTerm, lastDoc]
  );

  // Load projects when filters change
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const result = await listPublicProjects({
          filters: { ...filters, search: searchTerm || undefined },
          limit: 12,
        });

        setProjects(result.projects);
        setHasMore(result.hasMore);
        setLastDoc(result.lastDoc || null);
      } catch (err) {
        console.error("Error loading projects:", err);
        setError("Erro ao carregar projetos. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [filters, searchTerm]);

  // Handle search
  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value);
      updateUrl(filters, value);
    },
    [filters, updateUrl]
  );

  // Handle filters change
  const handleFiltersChange = useCallback(
    (newFilters: ProjectFilters) => {
      setFilters(newFilters);
      updateUrl(newFilters, searchTerm);
    },
    [searchTerm, updateUrl]
  );

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      loadProjects(true);
    }
  }, [loadProjects, loadingMore, hasMore]);

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

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar projetos..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg backdrop-blur-md bg-white/50 dark:bg-zinc-800/50 border border-white/30 dark:border-zinc-700/30 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 hover:backdrop-blur-xl hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-all duration-300"
              />
            </div>

            {/* Filters */}
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              isOpen={filtersOpen}
              onToggle={() => setFiltersOpen(!filtersOpen)}
            />
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
              Nenhum projeto encontrado com os filtros selecionados.
            </div>
            <SecondaryButton
              onClick={() => {
                setFilters({ status: "open" });
                setSearchTerm("");
                updateUrl({ status: "open" }, "");
              }}
            >
              Limpar Filtros
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
