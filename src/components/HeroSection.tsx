"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="glassmorphic-hero-colorful flex flex-col items-center justify-center text-center min-h-[calc(100vh-12rem)] px-4 py-16 relative overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 -my-4 sm:-my-6 lg:-my-8 rounded-lg">
      {/* Vibrant Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -inset-8 w-[calc(100%+4rem)] h-[calc(100%+4rem)] bg-gradient-to-br from-brand-yellow/10 via-brand-orange/8 to-brand-pink/6" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-yellow/20 rounded-full blur-3xl opacity-60 animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-brand-blue/15 rounded-full blur-[4rem] opacity-70 animate-pulse delay-1000" />

        <motion.div
          className="absolute top-24 left-20 w-4 h-4 bg-brand-yellow/70 rounded-full"
          animate={{ y: [0, -20, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-32 right-24 w-3 h-3 bg-brand-orange/80 rounded-full"
          animate={{ y: [0, -15, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
        />
      </div>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl sm:text-5xl lg:text-6xl mb-4 leading-tight relative z-10 font-bold"
        style={{
          fontFamily: "var(--font-serif)",
        }}
      >
        <span className="relative inline-block glass-text-container">
          {/* Glass Text Fill */}
          <span
            className="glass-text-fill"
            style={{
              position: "relative",
              color: "rgba(255, 255, 255, 0.7)",
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              textShadow: `
                1px 1px 1px rgba(0, 0, 0, 0.3),
                -1px -1px 1px rgba(255, 255, 255, 0.2),
                0 0 8px rgba(255, 215, 0, 0.3)
              `,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              padding: "0.2em 0.5em",
              borderRadius: "4px",
              boxShadow: `
                inset 0 0 12px rgba(255, 255, 255, 0.2),
                inset 0 0 24px rgba(255, 255, 255, 0.1)
              `,
            }}
          >
            Descubra, Crie e Colecione <br className="hidden sm:inline" />
            Arte Digital com ArtEsfera
          </span>

          {/* Animated Gradient Border */}
          <span
            className="absolute inset-0 rounded-md pointer-events-none"
            style={{
              background:
                "linear-gradient(45deg, #FFEE00, #FF6B00, #00F2FF, #FFEE00)",
              backgroundSize: "300% 300%",
              animation: "gradient-border-rotate 4s linear infinite",
              zIndex: -1,
              padding: "2px",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
              WebkitMaskComposite: "xor",
              opacity: 0.8,
            }}
          />
        </span>
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
          className="glassmorphic-button relative px-8 py-4 text-lg font-medium rounded-full text-brand-black dark:text-brand-white hover:text-brand-navy-blue dark:hover:text-brand-yellow group floating-particle-effect enhanced-text-glow"
        >
          <Link
            href="/gallery"
            className="relative z-[2] flex items-center justify-center"
          >
            Explorar Galeria
          </Link>
        </Button>
      </motion.div>

      {/* Add this style tag for the animation */}
      <style jsx global>{`
        @keyframes gradient-border-rotate {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </section>
  );
}
