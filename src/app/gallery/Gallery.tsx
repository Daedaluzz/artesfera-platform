"use client";

import { motion } from "framer-motion";

export default function Gallery() {
  return (
    <div className="py-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <div className="flex justify-center mb-6">
          <div className="relative p-4 rounded-[20px] backdrop-blur-[15px] bg-white/[0.25] dark:bg-black/25 border border-white/[0.3] dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.05)]">
            <svg
              className="w-8 h-8 text-brand-navy-blue dark:text-brand-yellow"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-brand-black dark:text-brand-white mb-6">
          Galeria{" "}
          <span className="text-brand-navy-blue dark:text-brand-yellow">
            ArtEsfera
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-brand-black/80 dark:text-brand-white/80 max-w-3xl mx-auto leading-relaxed">
          Descubra projetos incríveis, artistas talentosos e a diversidade
          criativa que move nossa comunidade
        </p>
      </motion.div>

      {/* Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-12"
      >
        <div className="relative p-6 rounded-[20px] backdrop-blur-[15px] bg-white/[0.2] dark:bg-black/20 border border-white/[0.3] dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)]">
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              "Todos",
              "Artes Visuais",
              "Música",
              "Teatro",
              "Dança",
              "Literatura",
              "Design",
              "Fotografia",
            ].map((filter) => (
              <motion.button
                key={filter}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-6 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.15)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.08)] text-brand-black dark:text-brand-white hover:text-brand-navy-blue dark:hover:text-brand-yellow font-medium transition-all duration-300 overflow-hidden before:content-[''] before:absolute before:top-[-2px] before:left-[-100%] before:w-full before:h-[calc(100%+4px)] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:transition-all before:duration-600 before:ease-in-out before:pointer-events-none before:z-10 hover:before:left-full hover:backdrop-blur-xl hover:bg-white/20 hover:translate-y-[-1px] dark:hover:bg-white/8 after:content-[''] after:absolute after:top-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/40 after:to-transparent"
              >
                <span className="relative z-10">{filter}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Gallery Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
      >
        {[...Array(9)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="group relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.15),inset_0_0_20px_10px_rgba(255,255,255,0.12)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(255,255,255,0.08),inset_0_0_20px_10px_rgba(255,255,255,0.06)] transition-all duration-300"
          >
            {/* Image Placeholder */}
            <div className="aspect-square bg-gradient-to-br from-brand-navy-blue/20 via-brand-blue/15 to-brand-yellow/20 dark:from-brand-yellow/20 dark:via-brand-blue/15 dark:to-brand-navy-blue/20 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                <span className="text-brand-black dark:text-brand-white font-semibold text-lg">
                  Obra {index + 1}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-brand-black dark:text-brand-white mb-2">
                Projeto Criativo {index + 1}
              </h3>
              <p className="text-brand-black/70 dark:text-brand-white/70 mb-4 text-sm leading-relaxed">
                Uma obra que representa a essência da criatividade e inovação
                artística.
              </p>

              {/* Artist Info */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-brand-navy-blue to-brand-blue dark:from-brand-yellow dark:to-brand-blue" />
                <span className="text-sm font-medium text-brand-black/80 dark:text-brand-white/80">
                  Artista {index + 1}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {["Arte", "Criatividade", "Inovação"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm bg-brand-navy-blue/10 dark:bg-brand-yellow/10 text-brand-navy-blue dark:text-brand-yellow border border-brand-navy-blue/20 dark:border-brand-yellow/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Glassmorphic edge highlight */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-white/40 via-transparent to-white/10" />
          </motion.div>
        ))}
      </motion.div>

      {/* Load More Button */}
      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="group relative px-8 py-4 rounded-[16px] backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.15),inset_0_0_20px_10px_rgba(255,255,255,0.12)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(255,255,255,0.08),inset_0_0_20px_10px_rgba(255,255,255,0.06)] text-brand-black dark:text-brand-white hover:text-brand-navy-blue dark:hover:text-brand-yellow font-semibold transition-all duration-300 overflow-hidden before:content-[''] before:absolute before:top-[-2px] before:left-[-100%] before:w-full before:h-[calc(100%+4px)] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:transition-all before:duration-600 before:ease-in-out before:pointer-events-none before:z-10 hover:before:left-full hover:backdrop-blur-xl hover:bg-white/20 hover:translate-y-[-1px] dark:hover:bg-white/8 after:content-[''] after:absolute after:top-0 after:left-0 after:w-px after:h-full after:bg-gradient-to-b after:from-white/40 after:via-transparent after:to-white/10"
        >
          <span className="relative z-10">Carregar Mais Obras</span>
        </motion.button>
      </div>
    </div>
  );
}
