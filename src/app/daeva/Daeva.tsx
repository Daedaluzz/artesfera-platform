"use client";

import { motion } from "framer-motion";
import {
  Brain,
  MessageCircle,
  FileText,
  Handshake,
  Lightbulb,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Daeva() {
  return (
    <main className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="relative p-4 rounded-[20px] backdrop-blur-[15px] bg-white/[0.25] dark:bg-black/25 border border-white/[0.3] dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.05)]">
              <Brain className="w-8 h-8 text-brand-navy-blue dark:text-brand-yellow" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-brand-black dark:text-brand-white mb-6">
            Daeva{" "}
            <span className="text-brand-navy-blue dark:text-brand-yellow">
              AI
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-brand-black/80 dark:text-brand-white/80 max-w-3xl mx-auto leading-relaxed">
            Sua assistente de IA especializada no mercado cultural brasileiro.
            Criada para conectar artistas e oportunidades de forma inteligente.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="relative p-6 rounded-[20px] backdrop-blur-[15px] bg-white/[0.25] dark:bg-black/25 border border-white/[0.3] dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.05)]">
              <h2 className="text-2xl font-bold font-serif text-brand-black dark:text-brand-white mb-6">
                Converse com a Daeva
              </h2>

              {/* Chat Messages */}
              <div className="space-y-4 mb-6 h-96 overflow-y-auto">
                {/* Daeva Message */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-brand-navy-blue/20 dark:bg-brand-yellow/20 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-brand-navy-blue dark:text-brand-yellow" />
                  </div>
                  <div className="flex-1 p-3 rounded-xl backdrop-blur-lg bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1]">
                    <p className="text-brand-black dark:text-brand-white text-sm">
                      Olá! Sou a Daeva, sua assistente especializada em cultura.
                      Como posso ajudá-lo hoje?
                    </p>
                  </div>
                </div>

                {/* User Message */}
                <div className="flex items-start space-x-3 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-brand-blue" />
                  </div>
                  <div className="flex-1 p-3 rounded-xl backdrop-blur-lg bg-brand-navy-blue/10 dark:bg-brand-yellow/10 border border-brand-navy-blue/20 dark:border-brand-yellow/20">
                    <p className="text-brand-black dark:text-brand-white text-sm">
                      Estou procurando projetos de música clássica em São Paulo.
                    </p>
                  </div>
                </div>

                {/* Daeva Response */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-brand-navy-blue/20 dark:bg-brand-yellow/20 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-brand-navy-blue dark:text-brand-yellow" />
                  </div>
                  <div className="flex-1 p-3 rounded-xl backdrop-blur-lg bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1]">
                    <p className="text-brand-black dark:text-brand-white text-sm">
                      Ótimo! Encontrei 3 projetos de música clássica em São
                      Paulo para você:
                      <br />• Orquestra Sinfônica Municipal - Solista
                      <br />• Festival de Inverno de Campos do Jordão
                      <br />• Concerto de Gala no Teatro Municipal
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-4 py-3 rounded-xl backdrop-blur-lg bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] text-brand-black dark:text-brand-white placeholder:text-brand-black/60 dark:placeholder:text-brand-white/60 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/50 dark:focus:ring-brand-yellow/50"
                />
                <Button variant="default" size="default">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Features & Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Daeva Image */}
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 rounded-[30px] backdrop-blur-[15px] bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)] overflow-hidden p-6">
                <div className="relative w-full h-full rounded-[20px] overflow-hidden">
                  <Image
                    src="/images/daeva.webp"
                    alt="Daeva AI - Assistente especializada em cultura"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: Brain,
                  title: "Match Inteligente",
                  description:
                    "Conecta artistas e projetos com IA especializada",
                },
                {
                  icon: FileText,
                  title: "Análise de Editais",
                  description: "Interpreta editais públicos e privados",
                },
                {
                  icon: Handshake,
                  title: "Contratos",
                  description: "Gera e revisa contratos personalizados",
                },
                {
                  icon: Lightbulb,
                  title: "Apresentações",
                  description: "Cria apresentações profissionais",
                },
              ].map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className="relative p-4 rounded-[15px] backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.08),inset_0_0_20px_10px_rgba(255,255,255,0.03)] transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-8 h-8 mb-3 relative">
                      <div className="absolute inset-0 bg-brand-navy-blue/20 dark:bg-brand-yellow/20 rounded-lg backdrop-blur-sm" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-brand-navy-blue dark:text-brand-yellow" />
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-brand-black dark:text-brand-white mb-2 font-serif">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-brand-black/70 dark:text-brand-white/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
