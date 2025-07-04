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
      className="relative overflow-hidden p-2 rounded-full backdrop-blur-2xl bg-white/15 dark:bg-white/8 border border-white/25 dark:border-white/12 transition-all duration-300 hover:bg-white/25 dark:hover:bg-white/15 hover:border-white/40 dark:hover:border-white/25 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white/50 before:content-[''] before:absolute before:top-[-1px] before:left-[-100%] before:w-full before:h-[calc(100%+2px)] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-all before:duration-500 hover:before:left-full before:pointer-events-none before:z-[1]"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <Sun className="relative z-[2] h-4 w-4 text-brand-orange" />
      ) : (
        <Moon className="relative z-[2] h-4 w-4 text-brand-blue" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
