"use client";

import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Briefcase,
  Award,
  Heart,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useState } from "react";

// Mock data for projects - more realistic and diverse
const projectsData = [
  {
    id: 1,
    title: "Festival de Arte Urbana 2025",
    company: "Prefeitura de São Paulo",
    category: "Artes Visuais",
    description:
      "Procuramos artistas visuais, grafiteiros e muralistas para participar do maior festival de arte urbana do Brasil. Oportunidade de expor seu trabalho para mais de 50 mil visitantes.",
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
    deadline: "15 de Agosto, 2025",
    location: "São Paulo, SP",
    salary: "R$ 8.000 - R$ 20.000",
    type: "Projeto Temporário",
    duration: "3 meses",
    positions: 15,
    applicants: 127,
    tags: ["Graffiti", "Muralismo", "Arte Urbana", "Exposição"],
    postedDate: "Há 2 dias",
    featured: true,
  },
  {
    id: 2,
    title: "Diretor Musical para Musical Broadway",
    company: "Teatro Municipal",
    category: "Música",
    description:
      "Buscamos diretor musical experiente para produção de musical inspirado em clássicos da Broadway. Responsável por arranjos, ensaios e direção da orquestra.",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
    deadline: "30 de Setembro, 2025",
    location: "Rio de Janeiro, RJ",
    salary: "R$ 15.000 - R$ 25.000",
    type: "Contrato",
    duration: "6 meses",
    positions: 1,
    applicants: 43,
    tags: ["Direção Musical", "Broadway", "Orquestra", "Teatro"],
    postedDate: "Há 5 dias",
    featured: true,
  },
  {
    id: 3,
    title: "Ilustradores para Livro Infantil",
    company: "Editora Estrela",
    category: "Design",
    description:
      "Editora procura ilustradores criativos para série de livros infantis. Projeto de longo prazo com possibilidade de continuidade em novos títulos.",
    image:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
    deadline: "20 de Agosto, 2025",
    location: "Remoto",
    salary: "R$ 5.000 - R$ 12.000",
    type: "Freelance",
    duration: "4 meses",
    positions: 3,
    applicants: 89,
    tags: ["Ilustração", "Livro Infantil", "Design Editorial", "Remoto"],
    postedDate: "Há 1 semana",
    featured: false,
  },
  {
    id: 4,
    title: "Coreógrafo para Espetáculo de Dança Contemporânea",
    company: "Cia. Corpo e Alma",
    category: "Dança",
    description:
      "Companhia de dança contemporânea busca coreógrafo para nova produção que explora temas de identidade e memória. Experiência com técnicas modernas é essencial.",
    image:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80",
    deadline: "10 de Setembro, 2025",
    location: "Belo Horizonte, MG",
    salary: "R$ 10.000 - R$ 18.000",
    type: "Projeto Temporário",
    duration: "5 meses",
    positions: 1,
    applicants: 34,
    tags: ["Coreografia", "Dança Contemporânea", "Espetáculo", "Produção"],
    postedDate: "Há 3 dias",
    featured: false,
  },
  {
    id: 5,
    title: "Fotógrafo para Exposição de Moda",
    company: "Fashion Week Brasil",
    category: "Fotografia",
    description:
      "Procuramos fotógrafo profissional para cobertura completa da Fashion Week Brasil 2025. Portfolio com trabalhos de moda é obrigatório.",
    image:
      "https://images.unsplash.com/photo-1492681290082-e932832941e6?w=800&q=80",
    deadline: "25 de Agosto, 2025",
    location: "São Paulo, SP",
    salary: "R$ 12.000 - R$ 22.000",
    type: "Evento",
    duration: "2 semanas",
    positions: 2,
    applicants: 156,
    tags: ["Fotografia", "Moda", "Evento", "Editorial"],
    postedDate: "Há 4 dias",
    featured: true,
  },
  {
    id: 6,
    title: "Escritor para Roteiro de Série Dramática",
    company: "StreamBR Produções",
    category: "Audiovisual",
    description:
      "Plataforma de streaming busca roteirista para desenvolver série dramática brasileira original. Experiência com roteiro televisivo é preferencial.",
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80",
    deadline: "5 de Outubro, 2025",
    location: "Remoto",
    salary: "R$ 18.000 - R$ 35.000",
    type: "Contrato",
    duration: "8 meses",
    positions: 2,
    applicants: 201,
    tags: ["Roteiro", "Série", "Drama", "Streaming", "Remoto"],
    postedDate: "Há 1 dia",
    featured: true,
  },
];

