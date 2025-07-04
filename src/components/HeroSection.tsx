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
        className="holographic-text text-4xl sm:text-5xl lg:text-6xl mb-4 leading-tight relative z-10"
        style={{
          fontFamily: "var(--font-serif)",
        }}
      >
        Descubra, Crie e Colecione <br className="hidden sm:inline" />
        Arte Digital com ArtEsfera
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="text-lg sm:text-xl mb-8 max-w-2xl relative z-10 text-adaptive"
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
          className="glass-button px-8 py-4 text-lg font-medium relative overflow-hidden text-adaptive"
        >
          <Link href="/gallery">Explorar Galeria</Link>
        </Button>
      </motion.div>
    </section>
  );
}
