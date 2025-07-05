import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-brand-navy-blue/50 dark:focus-visible:ring-brand-yellow/50 backdrop-blur-xl relative",
  {
    variants: {
      variant: {
        default:
          "bg-white/[0.15] dark:bg-white/[0.08] border border-white/[0.2] dark:border-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.24)] hover:bg-white/[0.25] dark:hover:bg-white/[0.12] hover:border-white/[0.3] dark:hover:border-white/[0.25] hover:shadow-[0_16px_40px_rgba(0,0,0,0.16)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.32)] text-brand-black dark:text-brand-white hover:text-brand-navy-blue dark:hover:text-brand-yellow",
        destructive:
          "bg-white/[0.1] dark:bg-white/[0.05] border border-red-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.24)] hover:bg-white/[0.15] dark:hover:bg-white/[0.08] hover:border-red-500/50 hover:shadow-[0_16px_40px_rgba(239,68,68,0.3)] text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300",
        outline:
          "bg-white/[0.08] dark:bg-white/[0.04] border border-white/[0.15] dark:border-white/[0.1] shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.16)] hover:bg-white/[0.15] dark:hover:bg-white/[0.08] hover:border-white/[0.25] dark:hover:border-white/[0.2] hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.24)] text-brand-black dark:text-brand-white hover:text-brand-navy-blue dark:hover:text-brand-yellow",
        secondary:
          "bg-white/[0.05] dark:bg-white/[0.02] border border-white/[0.1] dark:border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:bg-white/[0.1] dark:hover:bg-white/[0.05] hover:border-white/[0.15] dark:hover:border-white/[0.1] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.16)] text-brand-black/70 dark:text-brand-white/70 hover:text-brand-black dark:hover:text-brand-white",
        ghost:
          "bg-transparent shadow-none hover:bg-white/[0.1] dark:hover:bg-white/[0.05] text-brand-black dark:text-brand-white hover:text-brand-navy-blue dark:hover:text-brand-yellow",
        link: "bg-transparent shadow-none text-brand-navy-blue dark:text-brand-yellow underline-offset-4 hover:underline",
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
