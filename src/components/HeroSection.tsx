"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-12rem)] px-4 py-16 relative">
      {/* Background overlay */}
      <div className="absolute inset-0 pointer-events-none" />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl sm:text-5xl lg:text-6xl mb-4 leading-tight relative z-10 bg-gradient-to-r from-brand-navy-blue via-brand-navy-blue to-brand-navy-blue dark:from-brand-yellow dark:via-brand-yellow dark:to-brand-yellow bg-[length:200%_200%] bg-clip-text text-transparent animate-[holographic-shimmer_3s_ease-in-out_infinite] contrast-[1.2] saturate-[1.3] dark:contrast-100 dark:saturate-110"
        style={{
          fontFamily: "var(--font-serif)",
          animation: "holographic-shimmer 8s ease-in-out infinite",
        }}
      >
        Descubra, Crie e Colecione <br className="hidden sm:inline" />
        Arte Digital com ArtEsfera
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="text-lg sm:text-xl mb-8 max-w-2xl relative z-10 text-brand-black dark:text-brand-white"
        style={{
          fontFamily: "var(--font-sans)",
        }}
      >
        ArtEsfera é uma plataforma revolucionária onde artistas podem exibir
        suas criações únicas e entusiastas da arte podem explorar uma coleção
        curada de obras-primas digitais.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        className="relative z-10"
      >
        <Button
          asChild
          className="relative overflow-hidden px-8 py-4 text-lg font-medium rounded-full backdrop-blur-2xl bg-white/15 dark:bg-white/8 border border-white/25 dark:border-white/12 transition-all duration-300 hover:bg-white/25 dark:hover:bg-white/15 hover:border-white/40 dark:hover:border-white/25 hover:-translate-y-1 text-brand-black dark:text-brand-white hover:text-brand-navy-blue dark:hover:text-brand-yellow before:content-[''] before:absolute before:top-[-1px] before:left-[-100%] before:w-full before:h-[calc(100%+2px)] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-all before:duration-500 hover:before:left-full before:pointer-events-none before:z-[1]"
        >
          <Link
            href="/gallery"
            className="relative z-[2] flex items-center justify-center"
          >
            Explorar Galeria
          </Link>
        </Button>
      </motion.div>
    </section>
  );
}
