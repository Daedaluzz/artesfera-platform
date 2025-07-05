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
      className="glassmorphic-subtle relative w-full py-4 px-8 text-sm mt-8 rounded-xl overflow-hidden"
    >
      {/* Vibrant Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Colorful gradient overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-orange/8 via-brand-pink/6 to-brand-blue/5" />

        {/* Gradient orbs */}
        <div className="absolute top-2 left-8 w-32 h-32 bg-brand-orange/15 rounded-full blur-2xl opacity-70 animate-pulse" />
        <div className="absolute bottom-1 right-12 w-28 h-28 bg-brand-pink/12 rounded-full blur-xl opacity-60 animate-pulse delay-1000" />
        <div className="absolute top-1 right-20 w-24 h-24 bg-brand-blue/10 rounded-full blur-lg opacity-50 animate-pulse delay-500" />

        {/* Small floating particles */}
        <motion.div
          className="absolute top-3 left-16 w-2 h-2 bg-brand-orange/80 rounded-full"
          animate={{ y: [0, -8, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-3 right-8 w-1.5 h-1.5 bg-brand-pink/90 rounded-full"
          animate={{ y: [0, -6, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
        <p className="text-brand-black dark:text-brand-white relative">
          &copy; {new Date().getFullYear()} ArtEsfera. Todos os direitos
          reservados.
          {/* Small floating particle */}
          <motion.div
            className="absolute -top-1 -right-2 w-1 h-1 bg-brand-yellow/60 rounded-full"
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
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
                  className="glassmorphic-button w-10 h-10 rounded-full hover:text-brand-navy-blue dark:hover:text-brand-yellow group focus:outline-none focus:ring-2 focus:ring-white/50 floating-particle-effect"
                >
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-[2] flex items-center justify-center w-full h-full"
                  >
                    <LucideIcon className="w-5 h-5 text-brand-black dark:text-brand-white transition-colors duration-300 group-hover:text-brand-navy-blue dark:group-hover:text-brand-yellow enhanced-text-glow" />
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
