"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="glassmorphic-button p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 group floating-particle-effect"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <Sun className="relative z-[2] h-4 w-4 text-brand-black transition-colors duration-300 group-hover:text-brand-navy-blue enhanced-text-glow" />
      ) : (
        <Moon className="relative z-[2] h-4 w-4 text-brand-white transition-colors duration-300 group-hover:text-brand-yellow enhanced-text-glow" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
