"use client";

import { motion } from "framer-motion";
import { UserPlus, Search, MessageCircle, Handshake } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Crie seu Perfil",
    description:
      "Artistas criam portfólios impressionantes. Empresas detalham seus projetos e necessidades.",
  },
  {
    icon: Search,
    number: "02",
    title: "Explore Oportunidades",
    description:
      "Navegue por projetos disponíveis ou descubra talentos que se alinham com sua visão criativa.",
  },
  {
    icon: MessageCircle,
    number: "03",
    title: "Conecte-se",
    description:
      "Nosso sistema de match inteligente conecta perfis compatíveis. Inicie conversas significativas.",
  },
  {
    icon: Handshake,
    number: "04",
    title: "Colabore",
    description:
      "Transforme conexões em parcerias reais. Desenvolva projetos únicos e construa relacionamentos duradouros.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Glass Container */}
      <div className="absolute inset-4 rounded-[20px] backdrop-blur-[15px] bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)]" />

      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-20 w-24 h-24 bg-brand-orange/15 rounded-full blur-2xl opacity-70 animate-pulse delay-500" />
        <div className="absolute bottom-1/3 left-16 w-36 h-36 bg-brand-green/10 rounded-full blur-3xl opacity-60 animate-pulse delay-1500" />
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
            Como Funciona
          </h2>
          <p className="text-lg sm:text-xl text-brand-black/80 dark:text-brand-white/80 max-w-3xl mx-auto">
            Quatro passos simples para conectar arte e negócios de forma
            revolucionária.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4 group"
                >
                  <div className="flex-shrink-0">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 rounded-2xl backdrop-blur-sm bg-brand-navy-blue/20 dark:bg-brand-yellow/20 border border-brand-navy-blue/30 dark:border-brand-yellow/30" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-brand-navy-blue dark:text-brand-yellow" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand-navy-blue dark:bg-brand-yellow rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-brand-black dark:text-brand-white">
                          {step.number}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-brand-black dark:text-brand-white mb-2 font-serif group-hover:text-brand-navy-blue dark:group-hover:text-brand-yellow transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-brand-black/70 dark:text-brand-white/70 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative w-full max-w-md mx-auto">
              {/* Main Circle */}
              <div className="w-80 h-80 rounded-full backdrop-blur-[20px] bg-white/20 dark:bg-black/20 border border-white/40 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05)] flex items-center justify-center relative overflow-hidden">
                {/* Animated particles */}
                <motion.div
                  className="absolute w-3 h-3 bg-brand-yellow/60 rounded-full"
                  animate={{
                    x: [0, 50, 0, -50, 0],
                    y: [0, -30, 0, 30, 0],
                    opacity: [0.4, 0.8, 0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute w-2 h-2 bg-brand-blue/50 rounded-full"
                  animate={{
                    x: [0, -40, 0, 40, 0],
                    y: [0, 40, 0, -40, 0],
                    opacity: [0.3, 0.7, 0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                />
                <motion.div
                  className="absolute w-4 h-4 bg-brand-orange/40 rounded-full"
                  animate={{
                    x: [0, 30, 0, -30, 0],
                    y: [0, -20, 0, 20, 0],
                    opacity: [0.2, 0.6, 0.2, 0.6, 0.2],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  }}
                />

                {/* Center Text */}
                <div className="text-center z-10">
                  <h3 className="text-2xl font-bold text-brand-black dark:text-brand-white mb-2 font-serif">
                    ArtEsfera
                  </h3>
                  <p className="text-brand-black/70 dark:text-brand-white/70 text-sm">
                    Conectando Talentos
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
