"use client";
import { motion } from "framer-motion";
import {
  Users,
  Sparkles,
  Ticket,
  GraduationCap,
  Handshake,
} from "lucide-react";

export default function EcosystemFeaturesSection() {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-center"
        >
          <FeatureCard
            icon={
              <Users className="w-8 h-8 text-brand-navy-blue dark:text-brand-yellow" />
            }
            title="Comunidade & Mentoria"
            description="Rede de apoio, networking e mentorias para artistas e gestores culturais."
          />
          <FeatureCard
            icon={
              <Sparkles className="w-8 h-8 text-brand-navy-blue dark:text-brand-yellow" />
            }
            title="Daeva.AI"
            description="IA para revisão de contratos, editais, propostas e apoio jurídico-cultural."
          />
          <FeatureCard
            icon={
              <Ticket className="w-8 h-8 text-brand-navy-blue dark:text-brand-yellow" />
            }
            title="Ticketeria Acessível"
            description="Venda de ingressos com taxas justas e suporte ao artista."
          />
          <FeatureCard
            icon={
              <GraduationCap className="w-8 h-8 text-brand-navy-blue dark:text-brand-yellow" />
            }
            title="Cursos & Certificações"
            description="Capacitação e certificação para profissionalização do setor cultural."
          />
          <FeatureCard
            icon={
              <Handshake className="w-8 h-8 text-brand-navy-blue dark:text-brand-yellow" />
            }
            title="Matchmaking Inteligente"
            description="Conexão entre negócios, projetos e profissionais da arte e cultura."
          />
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center glassmorphic-card p-6 rounded-2xl shadow-lg border border-white/30 dark:border-white/10 backdrop-blur-lg bg-white/30 dark:bg-black/20"
    >
      <div className="mb-4">{icon}</div>
      <div className="font-bold text-lg text-brand-navy-blue dark:text-brand-yellow mb-2">
        {title}
      </div>
      <div className="text-sm text-brand-black/80 dark:text-brand-white/80">
        {description}
      </div>
    </motion.div>
  );
}
