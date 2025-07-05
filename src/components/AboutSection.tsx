"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="relative p-8 sm:p-12 lg:p-16 rounded-[30px] backdrop-blur-[15px] bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05)] overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent after:content-[''] after:absolute after:top-0 after:left-0 after:w-px after:h-full after:bg-gradient-to-b after:from-white/60 after:via-transparent after:to-white/20">
            <div className="relative z-10 max-w-4xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-brand-black dark:text-brand-white mb-8"
              >
                Conectando{" "}
                <span className="text-brand-navy-blue dark:text-brand-yellow">
                  Arte
                </span>{" "}
                e{" "}
                <span className="text-brand-navy-blue dark:text-brand-yellow">
                  Oportunidades
                </span>
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                viewport={{ once: true }}
                className="space-y-6 text-lg sm:text-xl text-brand-black/80 dark:text-brand-white/80 leading-relaxed"
              >
                <p>
                  A{" "}
                  <strong className="text-brand-navy-blue dark:text-brand-yellow">
                    ArtEsfera
                  </strong>{" "}
                  é a primeira plataforma brasileira que conecta artistas
                  talentosos com empresas e organizações que valorizam a cultura
                  e a criatividade.
                </p>

                <p>
                  Nossa missão é democratizar o acesso ao mercado cultural,
                  criando um ecossistema onde artistas podem encontrar{" "}
                  <span className="font-medium text-brand-navy-blue dark:text-brand-yellow">
                    projetos remunerados
                  </span>
                  , desenvolver suas carreiras e contribuir para um cenário
                  artístico mais diverso e inclusivo no Brasil.
                </p>

                <p>
                  Com o apoio da nossa IA{" "}
                  <span className="font-medium text-brand-navy-blue dark:text-brand-yellow">
                    Daeva.AI
                  </span>
                  , facilitamos conexões inteligentes entre talentos e
                  oportunidades, garantindo que cada projeto encontre o artista
                  ideal e vice-versa.
                </p>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/20 dark:border-white/10"
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-brand-navy-blue dark:text-brand-yellow mb-2">
                    1000+
                  </div>
                  <div className="text-sm sm:text-base text-brand-black/60 dark:text-brand-white/60">
                    Artistas Conectados
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-brand-navy-blue dark:text-brand-yellow mb-2">
                    500+
                  </div>
                  <div className="text-sm sm:text-base text-brand-black/60 dark:text-brand-white/60">
                    Projetos Realizados
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-brand-navy-blue dark:text-brand-yellow mb-2">
                    200+
                  </div>
                  <div className="text-sm sm:text-base text-brand-black/60 dark:text-brand-white/60">
                    Empresas Parceiras
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative background elements */}
            <div className="absolute top-8 right-8 w-2 h-2 bg-brand-orange/40 rounded-full animate-pulse" />
            <div
              className="absolute bottom-12 left-12 w-3 h-3 bg-brand-yellow/30 rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
