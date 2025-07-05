"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden flex items-center justify-center min-h-screen px-4 py-8 -mx-4 sm:-mx-6 lg:-mx-8 -my-4 sm:-my-6 lg:-my-8 rounded-[20px] backdrop-blur-[15px] bg-white/[0.37] dark:bg-black/30 border border-white/15 dark:border-black/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.15),inset_1px_0_0_rgba(255,255,255,0.2),inset_-1px_0_0_rgba(255,255,255,0.1),0_8px_64px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.2),inset_1px_0_0_rgba(255,255,255,0.3),inset_-1px_0_0_rgba(255,255,255,0.15),0_8px_64px_rgba(0,0,0,0.12)]">
      {/* Simplified Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 right-16 w-3 h-3 bg-brand-yellow/60 rounded-full"
          animate={{ y: [0, -15, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-24 left-20 w-2 h-2 bg-brand-orange/50 rounded-full"
          animate={{ y: [0, -12, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 1.5 }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-serif text-brand-black dark:text-brand-white leading-tight"
              >
                Transforme sua{" "}
                <span className="text-brand-navy-blue dark:text-brand-yellow">
                  Arte
                </span>{" "}
                <br className="hidden sm:inline" />
                em{" "}
                <span className="text-brand-navy-blue dark:text-brand-yellow">
                  Carreira
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                className="text-lg sm:text-xl lg:text-2xl text-brand-black/80 dark:text-brand-white/80 leading-relaxed max-w-2xl"
              >
                Cadastre-se agora e descubra{" "}
                <span className="font-medium text-brand-navy-blue dark:text-brand-yellow">
                  projetos exclusivos
                </span>{" "}
                e{" "}
                <span className="font-medium text-brand-navy-blue dark:text-brand-yellow">
                  oportunidades culturais
                </span>{" "}
                que combinam perfeitamente com seu talento artístico.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
              className="flex flex-col gap-3 max-w-sm"
            >
              {/* Primary CTA - Google Sign-up */}
              <motion.button
                whileHover={{ scale: 1.01, y: -0.5 }}
                whileTap={{ scale: 0.99 }}
                className="group w-full px-6 py-3 rounded-xl backdrop-blur-[15px] bg-white/[0.15] dark:bg-white/[0.12] border-2 border-transparent shadow-[0_4px_20px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.2),inset_0_0_20px_10px_rgba(255,255,255,0.1)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.15),inset_0_0_20px_10px_rgba(255,255,255,0.05)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-1px_0_rgba(255,255,255,0.3),inset_0_0_20px_10px_rgba(255,255,255,0.15)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.2),inset_0_0_20px_10px_rgba(255,255,255,0.08)] transition-all duration-300 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:rounded-xl before:p-[2px] before:bg-gradient-to-r before:from-white/60 before:via-white/80 before:to-white/60 before:-m-[2px] before:-z-10 after:content-[''] after:absolute after:top-[-2px] after:left-[-100%] after:w-full after:h-[calc(100%+4px)] after:bg-gradient-to-r after:from-transparent after:via-white/40 after:to-transparent after:transition-all after:duration-600 after:ease-in-out after:pointer-events-none after:z-10 hover:after:left-full hover:backdrop-blur-xl hover:bg-white/20 hover:translate-y-[-1px] dark:hover:bg-white/8"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.12))",
                }}
              >
                <span className="relative z-20 flex items-center justify-center text-sm font-medium text-brand-black dark:text-brand-black group-hover:text-brand-navy-blue transition-colors duration-300">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continuar com o Google
                </span>
              </motion.button>

              {/* Secondary CTA - Email Sign-up */}
              <motion.button
                whileHover={{ scale: 1.01, y: -0.5 }}
                whileTap={{ scale: 0.99 }}
                className="w-full px-6 py-3 rounded-xl backdrop-blur-[15px] bg-white/[0.08] dark:bg-white/[0.06] border border-white/[0.15] dark:border-white/[0.1] shadow-[0_4px_20px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.08),inset_0_0_20px_10px_rgba(255,255,255,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.15),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.12),inset_0_0_20px_10px_rgba(255,255,255,0.05)] transition-all duration-300 relative overflow-hidden before:content-[''] before:absolute before:top-[-2px] before:left-[-100%] before:w-full before:h-[calc(100%+4px)] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:transition-all before:duration-600 before:ease-in-out before:pointer-events-none before:z-10 hover:before:left-full hover:backdrop-blur-xl hover:bg-white/20 hover:translate-y-[-1px] dark:hover:bg-white/8 after:content-[''] after:absolute after:top-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent"
              >
                <span className="relative z-20 flex items-center justify-center text-sm font-medium text-brand-black dark:text-brand-white hover:text-brand-navy-blue dark:hover:text-brand-yellow transition-colors duration-300">
                  <svg
                    className="w-4 h-4 mr-2"
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
                  Entrar com Email
                </span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Glassmorphic frame */}
              <div className="absolute inset-0 rounded-[30px] backdrop-blur-[15px] bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05)] overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent after:content-[''] after:absolute after:top-0 after:left-0 after:w-px after:h-full after:bg-gradient-to-b after:from-white/60 after:via-transparent after:to-white/20 p-6">
                <div className="relative w-full h-full rounded-[20px] overflow-hidden">
                  <Image
                    src="/images/placeholder.webp"
                    alt="ArtEsfera: Onde a arte encontra oportunidades - Plataforma que conecta artistas e empresas culturais"
                    fill
                    className="object-cover"
                    priority
                  />

                  {/* Overlay for better integration */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-blue/20 dark:from-brand-yellow/20 via-transparent to-transparent" />
                </div>
              </div>

              {/* Floating elements around the image */}
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 bg-brand-navy-blue/20 dark:bg-brand-yellow/20 rounded-full backdrop-blur-sm border border-brand-navy-blue/30 dark:border-brand-yellow/30"
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-6 -left-6 w-6 h-6 bg-brand-orange/20 rounded-full backdrop-blur-sm"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
