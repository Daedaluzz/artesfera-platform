"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy-blue dark:border-brand-yellow"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-brand-black dark:text-brand-white mb-2">
            Bem-vindo ao{" "}
            <span className="text-brand-navy-blue dark:text-brand-yellow">
              Dashboard
            </span>
          </h1>
          <p className="text-base sm:text-lg text-brand-black/70 dark:text-brand-white/70">
            Olá, {user.displayName || user.email}! 🎨
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)] overflow-hidden"
        >
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full" />
          <div className="absolute top-4 left-0 w-px h-[calc(100%-2rem)] bg-gradient-to-b from-white/40 via-transparent to-white/10 rounded-full" />

          <div className="text-center">
            <h2 className="text-xl font-bold text-brand-black dark:text-brand-white mb-4">
              🎉 Login realizado com sucesso!
            </h2>
            <p className="text-brand-black/70 dark:text-brand-white/70 mb-6">
              Sua conta foi configurada e seu documento do usuário foi criado no Firestore.
            </p>
            
            <div className="bg-white/[0.1] dark:bg-black/10 rounded-[12px] p-4 text-left">
              <h3 className="font-semibold text-brand-black dark:text-brand-white mb-2">
                Informações da conta:
              </h3>
              <ul className="space-y-1 text-sm text-brand-black/80 dark:text-brand-white/80">
                <li><strong>Email:</strong> {user.email}</li>
                <li><strong>Nome:</strong> {user.displayName || "Não informado"}</li>
                <li><strong>UID:</strong> {user.uid}</li>
                <li><strong>Email verificado:</strong> {user.emailVerified ? "Sim" : "Não"}</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}