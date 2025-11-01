"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { motion } from "framer-motion";
import { User, LogOut, Settings, BarChart3, Folder, Users } from "lucide-react";

function DashboardContent() {
  const { user, userDocument, signOut, loading } = useAuth();
  const router = useRouter();

  // Redirect to profile setup if profile is incomplete
  useEffect(() => {
    if (!loading && user && userDocument && !userDocument.profileCompleted) {
      console.log("🔀 Dashboard: Redirecting to profile setup for incomplete profile");
      router.push("/dashboard/profile-setup");
    }
  }, [user, userDocument, loading, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      // User will be redirected by AuthGuard when auth state changes
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-white via-brand-white/95 to-brand-white/90 dark:from-brand-black dark:via-brand-black/95 dark:to-brand-black/90">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-6 mb-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-navy-blue to-brand-navy-blue/80 dark:from-brand-yellow dark:to-brand-yellow/80 flex items-center justify-center">
                <User className="w-6 h-6 text-white dark:text-brand-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-brand-black dark:text-brand-white">
                  Bem-vindo,{" "}
                  {user?.displayName || user?.email?.split("@")[0] || "Usuário"}
                  !
                </h1>
                <p className="text-brand-black/70 dark:text-brand-white/70">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-black/10 border border-white/[0.2] dark:border-white/10 text-brand-black dark:text-brand-white hover:bg-white/[0.2] dark:hover:bg-black/20 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </motion.div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Projects Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:bg-white/[0.25] dark:hover:bg-black/25 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-brand-navy-blue to-brand-navy-blue/80 dark:from-brand-yellow dark:to-brand-yellow/80 flex items-center justify-center">
                <Folder className="w-5 h-5 text-white dark:text-brand-black" />
              </div>
              <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white">
                Meus Projetos
              </h3>
            </div>
            <p className="text-brand-black/70 dark:text-brand-white/70 text-sm mb-3">
              Gerencie seus projetos artísticos e colaborações
            </p>
            <div className="text-2xl font-bold text-brand-navy-blue dark:text-brand-yellow">
              3
            </div>
          </motion.div>

          {/* Analytics Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:bg-white/[0.25] dark:hover:bg-black/25 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-brand-navy-blue to-brand-navy-blue/80 dark:from-brand-yellow dark:to-brand-yellow/80 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white dark:text-brand-black" />
              </div>
              <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white">
                Analytics
              </h3>
            </div>
            <p className="text-brand-black/70 dark:text-brand-white/70 text-sm mb-3">
              Acompanhe o desempenho dos seus projetos
            </p>
            <div className="text-2xl font-bold text-brand-navy-blue dark:text-brand-yellow">
              +24%
            </div>
          </motion.div>

          {/* Community Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:bg-white/[0.25] dark:hover:bg-black/25 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-brand-navy-blue to-brand-navy-blue/80 dark:from-brand-yellow dark:to-brand-yellow/80 flex items-center justify-center">
                <Users className="w-5 h-5 text-white dark:text-brand-black" />
              </div>
              <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white">
                Comunidade
              </h3>
            </div>
            <p className="text-brand-black/70 dark:text-brand-white/70 text-sm mb-3">
              Conecte-se com outros artistas
            </p>
            <div className="text-2xl font-bold text-brand-navy-blue dark:text-brand-yellow">
              127
            </div>
          </motion.div>
        </div>

        {/* User Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-brand-navy-blue to-brand-navy-blue/80 dark:from-brand-yellow dark:to-brand-yellow/80 flex items-center justify-center">
              <Settings className="w-5 h-5 text-white dark:text-brand-black" />
            </div>
            <h2 className="text-xl font-semibold text-brand-black dark:text-brand-white">
              Informações da Conta
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-brand-black dark:text-brand-white mb-2">
                Nome de Exibição
              </label>
              <div className="px-4 py-3 rounded-[12px] bg-white/[0.1] dark:bg-black/10 border border-white/[0.2] dark:border-white/10 text-brand-black dark:text-brand-white">
                {user?.displayName || "Não definido"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-black dark:text-brand-white mb-2">
                Email
              </label>
              <div className="px-4 py-3 rounded-[12px] bg-white/[0.1] dark:bg-black/10 border border-white/[0.2] dark:border-white/10 text-brand-black dark:text-brand-white">
                {user?.email}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-black dark:text-brand-white mb-2">
                Método de Autenticação
              </label>
              <div className="px-4 py-3 rounded-[12px] bg-white/[0.1] dark:bg-black/10 border border-white/[0.2] dark:border-white/10 text-brand-black dark:text-brand-white">
                {user?.providerData?.[0]?.providerId === "google.com"
                  ? "Google"
                  : "Email/Senha"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-black dark:text-brand-white mb-2">
                Status de Verificação
              </label>
              <div className="px-4 py-3 rounded-[12px] bg-white/[0.1] dark:bg-black/10 border border-white/[0.2] dark:border-white/10 text-brand-black dark:text-brand-white">
                {user?.emailVerified ? "✅ Verificado" : "❌ Não verificado"}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Dashboard Page
 *
 * This page demonstrates the complete auth protection setup:
 * 1. Protected by middleware.ts (server-side)
 * 2. Wrapped with AuthGuard (client-side)
 * 3. Uses useAuth hook for user data and actions
 */
export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
