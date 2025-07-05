"use client";

import { motion } from "framer-motion";
import { PrimaryButton } from "@/components/ui/primary-button";

export default function Contact() {
  return (
    <div className="py-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-brand-black dark:text-brand-white mb-6">
          Fale{" "}
          <span className="text-brand-navy-blue dark:text-brand-yellow">
            Conosco
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-brand-black/80 dark:text-brand-white/80 max-w-3xl mx-auto leading-relaxed">
          Tem uma dúvida, sugestão ou quer fazer parte da nossa comunidade?
          Estamos aqui para ajudar!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)] overflow-hidden"
        >
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full" />
          <div className="absolute top-4 left-0 w-px h-[calc(100%-2rem)] bg-gradient-to-b from-white/40 via-transparent to-white/10 rounded-full" />

          <h2 className="text-2xl font-bold text-brand-black dark:text-brand-white mb-6">
            Envie sua Mensagem
          </h2>

          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2"
                >
                  Nome
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2"
                >
                  Sobrenome
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300"
                  placeholder="Seu sobrenome"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2"
              >
                Assunto
              </label>
              <select
                id="subject"
                className="w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300 [&>option]:bg-white [&>option]:text-black dark:[&>option]:bg-brand-black dark:[&>option]:text-white"
              >
                <option
                  value=""
                  className="bg-white text-black dark:bg-brand-black dark:text-white"
                >
                  Selecione um assunto
                </option>
                <option
                  value="partnership"
                  className="bg-white text-black dark:bg-brand-black dark:text-white"
                >
                  Parceria
                </option>
                <option
                  value="support"
                  className="bg-white text-black dark:bg-brand-black dark:text-white"
                >
                  Suporte
                </option>
                <option
                  value="feedback"
                  className="bg-white text-black dark:bg-brand-black dark:text-white"
                >
                  Feedback
                </option>
                <option
                  value="press"
                  className="bg-white text-black dark:bg-brand-black dark:text-white"
                >
                  Imprensa
                </option>
                <option
                  value="other"
                  className="bg-white text-black dark:bg-brand-black dark:text-white"
                >
                  Outro
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2"
              >
                Mensagem
              </label>
              <textarea
                id="message"
                rows={6}
                className="w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300 resize-none"
                placeholder="Como podemos ajudar você?"
              />
            </div>

            <PrimaryButton fullWidth type="submit">
              Enviar Mensagem
            </PrimaryButton>
          </form>
        </motion.div>

        {/* Contact Info */}
        <div className="space-y-8">
          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)] overflow-hidden"
          >
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full" />
            <div className="absolute top-4 left-0 w-px h-[calc(100%-2rem)] bg-gradient-to-b from-white/40 via-transparent to-white/10 rounded-full" />

            <h2 className="text-2xl font-bold text-brand-black dark:text-brand-white mb-6">
              Outras Formas de Contato
            </h2>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-[12px] backdrop-blur-[10px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-brand-navy-blue dark:text-brand-yellow"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-brand-black dark:text-brand-white">
                    Email
                  </p>
                  <p className="text-brand-black/70 dark:text-brand-white/70">
                    contato@artesfera.com
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-[12px] backdrop-blur-[10px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-brand-navy-blue dark:text-brand-yellow"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-brand-black dark:text-brand-white">
                    WhatsApp
                  </p>
                  <p className="text-brand-black/70 dark:text-brand-white/70">
                    +55 (11) 9 9999-9999
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-[12px] backdrop-blur-[10px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-brand-navy-blue dark:text-brand-yellow"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-brand-black dark:text-brand-white">
                    Localização
                  </p>
                  <p className="text-brand-black/70 dark:text-brand-white/70">
                    São Paulo, Brasil
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)] overflow-hidden"
          >
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full" />
            <div className="absolute top-4 left-0 w-px h-[calc(100%-2rem)] bg-gradient-to-b from-white/40 via-transparent to-white/10 rounded-full" />

            <h2 className="text-2xl font-bold text-brand-black dark:text-brand-white mb-6">
              Perguntas Frequentes
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-brand-black dark:text-brand-white mb-2">
                  Como posso me cadastrar como artista?
                </h3>
                <p className="text-sm text-brand-black/70 dark:text-brand-white/70">
                  Clique em &ldquo;Cadastrar&rdquo; no menu superior e preencha
                  seus dados. É rápido e gratuito!
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-brand-black dark:text-brand-white mb-2">
                  Como funciona a conexão com empresas?
                </h3>
                <p className="text-sm text-brand-black/70 dark:text-brand-white/70">
                  Nossa plataforma usa IA para conectar artistas com empresas
                  baseado em interesses e necessidades.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-brand-black dark:text-brand-white mb-2">
                  A plataforma é gratuita?
                </h3>
                <p className="text-sm text-brand-black/70 dark:text-brand-white/70">
                  Sim! O cadastro e uso básico são totalmente gratuitos para
                  artistas e empresas.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
