"use client";

import { motion } from "framer-motion";
import { Search, Filter, Calendar, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Projects() {
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {/* Sample Project Cards */}
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div
              key={index}
              className="relative p-6 rounded-[20px] backdrop-blur-[15px] bg-white/[0.2] dark:bg-black/20 border border-white/[0.3] dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.15),inset_0_0_20px_10px_rgba(255,255,255,0.12)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.06)] transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
            >
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-brand-navy-blue/20 dark:bg-brand-yellow/20 text-brand-navy-blue dark:text-brand-yellow rounded-full">
                  Música
                </span>
              </div>

              <h3 className="text-xl font-semibold text-brand-black dark:text-brand-white mb-3 font-serif group-hover:text-brand-navy-blue dark:group-hover:text-brand-yellow transition-colors duration-300">
                Festival de Arte Urbana 2025
              </h3>

              <p className="text-brand-black/70 dark:text-brand-white/70 text-sm leading-relaxed mb-4">
                Procuramos artistas para participar do maior festival de arte
                urbana do Brasil.
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-brand-black/60 dark:text-brand-white/60">
                  <Calendar className="w-3 h-3 mr-2" />
                  Prazo: 15 de Agosto
                </div>
                <div className="flex items-center text-xs text-brand-black/60 dark:text-brand-white/60">
                  <MapPin className="w-3 h-3 mr-2" />
                  São Paulo, SP
                </div>
                <div className="flex items-center text-xs text-brand-black/60 dark:text-brand-white/60">
                  <DollarSign className="w-3 h-3 mr-2" />
                  R$ 5.000 - R$ 15.000
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                Ver Detalhes
              </Button>
            </div>
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
