"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Brain,
  FileText,
  Handshake,
  Lightbulb,
  Sparkles,
  Users,
} from "lucide-react";

const daevaFeatures = [
  {
    icon: Brain,
    title: "Match Perfeito",
    description:
      "IA treinada especificamente na cultura brasileira para conectar artistas e projetos com compatibilidade máxima.",
  },
  {
    icon: FileText,
    title: "Editais Públicos",
    description:
      "Compreende e ajuda na interpretação de editais públicos, facilitando o acesso a oportunidades governamentais.",
  },
  {
    icon: Handshake,
    title: "Contratos Inteligentes",
    description:
      "Gera e revisa contratos personalizados, garantindo proteção jurídica para artistas e empresas.",
  },
  {
    icon: Lightbulb,
    title: "Apresentações Profissionais",
    description:
      "Auxilia na criação de apresentações impactantes que destacam o valor único de cada projeto artístico.",
  },
];

export default function DaevaAISection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/5 w-40 h-40 bg-brand-navy-blue/10 dark:bg-brand-yellow/10 rounded-full blur-3xl opacity-60 animate-pulse" />
        <div className="absolute bottom-32 right-1/4 w-32 h-32 bg-brand-yellow/8 dark:bg-brand-navy-blue/8 rounded-full blur-2xl opacity-50 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-orange/5 rounded-full blur-3xl opacity-40 animate-pulse delay-500" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-[15px] bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05)]"
              >
                <Sparkles className="w-5 h-5 text-brand-navy-blue dark:text-brand-yellow" />
                <span className="text-sm font-medium text-brand-navy-blue dark:text-brand-yellow">
                  Powered by AI
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold font-serif text-brand-black dark:text-brand-white leading-tight"
              >
                Conheça a
                <span className="text-brand-navy-blue dark:text-brand-yellow">
                  Daeva.AI
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-lg sm:text-xl text-brand-black/80 dark:text-brand-white/80 leading-relaxed"
              >
                Nossa inteligência artificial especializada em arte e cultura
                brasileira. Daeva é treinada especificamente para compreender as
                nuances do mercado cultural nacional e potencializar conexões
                entre artistas e oportunidades.
              </motion.p>
            </div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {daevaFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="group p-6 rounded-[20px] backdrop-blur-[15px] bg-white/10 dark:bg-black/10 border border-white/30 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.15)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent after:content-[''] after:absolute after:top-0 after:left-0 after:w-px after:h-full after:bg-gradient-to-b after:from-white/60 after:via-transparent after:to-white/20"
                  >
                    <div className="relative z-10">
                      <div className="w-10 h-10 mb-4 relative">
                        <div className="absolute inset-0 bg-brand-navy-blue/20 dark:bg-brand-yellow/20 rounded-xl backdrop-blur-sm" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-brand-navy-blue dark:text-brand-yellow" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white mb-2 font-serif">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-brand-black/70 dark:text-brand-white/70 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Main Glassmorphic Frame */}
              <div className="absolute inset-0 rounded-[30px] backdrop-blur-[15px] bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05)] overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent after:content-[''] after:absolute after:top-0 after:left-0 after:w-px after:h-full after:bg-gradient-to-b after:from-white/60 after:via-transparent after:to-white/20 p-6">
                <div className="relative w-full h-full rounded-[20px] overflow-hidden">
                  <Image
                    src="/images/daeva.webp"
                    alt="Daeva.AI - Inteligência artificial especializada em arte e cultura brasileira"
                    fill
                    className="object-cover"
                    priority
                  />

                  {/* AI Glow Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-blue/30 dark:from-brand-yellow/30 via-transparent to-transparent" />

                  {/* AI Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full backdrop-blur-[15px] bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3)]">
                    <span className="text-xs font-medium text-brand-navy-blue dark:text-brand-yellow flex items-center gap-1">
                      <Brain className="w-3 h-3" />
                      AI
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating AI Elements */}
              <motion.div
                className="absolute -top-6 -left-6 w-12 h-12 rounded-xl backdrop-blur-[15px] bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3)] flex items-center justify-center"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Users className="w-6 h-6 text-brand-navy-blue dark:text-brand-yellow" />
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -right-4 w-10 h-10 rounded-lg backdrop-blur-[15px] bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3)] flex items-center justify-center"
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, -5, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <Sparkles className="w-5 h-5 text-brand-navy-blue dark:text-brand-yellow" />
              </motion.div>

              <motion.div
                className="absolute top-1/4 -right-8 w-8 h-8 rounded-full backdrop-blur-[15px] bg-white/15 dark:bg-black/15 border border-white/25 dark:border-white/15 shadow-[0_4px_16px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.3)] flex items-center justify-center"
                animate={{
                  x: [0, 8, 0],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
              >
                <div className="w-2 h-2 bg-brand-navy-blue dark:bg-brand-yellow rounded-full" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
