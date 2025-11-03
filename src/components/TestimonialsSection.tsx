"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Target,
  Users,
  TrendingUp,
  Heart,
  Brain,
  Palette,
  Handshake,
} from "lucide-react";

const platformTools = [
  {
    icon: Target,
    title: "Matchmaking Inteligente",
    description:
      "Conectamos artistas com oportunidades baseado em habilidades, localização e interesses mútuos.",
  },
  {
    icon: Brain,
    title: "Daeva.AI - Assistente Inteligente",
    description:
      "IA especializada para revisar editais, contratos e fornecer orientação jurídico-cultural.",
  },
  {
    icon: Users,
    title: "Networking Profissional",
    description:
      "Comunidade ativa de profissionais criativos, mentores e empresas do setor cultural.",
  },
  {
    icon: TrendingUp,
    title: "Capacitação Contínua",
    description:
      "Cursos, workshops e certificações para desenvolvimento de carreira no mercado criativo.",
  },
];

const platformBenefits = [
  {
    icon: Palette,
    title: "Para Artistas",
    features: [
      "Perfil profissional completo e portfólio integrado",
      "Candidaturas simplificadas para projetos e editais",
      "Ferramentas de gestão de carreira e networking",
      "Acesso a mentorias e oportunidades de capacitação",
    ],
  },
  {
    icon: Handshake,
    title: "Para Empresas",
    features: [
      "Encontre talentos qualificados rapidamente",
      "Gerencie seleções e processos de contratação",
      "Publique oportunidades com alcance direcionado",
      "Conecte-se com profissionais verificados",
    ],
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-1/3 w-40 h-40 bg-brand-pink/8 rounded-full blur-3xl opacity-60 animate-pulse" />
        <div className="absolute bottom-24 right-1/4 w-32 h-32 bg-brand-blue/12 rounded-full blur-2xl opacity-50 animate-pulse delay-1000" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-brand-black dark:text-brand-white mb-6">
            Ferramentas que Impulsionam Carreiras
          </h2>
          <p className="text-lg sm:text-xl text-brand-black/80 dark:text-brand-white/80 max-w-3xl mx-auto">
            Tecnologia desenvolvida especificamente para as necessidades do
            mercado cultural brasileiro.
          </p>
        </motion.div>

        {/* Platform Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {platformTools.map((tool, index) => {
            const IconComponent = tool.icon;
            return (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative p-6 rounded-[20px] backdrop-blur-[15px] bg-white/25 dark:bg-black/25 border border-white/30 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)] overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 rounded-xl backdrop-blur-sm bg-brand-navy-blue/20 dark:bg-brand-yellow/20 border border-brand-navy-blue/30 dark:border-brand-yellow/30 flex items-center justify-center mr-4 flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-brand-navy-blue dark:text-brand-yellow" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-brand-black dark:text-brand-white group-hover:text-brand-navy-blue dark:group-hover:text-brand-yellow transition-colors duration-300 mb-2">
                        {tool.title}
                      </h3>
                      <p className="text-brand-black/70 dark:text-brand-white/70 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Benefits Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {platformBenefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative p-8 rounded-[24px] backdrop-blur-[15px] bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/25 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.2)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)] overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/80 before:to-transparent">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 rounded-xl backdrop-blur-sm bg-brand-navy-blue/20 dark:bg-brand-yellow/20 border border-brand-navy-blue/30 dark:border-brand-yellow/30 flex items-center justify-center mr-4">
                      <IconComponent className="w-7 h-7 text-brand-navy-blue dark:text-brand-yellow" />
                    </div>
                    <h3 className="text-2xl font-bold text-brand-black dark:text-brand-white group-hover:text-brand-navy-blue dark:group-hover:text-brand-yellow transition-colors duration-300">
                      {benefit.title}
                    </h3>
                  </div>

                  <ul className="space-y-3">
                    {benefit.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Sparkles className="w-4 h-4 text-brand-navy-blue dark:text-brand-yellow mr-3 mt-1 flex-shrink-0" />
                        <span className="text-brand-black/80 dark:text-brand-white/80 leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16 p-8 rounded-[24px] backdrop-blur-[15px] bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20"
        >
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-brand-navy-blue dark:text-brand-yellow mr-3" />
            <h3 className="text-2xl font-bold text-brand-black dark:text-brand-white">
              Nossa Missão
            </h3>
          </div>
          <p className="text-lg text-brand-black/80 dark:text-brand-white/80 max-w-3xl mx-auto leading-relaxed">
            Democratizar o acesso a oportunidades no mercado cultural, criando
            um ecossistema onde o talento encontra reconhecimento e as empresas
            descobrem profissionais excepcionais que transformam projetos em
            arte.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
