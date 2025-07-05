"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { navLinks } from "@/lib/links";
import { ThemeToggle } from "./ThemeToggle";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav
      role="navigation"
      className="glassmorphic-navbar sticky top-0 w-full p-4 z-[9999] overflow-hidden"
    >
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-brand-yellow/3 via-transparent to-brand-blue/3" />

        {/* Small gradient orbs */}
        <div className="absolute top-1 left-1/4 w-16 h-16 bg-brand-yellow/8 rounded-full blur-xl opacity-60 animate-pulse" />
        <div className="absolute top-1 right-1/3 w-14 h-14 bg-brand-blue/6 rounded-full blur-lg opacity-50 animate-pulse delay-1000" />

        {/* Tiny floating particles */}
        <motion.div
          className="absolute top-2 left-12 w-1 h-1 bg-brand-yellow/50 rounded-full"
          animate={{ y: [0, -4, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-3 right-16 w-0.5 h-0.5 bg-brand-orange/60 rounded-full"
          animate={{ y: [0, -3, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
        />
      </div>

      <div className="flex items-center justify-between w-full max-w-6xl mx-auto relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center relative group">
          <Image
            src="/logo.svg"
            alt="ArtEsfera"
            width={32}
            height={32}
            className="w-8 h-8 transition-transform duration-300 group-hover:scale-105"
          />
          <span className="ml-2 text-lg font-semibold text-brand-black dark:text-brand-white transition-colors duration-300 group-hover:text-brand-navy-blue dark:group-hover:text-brand-yellow">
            ArtEsfera
          </span>
          {/* Floating particle on logo */}
          <motion.div
            className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-brand-yellow/70 rounded-full opacity-0 group-hover:opacity-100"
            animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </Link>

        <NavigationMenu className="flex-grow">
          <NavigationMenuList className="flex justify-center md:gap-x-6 flex-grow">
            {navLinks.map(({ title, path }) => {
              const isActive = pathname === path;

              return (
                <NavigationMenuItem key={title}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={path}
                      className={cn(
                        "glassmorphic-button nav-link flex items-center text-sm md:text-base p-2 md:p-3 rounded-lg relative group floating-particle-effect enhanced-text-glow",
                        "hover:text-brand-navy-blue dark:hover:text-brand-yellow",
                        "focus:outline-none focus:text-brand-navy-blue dark:focus:text-brand-yellow",
                        isActive
                          ? "bg-white/10 text-brand-navy-blue dark:text-brand-yellow"
                          : "text-brand-black dark:text-brand-white"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span className="relative z-10">{title}</span>
                      {/* Colorful underline on hover */}
                      <motion.div
                        className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-brand-yellow via-brand-orange to-brand-pink rounded-full"
                        whileHover={{
                          width: "100%",
                          transition: { duration: 0.3, ease: "easeOut" },
                        }}
                      />
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-2">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
