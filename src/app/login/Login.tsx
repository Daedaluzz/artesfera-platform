"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    user,
    userDocument,
    loading: authLoading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
  } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!authLoading && user && userDocument) {
      // Check if profile is completed
      if (!userDocument.profileCompleted) {
        console.log(
          "🔀 Login: Redirecting to profile setup for first-time user"
        );
        router.push("/dashboard/profile-setup");
        return;
      }

      // Profile is completed, redirect to intended destination
      const nextUrl = searchParams.get("next") || "/dashboard";
      console.log("🔀 Login: Redirecting authenticated user to:", nextUrl);
      router.push(nextUrl);
    }
  }, [user, userDocument, authLoading, router, searchParams]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    // Confirm password validation (only for register)
    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Confirmação de senha é obrigatória";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Senhas não coincidem";
      }

      if (!formData.name.trim()) {
        newErrors.general = "Nome é obrigatório para cadastro";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setErrors({});
      setSuccess(null);
      await signInWithGoogle();
      setSuccess("✅ Login realizado com sucesso!");
      // Redirect handled by useEffect
    } catch (error: unknown) {
      console.error("Google sign-in error:", error);
      setErrors({ general: getFirebaseErrorMessage(error) });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email/password form submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setErrors({});
      setSuccess(null);

      if (isLogin) {
        await signInWithEmail(formData.email, formData.password);
        setSuccess("✅ Login realizado com sucesso!");
      } else {
        await signUpWithEmail(formData.email, formData.password, formData.name);
        setSuccess("✅ Conta criada com sucesso!");
      }
      // Redirect handled by useEffect
    } catch (error: unknown) {
      console.error("Email auth error:", error);
      setErrors({ general: getFirebaseErrorMessage(error) });
    } finally {
      setIsLoading(false);
    }
  };

  // Get user-friendly error messages
  const getFirebaseErrorMessage = (error: unknown): string => {
    const errorCode = (error as { code?: string })?.code || "";

    switch (errorCode) {
      case "auth/popup-closed-by-user":
        return "Login cancelado. Tente novamente.";
      case "auth/network-request-failed":
        return "Erro de conexão. Verifique sua internet e tente novamente.";
      case "auth/email-already-in-use":
        return "Este email já está em uso. Tente fazer login ou use outro email.";
      case "auth/weak-password":
        return "Senha muito fraca. Use pelo menos 6 caracteres.";
      case "auth/user-not-found":
        return "Usuário não encontrado. Verifique o email ou cadastre-se.";
      case "auth/wrong-password":
        return "Senha incorreta. Tente novamente.";
      case "auth/invalid-email":
        return "Email inválido.";
      case "auth/user-disabled":
        return "Esta conta foi desabilitada. Entre em contato com o suporte.";
      case "auth/too-many-requests":
        return "Muitas tentativas. Tente novamente mais tarde.";
      default:
        return (
          (error as { message?: string })?.message ||
          "Ocorreu um erro inesperado. Tente novamente."
        );
    }
  };

  // Toggle between login and register
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    });
  };

  // Show loading if auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy-blue dark:border-brand-yellow"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-brand-black dark:text-brand-white mb-1">
            {isLogin ? "Bem-vindo de volta à " : "Junte-se à "}
            <span className="text-brand-navy-blue dark:text-brand-yellow">
              ArtEsfera
            </span>
          </h1>
          <p className="text-sm sm:text-base text-brand-black/70 dark:text-brand-white/70">
            {isLogin
              ? "Entre na sua conta e continue criando"
              : "Crie sua conta e comece a explorar"}
          </p>
        </motion.div>

        {/* Login/Register Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative backdrop-blur-[15px] bg-white/[0.15] dark:bg-black/15 border border-white/[0.25] dark:border-white/15 rounded-[20px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.04)] overflow-hidden"
        >
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full" />
          <div className="absolute top-4 left-0 w-px h-[calc(100%-2rem)] bg-gradient-to-b from-white/40 via-transparent to-white/10 rounded-full" />

          {/* Mode Toggle */}
          <div className="flex mb-4 p-1 bg-white/[0.1] dark:bg-black/10 rounded-[12px] border border-white/20 dark:border-white/10">
            <button
              type="button"
              onClick={() => !isLoading && setIsLogin(true)}
              disabled={isLoading}
              className={`flex-1 py-2 px-3 rounded-[8px] text-sm font-medium transition-all duration-200 ${
                isLogin
                  ? "bg-white/30 dark:bg-white/20 text-brand-black dark:text-brand-white shadow-sm"
                  : "text-brand-black/70 dark:text-brand-white/70 hover:text-brand-black dark:hover:text-brand-white"
              }`}
              aria-pressed={isLogin}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => !isLoading && setIsLogin(false)}
              disabled={isLoading}
              className={`flex-1 py-2 px-3 rounded-[8px] text-sm font-medium transition-all duration-200 ${
                !isLogin
                  ? "bg-white/30 dark:bg-white/20 text-brand-black dark:text-brand-white shadow-sm"
                  : "text-brand-black/70 dark:text-brand-white/70 hover:text-brand-black dark:hover:text-brand-white"
              }`}
              aria-pressed={!isLogin}
            >
              Cadastrar
            </button>
          </div>

          {/* General Error Message */}
          <AnimatePresence>
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-3 p-2.5 rounded-[12px] bg-red-500/10 border border-red-500/20 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-xs text-red-600 dark:text-red-400">
                  {errors.general}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-3 p-2.5 rounded-[12px] bg-green-500/10 border border-green-500/20 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-xs text-green-600 dark:text-green-400">
                  {success}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google Login Button */}
          <SecondaryButton
            fullWidth
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            leftIcon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
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
            aria-label={`${isLogin ? "Entrar" : "Cadastrar"} com Google`}
          >
            {isLogin ? "Entrar" : "Cadastrar"} com Google
          </SecondaryButton>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20 dark:border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 backdrop-blur-sm bg-white/30 dark:bg-black/30 text-brand-black/60 dark:text-brand-white/60 rounded-full border border-white/20 dark:border-white/10 text-xs">
                ou continue com email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form
            onSubmit={handleEmailSubmit}
            className="space-y-3"
            role="form"
            aria-label={`${isLogin ? "Login" : "Cadastro"} form`}
          >
            {/* Name Input (only for register) */}
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-1.5"
                  >
                    Nome completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2.5 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300 disabled:opacity-50"
                    placeholder="Seu nome completo"
                    aria-describedby="name-error"
                    required={!isLogin}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-1.5"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-3 py-2.5 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300 disabled:opacity-50 ${
                  errors.email
                    ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/30"
                    : "border-white/[0.2] dark:border-white/[0.1]"
                }`}
                placeholder="seu@email.com"
                aria-describedby={errors.email ? "email-error" : undefined}
                aria-invalid={!!errors.email}
                required
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  id="email-error"
                  className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-1.5"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full px-3 py-2.5 pr-10 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300 disabled:opacity-50 ${
                    errors.password
                      ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/30"
                      : "border-white/[0.2] dark:border-white/[0.1]"
                  }`}
                  placeholder="••••••••"
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  aria-invalid={!!errors.password}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-black/50 dark:text-brand-white/50 hover:text-brand-black dark:hover:text-brand-white transition-colors duration-200"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  id="password-error"
                  className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Confirm Password Input (only for register) */}
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80 mb-1.5"
                  >
                    Confirmar senha
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className={`w-full px-3 py-2.5 pr-10 rounded-[12px] backdrop-blur-[10px] bg-white/[0.1] dark:bg-white/[0.05] border shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white placeholder-brand-black/50 dark:placeholder-brand-white/50 focus:outline-none focus:ring-2 focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30 focus:border-brand-navy-blue/30 dark:focus:border-brand-yellow/30 transition-all duration-300 disabled:opacity-50 ${
                        errors.confirmPassword
                          ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/30"
                          : "border-white/[0.2] dark:border-white/[0.1]"
                      }`}
                      placeholder="••••••••"
                      aria-describedby={
                        errors.confirmPassword
                          ? "confirm-password-error"
                          : undefined
                      }
                      aria-invalid={!!errors.confirmPassword}
                      required={!isLogin}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={isLoading}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-black/50 dark:text-brand-white/50 hover:text-brand-black dark:hover:text-brand-white transition-colors duration-200"
                      aria-label={
                        showConfirmPassword
                          ? "Ocultar confirmação de senha"
                          : "Mostrar confirmação de senha"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      id="confirm-password-error"
                      className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1"
                      role="alert"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.confirmPassword}
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Remember Me & Forgot Password (only for login) */}
            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-white/20 text-brand-navy-blue dark:text-brand-yellow focus:ring-brand-navy-blue/30 dark:focus:ring-brand-yellow/30"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-xs text-brand-black/80 dark:text-brand-white/80"
                  >
                    Lembrar de mim
                  </label>
                </div>

                <button
                  type="button"
                  disabled={isLoading}
                  className="text-xs text-brand-navy-blue dark:text-brand-yellow hover:text-brand-navy-blue/80 dark:hover:text-brand-yellow/80 transition-colors duration-200 cursor-pointer disabled:opacity-50"
                >
                  Esqueceu a senha?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <PrimaryButton
              fullWidth
              type="submit"
              disabled={isLoading}
              leftIcon={
                isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                ) : undefined
              }
            >
              {isLoading
                ? isLogin
                  ? "Entrando..."
                  : "Cadastrando..."
                : isLogin
                ? "Entrar"
                : "Cadastrar"}
            </PrimaryButton>

            {/* Terms (only for register) */}
            {!isLogin && (
              <div className="text-center">
                <p className="text-xs text-brand-black/60 dark:text-brand-white/60">
                  Ao se cadastrar, você concorda com nossos{" "}
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
            )}
          </form>

          {/* Switch Mode Link */}
          <div className="mt-4 text-center">
            <p className="text-sm text-brand-black/70 dark:text-brand-white/70">
              {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
              <button
                type="button"
                onClick={toggleMode}
                disabled={isLoading}
                className="font-medium text-brand-navy-blue dark:text-brand-yellow hover:text-brand-navy-blue/80 dark:hover:text-brand-yellow/80 transition-colors duration-200 cursor-pointer disabled:opacity-50"
              >
                {isLogin ? "Cadastre-se gratuitamente" : "Entre aqui"}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
