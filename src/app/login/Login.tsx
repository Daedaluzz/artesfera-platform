"use client";

import { motion } from "framer-motion";
import { Metadata } from "next";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";

export const metadata: Metadata = {
  title: "Entrar - ArtEsfera",
  description:
    "Faça login na sua conta ArtEsfera e conecte-se com a comunidade artística.",
};

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-sm w-full sm:max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-brand-black dark:text-brand-white mb-2">
            Bem-vindo de volta à{" "}
            <span className="text-brand-navy-blue dark:text-brand-yellow">
              ArtEsfera
            </span>
          </h1>
          <p className="text-base sm:text-lg text-brand-black/70 dark:text-brand-white/70">
            Entre na sua conta e continue criando
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)] overflow-hidden"
        >
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full" />
          <div className="absolute top-4 left-0 w-px h-[calc(100%-2rem)] bg-gradient-to-b from-white/40 via-transparent to-white/10 rounded-full" />

          <form className="space-y-4" role="form" aria-label="Login form">
            {/* Google Login Button */}
            <SecondaryButton
              fullWidth
              type="button"
              leftIcon={
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              Continuar com Google
            </SecondaryButton>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20 dark:border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 backdrop-blur-sm bg-white/30 dark:bg-black/30 text-brand-black/60 dark:text-brand-white/60 rounded-full border border-white/20 dark:border-white/10 text-xs">
                  ou continue com email
                </span>
              </div>
            </div>

            {/* Email Input */}
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
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-2"
              >
                Senha
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-3 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/20 text-brand-navy-blue dark:text-brand-yellow focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-brand-black/80 dark:text-brand-white/80"
                >
                  Lembrar de mim
                </label>
              </div>

              <button
                type="button"
                className="text-sm text-brand-navy-blue dark:text-brand-yellow hover:text-brand-navy-blue/80 dark:hover:text-brand-yellow/80 transition-colors duration-200 cursor-pointer"
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Login Button */}
            <PrimaryButton fullWidth type="submit">
              Entrar
            </PrimaryButton>

            {/* Terms */}
            <div className="text-center mt-4">
              <p className="text-xs text-brand-black/60 dark:text-brand-white/60">
                Ao entrar, você concorda com nossos{" "}
                <a
                  href="#"
                  className="text-brand-navy-blue dark:text-brand-yellow hover:text-brand-navy-blue/80 dark:hover:text-brand-yellow/80 transition-colors duration-200 cursor-pointer"
                >
                  Termos de Uso
                </a>{" "}
                e{" "}
                <a
                  href="#"
                  className="text-brand-navy-blue dark:text-brand-yellow hover:text-brand-navy-blue/80 dark:hover:text-brand-yellow/80 transition-colors duration-200 cursor-pointer"
                >
                  Política de Privacidade
                </a>
              </p>
            </div>
          </form>

          {/* Register Link */}
          <div className="mt-4 text-center">
            <p className="text-sm text-brand-black/70 dark:text-brand-white/70">
              Não tem uma conta?{" "}
              <a
                href="/register"
                className="font-medium text-brand-navy-blue dark:text-brand-yellow hover:text-brand-navy-blue/80 dark:hover:text-brand-yellow/80 transition-colors duration-200 cursor-pointer"
              >
                Cadastre-se gratuitamente
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
