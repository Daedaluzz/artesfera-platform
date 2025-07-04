"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-10rem)] px-4 py-16 relative">
      {/* Background radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,238,0,0.1)_0%,transparent_70%)] pointer-events-none" />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl sm:text-5xl lg:text-6xl mb-4 leading-tight relative z-10 bg-gradient-to-r from-yellow-400 via-blue-500 to-orange-500 bg-[length:200%_200%] bg-clip-text text-transparent animate-[holographic-shimmer_3s_ease-in-out_infinite] contrast-[1.2] saturate-[1.3] dark:contrast-100 dark:saturate-110"
        style={{
          fontFamily: "var(--font-serif)",
          animation: "holographic-shimmer 3s ease-in-out infinite",
        }}
      >
        Descubra, Crie e Colecione <br className="hidden sm:inline" />
        Arte Digital com ArtEsfera
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="text-lg sm:text-xl mb-8 max-w-2xl relative z-10 text-gray-800 dark:text-white"
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
          className="relative overflow-hidden px-8 py-4 text-lg font-medium rounded-full backdrop-blur-lg bg-white/20 dark:bg-black/20 border border-blue-500/20 dark:border-cyan-400/20 shadow-md shadow-blue-500/5 dark:shadow-cyan-400/5 transition-all duration-300 hover:bg-white/30 dark:hover:bg-black/30 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-cyan-400/10 hover:-translate-y-0.5 text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-cyan-400 before:content-[''] before:absolute before:top-[-1px] before:left-[-100%] before:w-full before:h-[calc(100%+2px)] before:bg-gradient-to-r before:from-transparent before:via-blue-500/20 dark:before:via-cyan-400/20 before:to-transparent before:transition-all before:duration-500 hover:before:left-full before:pointer-events-none before:z-[1]"
        >
          <Link href="/gallery" className="relative z-[2] flex items-center justify-center">Explorar Galeria</Link>
        </Button>
      </motion.div>
    </section>
  );
}
