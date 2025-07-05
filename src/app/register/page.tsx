import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cadastro - ArtEsfera',
  description: 'Junte-se à ArtEsfera e conecte-se com a maior comunidade de arte e cultura do Brasil.',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 bg-clip-text text-transparent">
            Junte-se à ArtEsfera
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Conecte-se com artistas e empresas em todo o Brasil
          </p>
        </div>

        {/* Register Form */}
        <div className="backdrop-blur-md bg-white/20 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 rounded-3xl p-8 shadow-lg">
          <form className="space-y-6">
            {/* Google Register Button */}
            <button
              type="button"
              className="group relative w-full px-6 py-4 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-200 font-semibold transition-all duration-300 hover:bg-white/20 dark:hover:bg-gray-700/30 hover:scale-105 hover:shadow-lg active:scale-95 flex items-center justify-center space-x-3"
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
                  ou cadastre-se com email
                </span>
              </div>
            </div>

            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                Eu sou:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="group relative px-4 py-3 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-200 font-medium transition-all duration-300 hover:bg-white/20 dark:hover:bg-gray-700/30 hover:scale-105 text-center"
                >
                  <div className="mb-2">🎨</div>
                  <span className="text-sm">Artista</span>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-blue-500/0 to-teal-500/0 group-hover:from-purple-500/10 group-hover:via-blue-500/10 group-hover:to-teal-500/10 transition-all duration-300" />
                </button>
                <button
                  type="button"
                  className="group relative px-4 py-3 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-200 font-medium transition-all duration-300 hover:bg-white/20 dark:hover:bg-gray-700/30 hover:scale-105 text-center"
                >
                  <div className="mb-2">🏢</div>
                  <span className="text-sm">Empresa</span>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-blue-500/0 to-teal-500/0 group-hover:from-purple-500/10 group-hover:via-blue-500/10 group-hover:to-teal-500/10 transition-all duration-300" />
                </button>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="w-full px-4 py-3 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                  placeholder="João"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Sobrenome
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="w-full px-4 py-3 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                  placeholder="Silva"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                placeholder="joao@email.com"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-3 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                placeholder="••••••••"
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Mínimo 8 caracteres
              </p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-4 py-3 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                required
              />
              <label htmlFor="terms" className="ml-3 block text-sm text-gray-700 dark:text-gray-200">
                Concordo com os{' '}
                <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
                  Termos de Uso
                </a>{' '}
                e{' '}
                <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
                  Política de Privacidade
                </a>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="group relative w-full px-6 py-4 rounded-2xl backdrop-blur-md bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-teal-500/20 border border-white/20 dark:border-gray-700/30 text-gray-800 dark:text-white font-semibold transition-all duration-300 hover:from-purple-500/30 hover:via-blue-500/30 hover:to-teal-500/30 hover:scale-105 hover:shadow-lg active:scale-95"
            >
              <span className="relative z-10">Criar Conta</span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-blue-500/0 to-teal-500/0 group-hover:from-purple-500/10 group-hover:via-blue-500/10 group-hover:to-teal-500/10 transition-all duration-300" />
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Já tem uma conta?{' '}
              <a
                href="/login"
                className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 transition-colors duration-200"
              >
                Faça login
              </a>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="backdrop-blur-md bg-white/10 dark:bg-gray-800/10 border border-white/20 dark:border-gray-700/30 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">
            Por que se juntar à ArtEsfera?
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Conecte-se com empresas que valorizam arte
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-teal-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Encontre oportunidades únicas de colaboração
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-500 to-purple-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Use nossa IA para matches personalizados
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
