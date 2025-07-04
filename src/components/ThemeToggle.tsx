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
      className="glass-button relative p-2 rounded-full transition-all duration-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent-iridescent-blue/50"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <Sun className="h-4 w-4 text-accent-glowing-orange drop-shadow-glow-orange" />
      ) : (
        <Moon className="h-4 w-4 text-accent-iridescent-blue drop-shadow-glow" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
