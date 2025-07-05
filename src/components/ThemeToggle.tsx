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
      className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 group bg-transparent backdrop-filter-none shadow-none transition-all duration-300 relative overflow-hidden before:content-[''] before:absolute before:top-[-2px] before:left-[-100%] before:w-full before:h-[calc(100%+4px)] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:transition-all before:duration-600 before:ease-in-out before:pointer-events-none before:z-10 hover:before:left-full hover:backdrop-blur-xl hover:bg-white/20 hover:shadow-none hover:-translate-y-0.5 dark:hover:bg-white/8"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <Sun className="relative z-[2] h-4 w-4 text-brand-black transition-colors duration-300 group-hover:text-brand-navy-blue [text-shadow:0_0_15px_rgba(255,255,255,0.4),0_2px_6px_rgba(0,0,0,0.15),0_0_30px_rgba(255,255,255,0.2)] dark:[text-shadow:0_0_20px_rgba(255,255,255,0.3),0_2px_10px_rgba(0,0,0,0.6),0_0_40px_rgba(255,255,255,0.15)]" />
      ) : (
        <Moon className="relative z-[2] h-4 w-4 text-brand-white transition-colors duration-300 group-hover:text-brand-yellow [text-shadow:0_0_15px_rgba(255,255,255,0.4),0_2px_6px_rgba(0,0,0,0.15),0_0_30px_rgba(255,255,255,0.2)] dark:[text-shadow:0_0_20px_rgba(255,255,255,0.3),0_2px_10px_rgba(0,0,0,0.6),0_0_40px_rgba(255,255,255,0.15)]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
