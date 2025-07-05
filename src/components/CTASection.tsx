"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Main Glass Container */}
      <div className="max-w-6xl mx-auto relative">
        <div className="relative rounded-[20px] backdrop-blur-[15px] bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05)] overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent after:content-[''] after:absolute after:top-0 after:left-0 after:w-px after:h-full after:bg-gradient-to-b after:from-white/60 after:via-transparent after:to-white/20">
          {/* Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 right-20 w-24 h-24 bg-brand-yellow/20 rounded-full blur-2xl opacity-70 animate-pulse" />
            <div className="absolute bottom-16 left-16 w-32 h-32 bg-brand-blue/15 rounded-full blur-3xl opacity-60 animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-brand-orange/10 rounded-full blur-3xl opacity-50 animate-pulse delay-500" />
          </div>

          <div className="relative z-10 px-8 py-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-brand-black dark:text-brand-white mb-6">
                Pronto para Transformar sua Carreira?
              </h2>
              <p className="text-lg sm:text-xl text-brand-black/80 dark:text-brand-white/80 max-w-3xl mx-auto mb-8">
                Junte-se à revolução que está conectando arte e negócios. Sua
                próxima grande oportunidade está esperando na ArtEsfera.
              </p>
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {/* Primary CTA with refined glassmorphism */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 rounded-2xl backdrop-blur-xl bg-white/[0.15] dark:bg-white/[0.08] border border-white/[0.2] dark:border-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.24)] hover:bg-white/[0.25] dark:hover:bg-white/[0.12] hover:border-white/[0.3] dark:hover:border-white/[0.25] hover:shadow-[0_16px_40px_rgba(0,0,0,0.16)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.32)] transition-all duration-300 relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center text-lg font-semibold text-brand-black dark:text-brand-white group-hover:text-brand-navy-blue dark:group-hover:text-brand-yellow transition-colors duration-300">
                    Comece Gratuitamente
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </motion.button>

                {/* Secondary CTA with refined glassmorphism */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-2xl backdrop-blur-xl bg-white/[0.08] dark:bg-white/[0.04] border border-white/[0.15] dark:border-white/[0.1] shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.16)] hover:bg-white/[0.15] dark:hover:bg-white/[0.08] hover:border-white/[0.25] dark:hover:border-white/[0.2] hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.24)] transition-all duration-300"
                >
                  <span className="relative z-10 text-lg font-semibold text-brand-black dark:text-brand-white hover:text-brand-navy-blue dark:hover:text-brand-yellow transition-colors duration-300">
                    Saiba Mais
                  </span>
                </motion.button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 pt-8 border-t border-white/20 dark:border-white/10">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-brand-black/60 dark:text-brand-white/60">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-brand-green rounded-full mr-2" />
                    Cadastro 100% Gratuito
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-brand-green rounded-full mr-2" />
                    Sem Taxas Ocultas
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-brand-green rounded-full mr-2" />
                    Suporte 24/7
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
