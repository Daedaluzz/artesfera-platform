"use client";

import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagBadgeProps {
  tag: string;
  variant?: "default" | "interactive" | "removable";
  size?: "sm" | "md" | "lg";
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
}

export const TagBadge: React.FC<TagBadgeProps> = ({
  tag,
  variant = "default",
  size = "md",
  onRemove,
  onClick,
  className,
}) => {
  const isClickable = onClick || variant === "interactive";
  const isRemovable = onRemove || variant === "removable";

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const baseClasses = cn(
    "inline-flex items-center gap-1 rounded-full",
    "backdrop-blur-[10px] border transition-all duration-300",
    "bg-brand-navy-blue/10 dark:bg-brand-yellow/10",
    "border-brand-navy-blue/20 dark:border-brand-yellow/20",
    "text-brand-navy-blue dark:text-brand-yellow",
    sizeClasses[size],
    {
      "cursor-pointer hover:bg-brand-navy-blue/20 dark:hover:bg-brand-yellow/20 hover:border-brand-navy-blue/30 dark:hover:border-brand-yellow/30":
        isClickable,
      "cursor-default": !isClickable && !isRemovable,
    },
    className
  );

  const TagContent = () => (
    <>
      <span className="font-medium capitalize">{tag}</span>
      {isRemovable && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-1 p-0.5 rounded-full hover:bg-brand-navy-blue/20 dark:hover:bg-brand-yellow/20 transition-colors duration-200"
          aria-label={`Remove tag ${tag}`}
        >
          <X className="w-3 h-3" />
        </motion.button>
      )}
    </>
  );

  if (isClickable && !isRemovable) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={baseClasses}
      >
        <TagContent />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={baseClasses}
      onClick={onClick}
    >
      <TagContent />
    </motion.div>
  );
};

// Wrapper component for displaying multiple tags
interface TagListProps {
  tags: string[];
  variant?: "default" | "interactive" | "removable";
  size?: "sm" | "md" | "lg";
  maxDisplay?: number;
  onTagClick?: (tag: string) => void;
  onTagRemove?: (tag: string) => void;
  className?: string;
}

export const TagList: React.FC<TagListProps> = ({
  tags,
  variant = "default",
  size = "md",
  maxDisplay,
  onTagClick,
  onTagRemove,
  className,
}) => {
  const displayTags = maxDisplay ? tags.slice(0, maxDisplay) : tags;
  const hiddenCount = maxDisplay ? Math.max(0, tags.length - maxDisplay) : 0;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {displayTags.map((tag, index) => (
        <TagBadge
          key={`${tag}-${index}`}
          tag={tag}
          variant={variant}
          size={size}
          onClick={() => onTagClick?.(tag)}
          onRemove={() => onTagRemove?.(tag)}
        />
      ))}
      {hiddenCount > 0 && (
        <TagBadge
          tag={`+${hiddenCount} mais`}
          variant="default"
          size={size}
          className="opacity-70"
        />
      )}
    </div>
  );
};

export default TagBadge;
