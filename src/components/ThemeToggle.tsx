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
      className="relative overflow-hidden p-2 rounded-full backdrop-blur-lg bg-white/20 dark:bg-black/20 border border-blue-500/20 dark:border-white/10 shadow-md shadow-blue-500/5 dark:shadow-white/5 transition-all duration-300 hover:bg-white/30 dark:hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 before:content-[''] before:absolute before:top-[-1px] before:left-[-100%] before:w-full before:h-[calc(100%+2px)] before:bg-gradient-to-r before:from-transparent before:via-blue-500/20 dark:before:via-cyan-400/20 before:to-transparent before:transition-all before:duration-500 hover:before:left-full before:pointer-events-none before:z-[1]"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <Sun className="relative z-[2] h-4 w-4 text-orange-500 drop-shadow-[0_0_4px_rgb(255,140,0)]" />
      ) : (
        <Moon className="relative z-[2] h-4 w-4 text-blue-400 drop-shadow-[0_0_4px_rgb(0,242,255)]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
