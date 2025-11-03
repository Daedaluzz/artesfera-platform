"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import * as Icons from "lucide-react";
import { socialLinks } from "@/lib/socialLinks";

export default function Footer() {
  const pathname = usePathname();

  // Don't render footer on Daeva pages (including subpages)
  if (pathname.startsWith("/daeva")) {
    return null;
  }

  const footerLinks = {
    platform: [
      { name: "Projetos", href: "/projects" },
      { name: "Galeria", href: "/gallery" },
      { name: "Perfil", href: "/profile" },
      { name: "Dashboard", href: "/dashboard" },
    ],
    company: [
      { name: "Sobre", href: "/about" },
      { name: "Contato", href: "/contact" },
      { name: "Blog", href: "/blog" },
      { name: "Ajuda", href: "/help" },
    ],
    legal: [
      { name: "Termos de Uso", href: "/terms" },
      { name: "Política de Privacidade", href: "/privacy" },
      { name: "Cookies", href: "/cookies" },
    ],
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
      className="relative w-full mt-16 overflow-hidden backdrop-blur-[12px] bg-white/[0.05] dark:bg-black/[0.05] border-t border-white/20 dark:border-white/10 shadow-[inset_0_1px_40px_rgba(255,255,255,0.15),0_-2px_20px_rgba(255,255,255,0.08)] dark:shadow-[inset_0_1px_40px_rgba(255,255,255,0.08),0_-2px_20px_rgba(255,255,255,0.05)]"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 via-brand-pink/3 to-brand-blue/4" />
        <div className="absolute top-4 left-16 w-40 h-40 bg-brand-orange/8 rounded-full blur-3xl opacity-60 animate-pulse" />
        <div className="absolute bottom-8 right-24 w-36 h-36 bg-brand-pink/6 rounded-full blur-2xl opacity-50 animate-pulse delay-1000" />
        <div className="absolute top-8 right-32 w-32 h-32 bg-brand-blue/5 rounded-full blur-xl opacity-40 animate-pulse delay-500" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-brand-black dark:text-brand-white mb-4 relative [text-shadow:0_0_20px_rgba(255,255,255,0.4),0_2px_8px_rgba(0,0,0,0.15)] dark:[text-shadow:0_0_25px_rgba(255,255,255,0.3),0_2px_12px_rgba(0,0,0,0.6)]">
              ArtEsfera
            </h3>
            <p className="text-brand-black/70 dark:text-brand-white/70 text-sm leading-relaxed mb-6 max-w-xs">
              Conectando artistas e criadores em uma plataforma colaborativa
              para projetos culturais e artísticos inovadores.
            </p>
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((link) => {
                const LucideIcon = Icons[
                  link.icon as keyof typeof Icons
                ] as React.ComponentType<{ className?: string }>;
                return (
                  <motion.button
                    key={link.name}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-white/30 bg-transparent backdrop-filter-none transition-all duration-300 relative overflow-hidden cursor-pointer before:content-[''] before:absolute before:top-[-2px] before:left-[-100%] before:w-full before:h-[calc(100%+4px)] before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-all before:duration-700 before:ease-out before:pointer-events-none hover:before:left-full hover:backdrop-blur-xl hover:bg-white/15 dark:hover:bg-white/8 hover:border-white/30 dark:hover:border-white/20 border border-transparent"
                    onClick={() =>
                      window.open(link.url, "_blank", "noopener,noreferrer")
                    }
                    aria-label={`Visit ${link.name}`}
                  >
                    <LucideIcon className="w-5 h-5 text-brand-black/60 dark:text-brand-white/60 transition-colors duration-300 group-hover:text-brand-navy-blue dark:group-hover:text-brand-yellow [text-shadow:0_0_15px_rgba(255,255,255,0.3)] dark:[text-shadow:0_0_20px_rgba(255,255,255,0.2)]" />
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-lg font-semibold text-brand-black dark:text-brand-white mb-4 [text-shadow:0_0_15px_rgba(255,255,255,0.3)] dark:[text-shadow:0_0_20px_rgba(255,255,255,0.2)]">
              Plataforma
            </h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-brand-black/60 dark:text-brand-white/60 hover:text-brand-navy-blue dark:hover:text-brand-yellow transition-colors duration-300 text-sm relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-gradient-to-r before:from-brand-navy-blue before:to-brand-yellow before:transition-all before:duration-300 hover:before:w-full"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold text-brand-black dark:text-brand-white mb-4 [text-shadow:0_0_15px_rgba(255,255,255,0.3)] dark:[text-shadow:0_0_20px_rgba(255,255,255,0.2)]">
              Empresa
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-brand-black/60 dark:text-brand-white/60 hover:text-brand-navy-blue dark:hover:text-brand-yellow transition-colors duration-300 text-sm relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-gradient-to-r before:from-brand-navy-blue before:to-brand-yellow before:transition-all before:duration-300 hover:before:w-full"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-lg font-semibold text-brand-black dark:text-brand-white mb-4 [text-shadow:0_0_15px_rgba(255,255,255,0.3)] dark:[text-shadow:0_0_20px_rgba(255,255,255,0.2)]">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-brand-black/60 dark:text-brand-white/60 hover:text-brand-navy-blue dark:hover:text-brand-yellow transition-colors duration-300 text-sm relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-gradient-to-r before:from-brand-navy-blue before:to-brand-yellow before:transition-all before:duration-300 hover:before:w-full"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 dark:border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-brand-black/50 dark:text-brand-white/50 text-sm mb-4 md:mb-0 [text-shadow:0_0_10px_rgba(255,255,255,0.2)] dark:[text-shadow:0_0_15px_rgba(255,255,255,0.15)]">
              &copy; {new Date().getFullYear()} ArtEsfera. Todos os direitos
              reservados.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <span className="text-brand-black/40 dark:text-brand-white/40">
                Feito com ❤️ para a comunidade artística
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
