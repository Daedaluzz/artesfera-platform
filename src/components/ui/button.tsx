import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-brand-navy-blue/50 dark:focus-visible:ring-brand-yellow/50 backdrop-blur-xl relative overflow-hidden cursor-pointer before:content-[''] before:absolute before:top-[-2px] before:left-[-100%] before:w-full before:h-[calc(100%+4px)] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:transition-all before:duration-600 before:ease-in-out before:pointer-events-none before:z-10 hover:before:left-full hover:backdrop-blur-xl hover:translate-y-[-1px]",
  {
    variants: {
      variant: {
        default:
          "bg-white/[0.15] dark:bg-white/[0.12] border border-white/[0.2] dark:border-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.2),inset_0_0_20px_10px_rgba(255,255,255,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.15),inset_0_0_20px_10px_rgba(255,255,255,0.05)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-1px_0_rgba(255,255,255,0.3),inset_0_0_20px_10px_rgba(255,255,255,0.15)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.2),inset_0_0_20px_10px_rgba(255,255,255,0.08)] text-brand-black dark:text-brand-white hover:text-brand-navy-blue dark:hover:text-brand-yellow hover:bg-white/20 dark:hover:bg-white/8 [&>*]:relative [&>*]:z-20",
        destructive:
          "bg-white/[0.1] dark:bg-white/[0.08] border border-red-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.08),inset_0_0_20px_10px_rgba(255,255,255,0.03)] hover:border-red-500/50 hover:shadow-[0_16px_40px_rgba(239,68,68,0.3),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.15),inset_0_0_20px_10px_rgba(255,255,255,0.08)] text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 [&>*]:relative [&>*]:z-20",
        outline:
          "bg-white/[0.08] dark:bg-white/[0.06] border border-white/[0.15] dark:border-white/[0.1] shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.08),inset_0_0_20px_10px_rgba(255,255,255,0.03)] hover:border-white/[0.25] dark:hover:border-white/[0.2] hover:shadow-[0_16px_40px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.15),inset_0_0_20px_10px_rgba(255,255,255,0.08)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.12),inset_0_0_20px_10px_rgba(255,255,255,0.05)] text-brand-black dark:text-brand-white hover:text-brand-navy-blue dark:hover:text-brand-yellow hover:bg-white/20 dark:hover:bg-white/8 [&>*]:relative [&>*]:z-20",
        secondary:
          "bg-white/[0.05] dark:bg-white/[0.04] border border-white/[0.1] dark:border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.08),inset_0_0_20px_10px_rgba(255,255,255,0.03)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05),inset_0_0_20px_10px_rgba(255,255,255,0.02)] hover:border-white/[0.15] dark:hover:border-white/[0.1] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.12),inset_0_0_20px_10px_rgba(255,255,255,0.05)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.08),inset_0_0_20px_10px_rgba(255,255,255,0.03)] text-brand-black/70 dark:text-brand-white/70 hover:text-brand-black dark:hover:text-brand-white [&>*]:relative [&>*]:z-20",
        ghost:
          "bg-transparent shadow-none hover:bg-white/[0.1] dark:hover:bg-white/[0.05] text-brand-black dark:text-brand-white hover:text-brand-navy-blue dark:hover:text-brand-yellow [&>*]:relative [&>*]:z-20",
        link: "bg-transparent shadow-none text-brand-navy-blue dark:text-brand-yellow underline-offset-4 hover:underline [&>*]:relative [&>*]:z-20",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-xl gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-2xl px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
