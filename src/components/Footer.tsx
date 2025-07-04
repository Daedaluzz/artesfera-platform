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
      className="relative w-full py-4 px-8 text-sm mt-8 rounded-lg backdrop-blur-lg bg-white/20 dark:bg-black/20 border border-blue-500/20 dark:border-white/10 shadow-lg shadow-blue-500/10 dark:shadow-white/5 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-yellow-400/60 dark:before:via-cyan-400/60 before:to-transparent before:pointer-events-none before:z-[1]"
    >
      <div className="flex flex-col md:flex-row items-center justify-between">
        <p className="text-gray-800 dark:text-white">
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
                  className="relative overflow-hidden w-10 h-10 rounded-full backdrop-blur-lg bg-white/20 dark:bg-black/20 border border-blue-500/20 dark:border-white/10 shadow-md shadow-blue-500/5 dark:shadow-white/5 transition-all duration-300 hover:bg-white/30 dark:hover:bg-black/30 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 before:content-[''] before:absolute before:top-[-1px] before:left-[-100%] before:w-full before:h-[calc(100%+2px)] before:bg-gradient-to-r before:from-transparent before:via-blue-500/20 dark:before:via-cyan-400/20 before:to-transparent before:transition-all before:duration-500 hover:before:left-full before:pointer-events-none before:z-[1]"
                >
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-[2] flex items-center justify-center w-full h-full"
                  >
                    <LucideIcon className="w-5 h-5 text-gray-800 dark:text-white transition-colors duration-300" />
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
