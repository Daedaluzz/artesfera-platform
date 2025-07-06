"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import { socialLinks } from "@/lib/socialLinks";

export default function Footer() {
  const pathname = usePathname();

  // Don't render footer on Daeva pages (including subpages)
  if (pathname.startsWith("/daeva")) {
    return null;
  }
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
      className="relative w-full py-4 px-8 text-sm mt-8 overflow-hidden backdrop-blur-[8px] bg-white/[0.02] dark:bg-black/[0.02] border border-white/30 dark:border-white/25 shadow-[inset_0_0_20px_rgba(255,255,255,0.2),inset_0_0_40px_rgba(255,255,255,0.1),0_0_20px_rgba(255,255,255,0.1)] dark:shadow-[inset_0_0_20px_rgba(255,255,255,0.15),inset_0_0_40px_rgba(255,255,255,0.08),0_0_20px_rgba(255,255,255,0.08)] transition-all duration-300"
    >
      {/* Simplified Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/8 via-brand-pink/6 to-brand-blue/5" />
        <div className="absolute top-2 left-8 w-32 h-32 bg-brand-orange/15 rounded-full blur-2xl opacity-70 animate-pulse" />
        <div className="absolute bottom-1 right-12 w-28 h-28 bg-brand-pink/12 rounded-full blur-xl opacity-60 animate-pulse delay-1000" />
        <div className="absolute top-1 right-20 w-24 h-24 bg-brand-blue/10 rounded-full blur-lg opacity-50 animate-pulse delay-500" />
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
        <div className="text-brand-black dark:text-brand-white relative text-sm [text-shadow:0_0_15px_rgba(255,255,255,0.4),0_2px_6px_rgba(0,0,0,0.15),0_0_30px_rgba(255,255,255,0.2)] dark:[text-shadow:0_0_20px_rgba(255,255,255,0.3),0_2px_10px_rgba(0,0,0,0.6),0_0_40px_rgba(255,255,255,0.15)]">
          &copy; {new Date().getFullYear()} ArtEsfera. Todos os direitos
          reservados.
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          {socialLinks.map((link) => {
            const LucideIcon = Icons[
              link.icon as keyof typeof Icons
            ] as React.ComponentType<{ className?: string }>;
            return (
              <motion.button
                key={link.name}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-white/50 bg-transparent backdrop-filter-none shadow-none transition-all duration-300 relative overflow-hidden cursor-pointer before:content-[''] before:absolute before:top-[-2px] before:left-[-100%] before:w-full before:h-[calc(100%+4px)] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:transition-all before:duration-600 before:ease-in-out before:pointer-events-none before:z-10 hover:before:left-full hover:backdrop-blur-xl hover:bg-white/20 hover:shadow-none hover:-translate-y-0.5 dark:hover:bg-white/8"
                onClick={() =>
                  window.open(link.url, "_blank", "noopener,noreferrer")
                }
                aria-label={`Visit ${link.name}`}
              >
                <LucideIcon className="relative z-[2] w-6 h-6 text-brand-black dark:text-brand-white transition-colors duration-300 group-hover:text-brand-navy-blue dark:group-hover:text-brand-yellow [text-shadow:0_0_15px_rgba(255,255,255,0.4),0_2px_6px_rgba(0,0,0,0.15),0_0_30px_rgba(255,255,255,0.2)] dark:[text-shadow:0_0_20px_rgba(255,255,255,0.3),0_2px_10px_rgba(0,0,0,0.6),0_0_40px_rgba(255,255,255,0.15)]" />
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.footer>
  );
}
