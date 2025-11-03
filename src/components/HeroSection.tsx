"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";

export default function HeroSection() {
  const router = useRouter();
  const { user, signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Redirect to dashboard after successful login
      router.push("/dashboard");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleEmailSignIn = () => {
    router.push("/login");
  };

  // If user is already logged in, show different content
  if (user) {
    return (
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center py-20">
        <div className="max-w-7xl mx-auto w-full relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-brand-black dark:text-brand-white leading-[1.1] mb-8"
            >
              Bem-vindo de volta, {user.displayName}!
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
            >
              <PrimaryButton onClick={() => router.push("/dashboard")}>
                Acessar Dashboard
              </PrimaryButton>
              <SecondaryButton onClick={() => router.push("/projects")}>
                Ver Projetos
              </SecondaryButton>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center py-20">
      {/* Subtle floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 right-1/4 w-2 h-2 bg-brand-navy-blue/30 dark:bg-brand-yellow/30 rounded-full"
          animate={{ y: [0, -10, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-brand-orange/25 rounded-full"
          animate={{ y: [0, -8, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 1.5 }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-serif text-brand-black dark:text-brand-white leading-[1.1]"
              >
                Conecte sua
                <span className="text-brand-navy-blue dark:text-brand-yellow">
                  Arte
                </span>
                <br className="hidden sm:inline" />
                com
                <span className="text-brand-navy-blue dark:text-brand-yellow">
                  Oportunidades
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                className="text-lg sm:text-xl text-brand-black/70 dark:text-brand-white/70 leading-relaxed max-w-xl"
              >
                Entre na ArtEsfera e descubra
                <span className="font-medium text-brand-navy-blue dark:text-brand-yellow">
                  projetos culturais
                </span>
                e
                <span className="font-medium text-brand-navy-blue dark:text-brand-yellow">
                  colaborações artísticas
                </span>
                que transformarão sua carreira criativa.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
              className="flex flex-col gap-4 max-w-sm"
            >
              {/* Primary CTA - Google Sign-in */}
              <PrimaryButton
                fullWidth
                onClick={handleGoogleSignIn}
                leftIcon={
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                }
              >
                Continuar com o Google
              </PrimaryButton>

              {/* Secondary CTA - Email Sign-in */}
              <SecondaryButton
                fullWidth
                onClick={handleEmailSignIn}
                leftIcon={
                  <svg
                    className="w-4 h-4"
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
                }
              >
                Entrar com Email
              </SecondaryButton>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-md aspect-square">
              {/* Elegant glassmorphic container */}
              <div className="relative w-full h-full rounded-[24px] backdrop-blur-[12px] bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(255,255,255,0.05)] overflow-hidden">
                {/* Subtle top highlight */}
                <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                <div className="relative w-full h-full p-6">
                  <div className="relative w-full h-full rounded-[16px] overflow-hidden">
                    <Image
                      src="/images/placeholder.webp"
                      alt="ArtEsfera: Conectando artistas com oportunidades culturais"
                      fill
                      className="object-cover"
                      priority
                    />

                    {/* Subtle overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-blue/10 dark:from-brand-yellow/10 via-transparent to-transparent" />
                  </div>
                </div>
              </div>

              {/* Minimal floating accents */}
              <motion.div
                className="absolute -top-2 -right-2 w-4 h-4 bg-brand-navy-blue/20 dark:bg-brand-yellow/20 rounded-full backdrop-blur-sm"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-3 -left-3 w-3 h-3 bg-brand-orange/15 rounded-full backdrop-blur-sm"
                animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