export default function Projects() {
  const [savedProjects, setSavedProjects] = useState<number[]>([]);

  const toggleSave = (projectId: number) => {
    setSavedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-brand-black dark:text-brand-white mb-6">
            Projetos{" "}
            <span className="text-brand-navy-blue dark:text-brand-yellow">
              Culturais
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-brand-black/80 dark:text-brand-white/80 max-w-3xl mx-auto leading-relaxed">
            Descubra oportunidades exclusivas no mercado cultural brasileiro.
            Conecte-se com empresas que valorizam arte e criatividade.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="relative p-6 rounded-[20px] backdrop-blur-[15px] bg-white/[0.2] dark:bg-black/20 border border-white/[0.3] dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)]">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-black/60 dark:text-brand-white/60" />
                <input
                  type="text"
                  placeholder="Buscar projetos..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl backdrop-blur-lg bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] text-brand-black dark:text-brand-white placeholder:text-brand-black/60 dark:placeholder:text-brand-white/60 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/50 dark:focus:ring-brand-yellow/50"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="default">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
                <Button variant="default" size="default">
                  Buscar
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Project Cards */}
          {projectsData.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="relative rounded-[20px] backdrop-blur-[15px] bg-white/[0.2] dark:bg-black/20 border border-white/[0.3] dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.15),inset_0_0_20px_10px_rgba(255,255,255,0.12)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.06)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-brand-orange text-brand-white border-0 shadow-lg">
                      <Award className="w-3 h-3 mr-1" />
                      Destaque
                    </Badge>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleSave(project.id)}
                    className="w-9 h-9 rounded-full backdrop-blur-lg bg-white/[0.3] dark:bg-black/[0.3] border border-white/[0.4] dark:border-white/[0.2] flex items-center justify-center hover:bg-white/[0.5] dark:hover:bg-black/[0.5] transition-all duration-300"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        savedProjects.includes(project.id)
                          ? "fill-brand-red text-brand-red"
                          : "text-brand-black dark:text-brand-white"
                      }`}
                    />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-9 h-9 rounded-full backdrop-blur-lg bg-white/[0.3] dark:bg-black/[0.3] border border-white/[0.4] dark:border-white/[0.2] flex items-center justify-center hover:bg-white/[0.5] dark:hover:bg-black/[0.5] transition-all duration-300"
                  >
                    <Share2 className="w-4 h-4 text-brand-black dark:text-brand-white" />
                  </motion.button>
                </div>

                {/* Project Image */}
                <div className="relative w-full h-48 overflow-hidden rounded-t-[20px]">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Posted Date */}
                  <div className="absolute bottom-3 left-3">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-black/40 backdrop-blur-md text-white rounded-full">
                      <Clock className="w-3 h-3 mr-1" />
                      {project.postedDate}
                    </span>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  {/* Company and Category */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-brand-navy-blue dark:text-brand-yellow" />
                      <span className="text-sm font-medium text-brand-black dark:text-brand-white">
                        {project.company}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-brand-navy-blue/10 dark:bg-brand-yellow/10 text-brand-navy-blue dark:text-brand-yellow border-brand-navy-blue/20 dark:border-brand-yellow/20"
                    >
                      {project.category}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-brand-black dark:text-brand-white mb-2 font-serif group-hover:text-brand-navy-blue dark:group-hover:text-brand-yellow transition-colors duration-300 line-clamp-2">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-brand-black/70 dark:text-brand-white/70 text-sm leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 text-xs font-medium bg-white/[0.3] dark:bg-white/[0.1] text-brand-black dark:text-brand-white rounded-md border border-white/[0.2] dark:border-white/[0.1]"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-white/[0.3] dark:bg-white/[0.1] text-brand-black dark:text-brand-white rounded-md border border-white/[0.2] dark:border-white/[0.1]">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Project Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4 p-3 rounded-xl bg-white/[0.2] dark:bg-white/[0.05]">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-brand-navy-blue dark:text-brand-yellow flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-brand-black/60 dark:text-brand-white/60">
                          Prazo
                        </p>
                        <p className="text-xs font-semibold text-brand-black dark:text-brand-white">
                          {project.deadline}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-brand-navy-blue dark:text-brand-yellow flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-brand-black/60 dark:text-brand-white/60">
                          Local
                        </p>
                        <p className="text-xs font-semibold text-brand-black dark:text-brand-white">
                          {project.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <DollarSign className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-brand-black/60 dark:text-brand-white/60">
                          Remuneração
                        </p>
                        <p className="text-xs font-semibold text-brand-green">
                          {project.salary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-brand-navy-blue dark:text-brand-yellow flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-brand-black/60 dark:text-brand-white/60">
                          Duração
                        </p>
                        <p className="text-xs font-semibold text-brand-black dark:text-brand-white">
                          {project.duration}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="flex items-center justify-between mb-4 text-xs text-brand-black/60 dark:text-brand-white/60">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>
                        {project.positions}{" "}
                        {project.positions === 1 ? "vaga" : "vagas"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{project.applicants} candidatos</span>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs bg-white/[0.1] dark:bg-white/[0.05]"
                    >
                      {project.type}
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      Ver Detalhes
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-brand-navy-blue dark:bg-brand-yellow text-brand-white dark:text-brand-black hover:bg-brand-navy-blue/90 dark:hover:bg-brand-yellow/90"
                    >
                      Candidatar-se
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button variant="default" size="lg">
            Carregar Mais Projetos
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
