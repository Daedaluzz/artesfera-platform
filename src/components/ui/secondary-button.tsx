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
        "glass-secondary-btn",
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
