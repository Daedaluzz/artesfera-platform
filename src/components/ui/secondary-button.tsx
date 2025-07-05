"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SecondaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export function SecondaryButton({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  ...props
}: SecondaryButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.01, y: -0.5 }}
      whileTap={{ scale: 0.99 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-6 py-3 rounded-xl backdrop-blur-[15px] bg-white/[0.08] dark:bg-white/[0.06] border border-white/[0.15] dark:border-white/[0.1] shadow-[0_4px_20px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.08),inset_0_0_20px_10px_rgba(255,255,255,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.15),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.12),inset_0_0_20px_10px_rgba(255,255,255,0.05)] transition-all duration-300 relative overflow-hidden cursor-pointer before:content-[''] before:absolute before:top-[-2px] before:left-[-100%] before:w-full before:h-[calc(100%+4px)] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:transition-all before:duration-600 before:ease-in-out before:pointer-events-none before:z-10 hover:before:left-full hover:backdrop-blur-xl hover:bg-white/20 hover:translate-y-[-1px] dark:hover:bg-white/8 after:content-[''] after:absolute after:top-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        fullWidth ? "w-full" : "",
        className
      )}
      {...props}
    >
      <span className="relative z-20 flex items-center justify-center gap-2 text-base font-medium text-brand-black dark:text-brand-white hover:text-brand-navy-blue dark:hover:text-brand-yellow transition-colors duration-300">
        {leftIcon && (
          <span className="flex items-center justify-center w-4 h-4 flex-shrink-0">
            {leftIcon}
          </span>
        )}
        <span className="flex items-center justify-center">{children}</span>
        {rightIcon && (
          <span className="flex items-center justify-center w-4 h-4 flex-shrink-0">
            {rightIcon}
          </span>
        )}
      </span>
    </motion.button>
  );
}
