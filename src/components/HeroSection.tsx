"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden flex items-center justify-center min-h-screen px-4 py-8 -mx-4 sm:-mx-6 lg:-mx-8 -my-4 sm:-my-6 lg:-my-8 rounded-[20px] backdrop-blur-[15px] bg-white/[0.37] dark:bg-black/30 border border-white/15 dark:border-black/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.15),inset_1px_0_0_rgba(255,255,255,0.2),inset_-1px_0_0_rgba(255,255,255,0.1),0_8px_64px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.2),inset_1px_0_0_rgba(255,255,255,0.3),inset_-1px_0_0_rgba(255,255,255,0.15),0_8px_64px_rgba(0,0,0,0.12)]">
      {/* Simplified Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 right-16 w-3 h-3 bg-brand-yellow/60 rounded-full"
          animate={{ y: [0, -15, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-24 left-20 w-2 h-2 bg-brand-orange/50 rounded-full"
          animate={{ y: [0, -12, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 1.5 }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-serif text-brand-black dark:text-brand-white leading-tight"
              >
                Onde a Arte <br className="hidden sm:inline" />
                Encontra{" "}
                <span className="text-brand-navy-blue dark:text-brand-yellow">
                  Oportunidades
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                className="text-lg sm:text-xl lg:text-2xl text-brand-black/80 dark:text-brand-white/80 leading-relaxed max-w-2xl"
              >
                A plataforma revolucionária que conecta
                <span className="font-medium text-brand-navy-blue dark:text-brand-yellow">
                  {" "}
                  artistas talentosos
                </span>{" "}
                com
                <span className="font-medium text-brand-navy-blue dark:text-brand-yellow">
                  {" "}
                  empresas inovadoras
                </span>{" "}
                do setor cultural.
                <span className="block mt-3 text-brand-black/70 dark:text-brand-white/70">
                  Criamos conexões inteligentes que transformam paixão em
                  profissão e ideias criativas em projetos de sucesso.
                </span>
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-brand-navy-blue dark:bg-brand-yellow rounded-full" />
                  <span className="text-brand-black/70 dark:text-brand-white/70">
                    Conexões Inteligentes
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-brand-navy-blue dark:bg-brand-yellow rounded-full" />
                  <span className="text-brand-black/70 dark:text-brand-white/70">
                    Ecossistema Cultural
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-brand-navy-blue dark:bg-brand-yellow rounded-full" />
                  <span className="text-brand-black/70 dark:text-brand-white/70">
                    Projetos Únicos
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-brand-navy-blue dark:bg-brand-yellow rounded-full" />
                  <span className="text-brand-black/70 dark:text-brand-white/70">
                    Talentos Verificados
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Glassmorphic frame */}
              <div className="absolute inset-0 rounded-[30px] backdrop-blur-[15px] bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05)] overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent after:content-[''] after:absolute after:top-0 after:left-0 after:w-px after:h-full after:bg-gradient-to-b after:from-white/60 after:via-transparent after:to-white/20 p-6">
                <div className="relative w-full h-full rounded-[20px] overflow-hidden">
                  <Image
                    src="/images/placeholder.webp"
                    alt="ArtEsfera: Onde a arte encontra oportunidades - Plataforma que conecta artistas e empresas culturais"
                    fill
                    className="object-cover"
                    priority
                  />

                  {/* Overlay for better integration */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-blue/20 dark:from-brand-yellow/20 via-transparent to-transparent" />
                </div>
              </div>

              {/* Floating elements around the image */}
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 bg-brand-navy-blue/20 dark:bg-brand-yellow/20 rounded-full backdrop-blur-sm border border-brand-navy-blue/30 dark:border-brand-yellow/30"
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-6 -left-6 w-6 h-6 bg-brand-orange/20 rounded-full backdrop-blur-sm"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
