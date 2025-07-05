"use client";

import { motion } from "framer-motion";
import { Award, BarChart3, Heart, TrendingUp, Users, Zap } from "lucide-react";

const impactStats = [
  {
    icon: Users,
    number: "10K+",
    label: "Artistas Conectados",
    description: "Profissionais da arte e cultura cadastrados na plataforma",
  },
  {
    icon: Zap,
    number: "2.5K",
    label: "Matches Realizados",
    description: "Conexões bem-sucedidas entre artistas e oportunidades",
  },
  {
    icon: Award,
    number: "850+",
    label: "Projetos Concluídos",
    description: "Colaborações finalizadas com sucesso através da ArtEsfera",
  },
  {
    icon: TrendingUp,
    number: "95%",
    label: "Taxa de Satisfação",
    description: "Usuários satisfeitos com as conexões realizadas",
  },
];

const communityHighlights = [
  {
    icon: Heart,
    title: "Comunidade Ativa",
    description:
      "Uma rede vibrante de artistas, produtores culturais e empresas que colaboram diariamente.",
    color: "from-pink-500/20 to-red-500/20",
  },
  {
    icon: BarChart3,
    title: "Crescimento Sustentável",
    description:
      "Impacto mensurável no desenvolvimento do setor cultural brasileiro através de dados e métricas.",
    color: "from-blue-500/20 to-purple-500/20",
  },
  {
    icon: Award,
    title: "Qualidade Garantida",
    description:
      "Processo de verificação rigoroso que assegura profissionais qualificados e oportunidades legítimas.",
    color: "from-green-500/20 to-emerald-500/20",
  },
];

export default function CommunityImpactSection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 right-1/6 w-36 h-36 bg-brand-yellow/8 dark:bg-brand-navy-blue/8 rounded-full blur-3xl opacity-60 animate-pulse" />
        <div className="absolute bottom-24 left-1/5 w-28 h-28 bg-brand-navy-blue/10 dark:bg-brand-yellow/10 rounded-full blur-2xl opacity-50 animate-pulse delay-1000" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-brand-black dark:text-brand-white mb-6"
          >
            Transformando o{" "}
            <span className="text-brand-navy-blue dark:text-brand-yellow">
              Cenário Cultural
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-lg sm:text-xl text-brand-black/80 dark:text-brand-white/80 max-w-3xl mx-auto"
          >
            Números que comprovam o impacto da ArtEsfera no fortalecimento do
            ecossistema artístico e cultural brasileiro.
          </motion.p>
        </motion.div>

        {/* Impact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {impactStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                viewport={{ once: true }}
                className="group text-center"
              >
                <div className="p-8 rounded-[20px] backdrop-blur-[15px] bg-white/15 dark:bg-black/15 border border-white/30 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.15)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] transition-all duration-300 hover:-translate-y-2 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent after:content-[''] after:absolute after:top-0 after:left-0 after:w-px after:h-full after:bg-gradient-to-b after:from-white/60 after:via-transparent after:to-white/20">
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-4 relative">
                      <div className="absolute inset-0 bg-brand-navy-blue/20 dark:bg-brand-yellow/20 rounded-2xl backdrop-blur-sm" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-brand-navy-blue dark:text-brand-yellow" />
                      </div>
                    </div>

                    <motion.div
                      initial={{ scale: 1 }}
                      whileInView={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.8, delay: 0.7 + index * 0.1 }}
                      viewport={{ once: true }}
                      className="text-3xl sm:text-4xl font-bold text-brand-navy-blue dark:text-brand-yellow mb-2"
                    >
                      {stat.number}
                    </motion.div>

                    <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white mb-2 font-serif">
                      {stat.label}
                    </h3>
                    <p className="text-sm text-brand-black/70 dark:text-brand-white/70 leading-relaxed">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Community Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {communityHighlights.map((highlight, index) => {
            const IconComponent = highlight.icon;
            return (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="p-8 rounded-[20px] backdrop-blur-[15px] bg-white/10 dark:bg-black/10 border border-white/30 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.15)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] transition-all duration-300 hover:-translate-y-2 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent after:content-[''] after:absolute after:top-0 after:left-0 after:w-px after:h-full after:bg-gradient-to-b after:from-white/60 after:via-transparent after:to-white/20">
                  {/* Background Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[20px]`}
                  />

                  <div className="relative z-10">
                    <div className="w-14 h-14 mb-6 relative">
                      <div className="absolute inset-0 bg-brand-navy-blue/20 dark:bg-brand-yellow/20 rounded-xl backdrop-blur-sm group-hover:bg-brand-navy-blue/30 dark:group-hover:bg-brand-yellow/30 transition-colors duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IconComponent className="w-7 h-7 text-brand-navy-blue dark:text-brand-yellow" />
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-brand-black dark:text-brand-white mb-3 font-serif">
                      {highlight.title}
                    </h3>
                    <p className="text-brand-black/70 dark:text-brand-white/70 leading-relaxed">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
