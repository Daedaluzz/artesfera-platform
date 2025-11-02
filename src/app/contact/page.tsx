"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  MessageCircle, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  ArrowLeft
} from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { useRouter } from "next/navigation";

export default function ContactPage() {
  const router = useRouter();

  const handleEmailContact = () => {
    window.location.href = "mailto:contato@artesfera.com";
  };

  const handleWhatsAppContact = () => {
    window.open("https://wa.me/5511999999999", "_blank");
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-brand-black/60 dark:text-brand-white/60 hover:text-brand-navy-blue dark:hover:text-brand-yellow transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-brand-black dark:text-brand-white mb-4">
            Entre em Contato
          </h1>
          <p className="text-xl text-brand-black/70 dark:text-brand-white/70 max-w-2xl mx-auto">
            Estamos aqui para ajudar! Entre em contato conosco para dúvidas, suporte ou parcerias.
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Email Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)] overflow-hidden"
          >
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full" />
            <div className="absolute top-4 left-0 w-px h-[calc(100%-2rem)] bg-gradient-to-b from-white/40 via-transparent to-white/10 rounded-full" />

            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full backdrop-blur-[10px] bg-brand-navy-blue/10 dark:bg-brand-yellow/10 border border-brand-navy-blue/20 dark:border-brand-yellow/20">
                <Mail className="w-6 h-6 text-brand-navy-blue dark:text-brand-yellow" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white">
                  Email
                </h3>
                <p className="text-brand-black/60 dark:text-brand-white/60">
                  Resposta em até 24 horas
                </p>
              </div>
            </div>

            <p className="text-brand-black/70 dark:text-brand-white/70 mb-6">
              Para dúvidas gerais, suporte técnico ou parcerias, envie-nos um email.
            </p>

            <PrimaryButton 
              onClick={handleEmailContact}
              leftIcon={<Send className="w-4 h-4" />}
              className="w-full"
            >
              Enviar Email
            </PrimaryButton>
          </motion.div>

          {/* WhatsApp Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)] overflow-hidden"
          >
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full" />
            <div className="absolute top-4 left-0 w-px h-[calc(100%-2rem)] bg-gradient-to-b from-white/40 via-transparent to-white/10 rounded-full" />

            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full backdrop-blur-[10px] bg-green-500/10 border border-green-500/20">
                <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white">
                  WhatsApp
                </h3>
                <p className="text-brand-black/60 dark:text-brand-white/60">
                  Resposta imediata
                </p>
              </div>
            </div>

            <p className="text-brand-black/70 dark:text-brand-white/70 mb-6">
              Para suporte rápido ou dúvidas urgentes, fale conosco no WhatsApp.
            </p>

            <SecondaryButton 
              onClick={handleWhatsAppContact}
              leftIcon={<MessageCircle className="w-4 h-4" />}
              className="w-full"
            >
              Abrir WhatsApp
            </SecondaryButton>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)] overflow-hidden"
        >
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full" />
          <div className="absolute top-4 left-0 w-px h-[calc(100%-2rem)] bg-gradient-to-b from-white/40 via-transparent to-white/10 rounded-full" />

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-3 rounded-full backdrop-blur-[10px] bg-brand-navy-blue/10 dark:bg-brand-yellow/10 border border-brand-navy-blue/20 dark:border-brand-yellow/20 w-fit mx-auto mb-3">
                <Clock className="w-6 h-6 text-brand-navy-blue dark:text-brand-yellow" />
              </div>
              <h4 className="font-semibold text-brand-black dark:text-brand-white mb-2">
                Horário de Atendimento
              </h4>
              <p className="text-brand-black/60 dark:text-brand-white/60 text-sm">
                Segunda a Sexta<br />
                9h às 18h (BRT)
              </p>
            </div>

            <div className="text-center">
              <div className="p-3 rounded-full backdrop-blur-[10px] bg-brand-navy-blue/10 dark:bg-brand-yellow/10 border border-brand-navy-blue/20 dark:border-brand-yellow/20 w-fit mx-auto mb-3">
                <MapPin className="w-6 h-6 text-brand-navy-blue dark:text-brand-yellow" />
              </div>
              <h4 className="font-semibold text-brand-black dark:text-brand-white mb-2">
                Localização
              </h4>
              <p className="text-brand-black/60 dark:text-brand-white/60 text-sm">
                São Paulo, Brasil<br />
                Remotamente
              </p>
            </div>

            <div className="text-center">
              <div className="p-3 rounded-full backdrop-blur-[10px] bg-brand-navy-blue/10 dark:bg-brand-yellow/10 border border-brand-navy-blue/20 dark:border-brand-yellow/20 w-fit mx-auto mb-3">
                <Phone className="w-6 h-6 text-brand-navy-blue dark:text-brand-yellow" />
              </div>
              <h4 className="font-semibold text-brand-black dark:text-brand-white mb-2">
                Suporte
              </h4>
              <p className="text-brand-black/60 dark:text-brand-white/60 text-sm">
                Técnico e Comercial<br />
                Em português
              </p>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <h3 className="text-2xl font-semibold text-brand-black dark:text-brand-white mb-4">
            Dúvidas Frequentes?
          </h3>
          <p className="text-brand-black/60 dark:text-brand-white/60 mb-6">
            Antes de entrar em contato, confira nossa central de ajuda com as perguntas mais comuns.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <SecondaryButton onClick={() => router.push("/help")}>
              Central de Ajuda
            </SecondaryButton>
            <SecondaryButton onClick={() => router.push("/gallery")}>
              Explorar Galeria
            </SecondaryButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}