"use client";

import { motion } from "framer-motion";
import { Users, Briefcase, Image, Zap } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Conecte-se com Artistas",
    description:
      "Encontre talentos criativos para seus projetos. Nossa plataforma conecta empresas e profissionais do mundo da arte e cultura.",
  },
  {
    icon: Briefcase,
    title: "Projetos Exclusivos",
    description:
      "Acesse oportunidades únicas no mercado artístico. Empresas publicam projetos esperando pelo seu talento.",
  },
  {
    icon: Image,
    title: "Portfólio Profissional",
    description:
      "Exiba seus trabalhos de forma elegante. Crie um portfólio que destaque sua identidade artística e conquiste clientes.",
  },
  {
    icon: Zap,
    title: "Match Inteligente",
    description:
      "Nossa tecnologia conecta perfis compatíveis automaticamente, facilitando parcerias que realmente funcionam.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-32 h-32 bg-brand-blue/10 rounded-full blur-3xl opacity-60 animate-pulse" />
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-brand-pink/8 rounded-full blur-2xl opacity-50 animate-pulse delay-1000" />
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
            Por que escolher a ArtEsfera?
          </h2>
          <p className="text-lg sm:text-xl text-brand-black/80 dark:text-brand-white/80 max-w-3xl mx-auto">
            A primeira plataforma brasileira que conecta artistas e empresas do
            setor cultural de forma inteligente e eficaz.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative p-6 rounded-[20px] backdrop-blur-[15px] bg-white/[0.25] dark:bg-black/25 border border-white/[0.3] dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.15),inset_0_0_20px_10px_rgba(255,255,255,0.15)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/80 before:to-transparent after:content-[''] after:absolute after:top-0 after:left-0 after:w-px after:h-full after:bg-gradient-to-b after:from-white/80 after:via-transparent after:to-white/30">
                  <div className="relative z-10">
                    <div className="w-12 h-12 mb-4 relative">
                      <div className="absolute inset-0 bg-brand-navy-blue/20 dark:bg-brand-yellow/20 rounded-xl backdrop-blur-sm" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-brand-navy-blue dark:text-brand-yellow" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-brand-black dark:text-brand-white mb-3 font-serif">
                      {feature.title}
                    </h3>
                    <p className="text-brand-black/70 dark:text-brand-white/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
