"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section
      className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8"
      data-section="about"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="relative p-8 sm:p-12 lg:p-16 rounded-[30px] backdrop-blur-[15px] bg-white/[0.3] dark:bg-black/25 border border-white/[0.3] dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.06)] overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/80 before:to-transparent after:absolute after:top-0 after:left-0 after:w-px after:h-full after:bg-gradient-to-b after:from-white/80 after:via-transparent after:to-white/30">
            <div className="relative z-10 max-w-4xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-brand-black dark:text-brand-white mb-8"
              >
                Como Funciona a ArtEsfera
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
                  é uma plataforma completa que conecta o universo artístico e
                  cultural brasileiro, oferecendo ferramentas profissionais para
                  transformar talento em oportunidades reais.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="p-6 rounded-2xl backdrop-blur-sm bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20">
                    <h3 className="font-semibold text-brand-navy-blue dark:text-brand-yellow mb-3 text-lg">
                      📋 Para Artistas e Profissionais Criativos:
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Crie seu perfil profissional completo</li>
                      <li>• Candidate-se a projetos e editais</li>
                      <li>• Acesse mentoria e capacitação</li>
                      <li>• Conecte-se com outros profissionais</li>
                    </ul>
                  </div>

                  <div className="p-6 rounded-2xl backdrop-blur-sm bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20">
                    <h3 className="font-semibold text-brand-navy-blue dark:text-brand-yellow mb-3 text-lg">
                      🏢 Para Empresas e Organizações:
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Publique projetos e oportunidades</li>
                      <li>• Encontre talentos qualificados</li>
                      <li>• Gerencie candidaturas e seleções</li>
                      <li>• Impacte positivamente a cultura</li>
                    </ul>
                  </div>
                </div>

                <p className="text-center mt-8 font-medium">
                  🚀 Transformamos conexões em colaborações que geram impacto
                  real no setor cultural brasileiro
                </p>
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
