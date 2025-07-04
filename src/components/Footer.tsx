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
      className="w-full py-4 px-8 glass-card text-sm mt-8 refractive-border"
    >
      <div className="flex flex-col md:flex-row items-center justify-between">
        <p className="text-adaptive">
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
                  className="glass-button hover:bg-white/10 hover:text-accent-iridescent-blue w-10 h-10 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-iridescent-blue/50"
                >
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LucideIcon className="w-5 h-5 text-adaptive transition-colors duration-300" />
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
