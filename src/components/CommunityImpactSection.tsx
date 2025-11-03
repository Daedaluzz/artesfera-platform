"use client";

import { motion } from "framer-motion";
import {
  UserPlus,
  Search,
  Send,
  CheckCircle,
  PlayCircle,
  ArrowRight,
  FileText,
  Users,
} from "lucide-react";

const gettingStartedSteps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Crie seu Perfil",
    description:
      "Cadastre-se gratuitamente e monte seu perfil profissional completo com portfolio, habilidades e experiências.",
    tip: "Dica: Perfis completos têm 3x mais chances de serem selecionados",
  },
  {
    icon: Search,
    number: "02",
    title: "Explore Oportunidades",
    description:
      "Navegue por projetos, editais e oportunidades que se alinham com seu perfil e interesses artísticos.",
    tip: "Use filtros inteligentes para encontrar matches perfeitos",
  },
  {
    icon: Send,
    number: "03",
    title: "Candidate-se",
    description:
      "Envie suas candidaturas de forma simples e acompanhe o status em tempo real através do dashboard.",
    tip: "Personalize cada candidatura para aumentar suas chances",
  },
  {
    icon: CheckCircle,
    number: "04",
    title: "Conecte e Colabore",
    description:
      "Após aprovação, conecte-se diretamente com contratantes e inicie colaborações transformadoras.",
    tip: "Mantenha comunicação ativa para construir relacionamentos duradouros",
  },
];

const platformGuides = [
  {
    icon: FileText,
    title: "Para Profissionais Criativos",
    description:
      "Aprenda a otimizar seu perfil, encontrar oportunidades ideais e se destacar no mercado cultural.",
    features: [
      "Otimização de perfil",
      "Networking estratégico",
      "Portfolio digital",
      "Gestão de candidaturas",
    ],
  },
  {
    icon: Users,
    title: "Para Empresas e Produtoras",
    description:
      "Descubra como encontrar talentos excepcionais e gerenciar processos seletivos eficientes.",
    features: [
      "Publicação de projetos",
      "Triagem inteligente",
      "Gestão de candidatos",
      "Avaliação de portfólios",
    ],
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
            Como
            <span className="text-brand-navy-blue dark:text-brand-yellow">
              Começar
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-lg sm:text-xl text-brand-black/80 dark:text-brand-white/80 max-w-3xl mx-auto"
          >
            Siga estes passos simples para começar sua jornada na ArtEsfera e
            conectar-se com oportunidades que transformam carreiras.
          </motion.p>
        </motion.div>

        {/* Getting Started Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20"
        >
          {gettingStartedSteps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="p-8 rounded-[20px] backdrop-blur-[15px] bg-white/15 dark:bg-black/15 border border-white/30 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-2 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent">
                  <div className="flex items-start mb-4">
                    {/* Step Number */}
                    <div className="w-12 h-12 rounded-xl backdrop-blur-sm bg-brand-navy-blue/20 dark:bg-brand-yellow/20 border border-brand-navy-blue/30 dark:border-brand-yellow/30 flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-sm font-bold text-brand-navy-blue dark:text-brand-yellow">
                        {step.number}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl backdrop-blur-sm bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20 flex items-center justify-center ml-auto">
                      <IconComponent className="w-6 h-6 text-brand-navy-blue dark:text-brand-yellow" />
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-brand-black dark:text-brand-white mb-3 group-hover:text-brand-navy-blue dark:group-hover:text-brand-yellow transition-colors duration-300">
                    {step.title}
                  </h3>

                  <p className="text-brand-black/70 dark:text-brand-white/70 leading-relaxed mb-4">
                    {step.description}
                  </p>

                  <div className="flex items-center text-sm text-brand-navy-blue dark:text-brand-yellow">
                    <PlayCircle className="w-4 h-4 mr-2" />
                    <span className="font-medium">{step.tip}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Platform Guides */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {platformGuides.map((guide, index) => {
            const IconComponent = guide.icon;
            return (
              <motion.div
                key={guide.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="p-8 rounded-[24px] backdrop-blur-[15px] bg-white/20 dark:bg-black/20 border border-white/40 dark:border-white/25 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.2)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/80 before:to-transparent">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 rounded-xl backdrop-blur-sm bg-brand-navy-blue/20 dark:bg-brand-yellow/20 border border-brand-navy-blue/30 dark:border-brand-yellow/30 flex items-center justify-center mr-4">
                      <IconComponent className="w-7 h-7 text-brand-navy-blue dark:text-brand-yellow" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-black dark:text-brand-white group-hover:text-brand-navy-blue dark:group-hover:text-brand-yellow transition-colors duration-300">
                      {guide.title}
                    </h3>
                  </div>

                  <p className="text-brand-black/80 dark:text-brand-white/80 leading-relaxed mb-6">
                    {guide.description}
                  </p>

                  <div className="space-y-2">
                    {guide.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <ArrowRight className="w-4 h-4 text-brand-navy-blue dark:text-brand-yellow mr-3 flex-shrink-0" />
                        <span className="text-brand-black/70 dark:text-brand-white/70 text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
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
