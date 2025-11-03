"use client";

import { motion } from "framer-motion";
import EcosystemFeaturesSection from "./EcosystemFeaturesSection";

export default function AboutSection() {
  return (
    <>
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8" data-section="about">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="relative p-8 sm:p-12 lg:p-16 rounded-[30px] backdrop-blur-[15px] bg-white/[0.3] dark:bg-black/25 border border-white/[0.3] dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.06)] overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/80 before:to-transparent after:content-[''] after:absolute after:top-0 after:left-0 after:w-px after:h-full after:bg-gradient-to-b after:from-white/80 after:via-transparent after:to-white/30">
              <div className="relative z-10 max-w-4xl mx-auto">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-brand-black dark:text-brand-white mb-8"
                >
                  ArtEsfera: Ecossistema de Apoio, Profissionalização e
                  Oportunidades para Arte e Cultura
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
                    é o primeiro ecossistema brasileiro dedicado a apoiar,
                    democratizar e profissionalizar o mercado de arte e cultura.
                    Nossa missão é criar um ambiente onde artistas,
                    profissionais, empresas e organizações culturais possam
                    crescer juntos, impulsionando a criatividade e o impacto
                    social.
                  </p>
                  <p>
                    Mais do que matchmaking, oferecemos ferramentas e recursos
                    para todas as etapas da jornada artística:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-left mx-auto max-w-2xl">
                    <li>
                      <span className="font-semibold text-brand-navy-blue dark:text-brand-yellow">
                        Matchmaking Inteligente:
                      </span>{" "}
                      Conexão entre negócios, projetos e profissionais da arte e
                      cultura, facilitando parcerias e oportunidades reais.
                    </li>
                    <li>
                      <span className="font-semibold text-brand-navy-blue dark:text-brand-yellow">
                        Daeva.AI:
                      </span>{" "}
                      Assistente IA para revisão e explicação de editais
                      públicos, propostas, contratos e apoio jurídico-cultural.
                    </li>
                    <li>
                      <span className="font-semibold text-brand-navy-blue dark:text-brand-yellow">
                        Ticketeria Acessível:
                      </span>{" "}
                      Plataforma para divulgação e venda de ingressos de eventos
                      culturais, com taxas justas e suporte ao artista.
                    </li>
                    <li>
                      <span className="font-semibold text-brand-navy-blue dark:text-brand-yellow">
                        Cursos & Certificações:
                      </span>{" "}
                      Capacitação, formação e certificação para
                      profissionalização de artistas e gestores culturais.
                    </li>
                    <li>
                      <span className="font-semibold text-brand-navy-blue dark:text-brand-yellow">
                        Comunidade & Mentoria:
                      </span>{" "}
                      Espaço para troca de experiências, mentorias, networking e
                      apoio mútuo entre profissionais do setor.
                    </li>
                  </ul>
                  <p>
                    Junte-se à ArtEsfera e faça parte de uma rede que valoriza,
                    apoia e transforma a arte e a cultura no Brasil!
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
      <EcosystemFeaturesSection />
    </>
  );
}
