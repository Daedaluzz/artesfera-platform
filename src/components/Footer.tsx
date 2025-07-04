"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import * as Icons from "lucide-react";
import { socialLinks } from "@/lib/socialLinks";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
      className="relative w-full py-4 px-8 text-sm mt-8 rounded-xl backdrop-blur-xl bg-white/15 dark:bg-white/8 border border-white/30 dark:border-white/15 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent before:pointer-events-none before:z-[1]"
    >
      <div className="flex flex-col md:flex-row items-center justify-between">
        <p className="text-brand-black dark:text-brand-white">
          &copy; {new Date().getFullYear()} ArtEsfera. Todos os direitos
          reservados.
        </p>
        <div className="flex space-x-2 mt-4 md:mt-0">
          {socialLinks.map((link) => {
            const LucideIcon = Icons[
              link.icon as keyof typeof Icons
            ] as React.ComponentType<{ className?: string }>;
            return (
              <motion.div
                key={link.name}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="relative overflow-hidden w-10 h-10 rounded-full backdrop-blur-2xl bg-white/15 dark:bg-white/8 border border-white/25 dark:border-white/12 transition-all duration-300 hover:bg-white/25 dark:hover:bg-white/15 hover:border-white/40 dark:hover:border-white/25 hover:-translate-y-1 hover:text-brand-blue dark:hover:text-brand-blue focus:outline-none focus:ring-2 focus:ring-white/50 before:content-[''] before:absolute before:top-[-1px] before:left-[-100%] before:w-full before:h-[calc(100%+2px)] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-all before:duration-500 hover:before:left-full before:pointer-events-none before:z-[1]"
                >
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-[2] flex items-center justify-center w-full h-full"
                  >
                    <LucideIcon className="w-5 h-5 text-brand-black dark:text-brand-white transition-colors duration-300" />
                    <span className="sr-only">{link.name}</span>
                  </Link>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.footer>
  );
}
