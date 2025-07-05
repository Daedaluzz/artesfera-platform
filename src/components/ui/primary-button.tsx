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
        "glass-primary-btn group",
        fullWidth ? "w-full" : "",
        className
      )}
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.05))",
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
