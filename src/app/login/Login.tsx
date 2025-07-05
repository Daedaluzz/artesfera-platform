import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar - ArtEsfera",
  description:
    "Faça login na sua conta ArtEsfera e conecte-se com a comunidade artística.",
};

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 bg-clip-text text-transparent">
            Bem-vindo de volta
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Entre na sua conta e continue criando
          </p>
        </div>

        {/* Login Form */}
        <div className="backdrop-blur-md bg-white/20 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 rounded-3xl p-8 shadow-lg">
          <form className="space-y-6">
            {/* Google Login Button */}
            <button
              type="button"
              className="group relative w-full px-6 py-4 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-200 font-semibold transition-all duration-300 hover:bg-white/20 dark:hover:bg-gray-700/30 hover:scale-105 hover:shadow-lg active:scale-95 flex items-center justify-center space-x-3 cursor-pointer"
            >
              <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-red-500 rounded-full" />
              <span className="relative z-10">Continuar com Google</span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-blue-500/0 to-teal-500/0 group-hover:from-purple-500/10 group-hover:via-blue-500/10 group-hover:to-teal-500/10 transition-all duration-300" />
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300/30 dark:border-gray-600/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 backdrop-blur-sm rounded-full">
                  ou continue com email
                </span>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                placeholder="seu@email.com"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
              >
                Senha
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-3 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
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
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-200"
                >
                  Lembrar de mim
                </label>
              </div>

              <button
                type="button"
                className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 transition-colors duration-200 cursor-pointer"
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="group relative w-full px-6 py-4 rounded-2xl backdrop-blur-md bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-teal-500/20 border border-white/20 dark:border-gray-700/30 text-gray-800 dark:text-white font-semibold transition-all duration-300 hover:from-purple-500/30 hover:via-blue-500/30 hover:to-teal-500/30 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer"
            >
              <span className="relative z-10">Entrar</span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-blue-500/0 to-teal-500/0 group-hover:from-purple-500/10 group-hover:via-blue-500/10 group-hover:to-teal-500/10 transition-all duration-300" />
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Não tem uma conta?{" "}
              <a
                href="/register"
                className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 transition-colors duration-200 cursor-pointer"
              >
                Cadastre-se gratuitamente
              </a>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Ao entrar, você concorda com nossos{" "}
            <a
              href="#"
              className="text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
            >
              Termos de Uso
            </a>{" "}
            e{" "}
            <a
              href="#"
              className="text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
            >
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
