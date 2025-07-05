import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perfil - ArtEsfera",
  description: "Gerencie seu perfil e configurações na ArtEsfera.",
};

export default function Profile() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* Header Section */}
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 bg-clip-text text-transparent">
              Meu Perfil
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Gerencie suas informações e configure sua experiência na ArtEsfera
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="backdrop-blur-md bg-white/20 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 rounded-3xl p-6 shadow-lg sticky top-24">
              {/* Profile Picture */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
                  JS
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  João Silva
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Artista Visual
                </p>
                <button className="mt-3 px-4 py-2 text-sm bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-white/20 dark:border-gray-700/30 rounded-xl text-gray-700 dark:text-gray-200 hover:from-purple-500/30 hover:to-blue-500/30 transition-all duration-300 cursor-pointer">
                  Alterar Foto
                </button>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {[
                  { name: "Informações Pessoais", active: true },
                  { name: "Portfolio", active: false },
                  { name: "Preferências", active: false },
                  { name: "Notificações", active: false },
                  { name: "Privacidade", active: false },
                  { name: "Configurações", active: false },
                ].map((item) => (
                  <button
                    key={item.name}
                    className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-300 cursor-pointer ${
                      item.active
                        ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-gray-800 dark:text-white border border-purple-500/20"
                        : "text-gray-600 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-700/20"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="backdrop-blur-md bg-white/20 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 rounded-3xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">
                Informações Pessoais
              </h2>

              <form className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                    >
                      Nome
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      defaultValue="João"
                      className="w-full px-4 py-3 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                    >
                      Sobrenome
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      defaultValue="Silva"
                      className="w-full px-4 py-3 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                    />
                  </div>
                </div>

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
                    defaultValue="joao@email.com"
                    className="w-full px-4 py-3 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                  >
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    defaultValue="+55 (11) 99999-9999"
                    className="w-full px-4 py-3 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                  />
                </div>

                {/* Artist Info */}
                <div className="border-t border-gray-300/30 dark:border-gray-600/30 pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Informações Artísticas
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="artistType"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                      >
                        Tipo de Artista
                      </label>
                      <select
                        id="artistType"
                        className="w-full px-4 py-3 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                      >
                        <option value="visual">Artista Visual</option>
                        <option value="musician">Músico</option>
                        <option value="actor">Ator/Atriz</option>
                        <option value="dancer">Dançarino</option>
                        <option value="writer">Escritor</option>
                        <option value="photographer">Fotógrafo</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="experience"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                      >
                        Experiência
                      </label>
                      <select
                        id="experience"
                        className="w-full px-4 py-3 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                      >
                        <option value="beginner">Iniciante (0-2 anos)</option>
                        <option value="intermediate">
                          Intermediário (3-5 anos)
                        </option>
                        <option value="experienced">
                          Experiente (6-10 anos)
                        </option>
                        <option value="expert">Expert (10+ anos)</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                    >
                      Biografia
                    </label>
                    <textarea
                      id="bio"
                      rows={4}
                      defaultValue="Artista visual apaixonado por explorar novas formas de expressão através da arte contemporânea. Especializado em pinturas abstratas e instalações interativas."
                      className="w-full px-4 py-3 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 resize-none"
                    />
                  </div>

                  {/* Skills/Specialties */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Especialidades
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {[
                        "Pintura",
                        "Escultura",
                        "Arte Digital",
                        "Instalações",
                        "Performance",
                      ].map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 rounded-full text-sm bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/20"
                        >
                          {skill} ×
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Digite uma especialidade e pressione Enter"
                      className="w-full px-4 py-3 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    className="px-6 py-3 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-200 font-medium transition-all duration-300 hover:bg-white/20 dark:hover:bg-gray-700/30 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="group relative px-8 py-3 rounded-2xl backdrop-blur-md bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-teal-500/20 border border-white/20 dark:border-gray-700/30 text-gray-800 dark:text-white font-semibold transition-all duration-300 hover:from-purple-500/30 hover:via-blue-500/30 hover:to-teal-500/30 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer"
                  >
                    <span className="relative z-10">Salvar Alterações</span>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-blue-500/0 to-teal-500/0 group-hover:from-purple-500/10 group-hover:via-blue-500/10 group-hover:to-teal-500/10 transition-all duration-300" />
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Projetos", value: "12", icon: "🎨" },
                { label: "Conexões", value: "48", icon: "🤝" },
                { label: "Visualizações", value: "1.2k", icon: "👁️" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="backdrop-blur-md bg-white/20 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/30 rounded-2xl p-6 shadow-lg text-center"
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
