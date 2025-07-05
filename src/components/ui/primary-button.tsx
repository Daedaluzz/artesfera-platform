"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  showArrow?: boolean;
  arrowIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export function PrimaryButton({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
  showArrow = false,
  arrowIcon,
  leftIcon,
  rightIcon,
  fullWidth = false,
  ...props
}: PrimaryButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.01, y: -0.5 }}
      whileTap={{ scale: 0.99 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group px-6 py-3 rounded-xl backdrop-blur-[15px] bg-white/[0.15] dark:bg-white/[0.12] border-2 border-transparent shadow-[0_4px_20px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.2),inset_0_0_20px_10px_rgba(255,255,255,0.1)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.15),inset_0_0_20px_10px_rgba(255,255,255,0.05)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-1px_0_rgba(255,255,255,0.3),inset_0_0_20px_10px_rgba(255,255,255,0.15)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.2),inset_0_0_20px_10px_rgba(255,255,255,0.08)] transition-all duration-300 relative overflow-hidden cursor-pointer before:content-[''] before:absolute before:inset-0 before:rounded-xl before:p-[2px] before:bg-gradient-to-r before:from-white/60 before:via-white/80 before:to-white/60 before:-m-[2px] before:-z-10 after:content-[''] after:absolute after:top-[-2px] after:left-[-100%] after:w-full after:h-[calc(100%+4px)] after:bg-gradient-to-r after:from-transparent after:via-white/40 after:to-transparent after:transition-all after:duration-600 after:ease-in-out after:pointer-events-none after:z-10 hover:after:left-full hover:backdrop-blur-xl hover:bg-white/20 hover:translate-y-[-1px] dark:hover:bg-white/8 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        fullWidth ? "w-full" : "",
        className
      )}
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.12))",
      }}
      {...props}
    >
      <span className="relative z-20 flex items-center justify-center gap-2 text-base font-medium text-brand-black dark:text-brand-black">
        {leftIcon && (
          <span className="flex items-center justify-center w-4 h-4 flex-shrink-0">
            {leftIcon}
          </span>
        )}
        <span className="flex items-center justify-center">{children}</span>
        {showArrow && (
          <span className="flex items-center justify-center w-4 h-4 flex-shrink-0">
            {arrowIcon || (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
            )}
          </span>
        )}
        {rightIcon && !showArrow && (
          <span className="flex items-center justify-center w-4 h-4 flex-shrink-0">
            {rightIcon}
          </span>
        )}
      </span>
    </motion.button>
  );
}
