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
      className="sticky h-16 top-0 w-full z-[9999] overflow-hidden backdrop-blur-2xl bg-gradient-to-br from-white/15 via-white/8 to-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_4px_32px_rgba(0,0,0,0.08)] dark:from-white/6 dark:via-white/3 dark:to-white/5 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_4px_32px_rgba(0,0,0,0.15)]"
    >
      {/* Simplified Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-yellow/3 via-transparent to-brand-blue/3" />
        <div className="absolute top-1 left-1/4 w-16 h-16 bg-brand-yellow/8 rounded-full blur-xl opacity-60 animate-pulse" />
        <div className="absolute top-1 right-1/3 w-14 h-14 bg-brand-blue/6 rounded-full blur-lg opacity-50 animate-pulse delay-1000" />
      </div>

      <div className="flex items-stretch justify-between w-full max-w-6xl mx-auto relative z-10 h-full px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center relative group h-full">
          <div className="bg-brand-black rounded-lg p-3 mr-3 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/logo.svg"
              alt="ArtEsfera"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </div>
          <span className="text-xl font-bold text-brand-black dark:text-brand-white transition-colors duration-300 group-hover:text-brand-navy-blue dark:group-hover:text-brand-yellow">
            ArtEsfera
          </span>
        </Link>

        {/* Navigation and Theme Toggle - Right Side */}
        <div className="flex items-stretch h-full">
          <NavigationMenu className="flex items-stretch h-full">
            <NavigationMenuList className="flex items-stretch h-full gap-0">
              {navLinks.map(({ title, path }) => {
                const isActive = pathname === path;

                return (
                  <NavigationMenuItem key={title} className="h-full">
                    <NavigationMenuLink asChild className="h-full">
                      <Link
                        href={path}
                        className={cn(
                          "flex items-center justify-center h-full text-sm md:text-base px-3 md:px-4 relative group",
                          "hover:text-brand-navy-blue dark:hover:text-brand-yellow transition-colors duration-300",
                          "bg-transparent backdrop-filter-none shadow-none transition-all duration-300 relative overflow-hidden",
                          "before:content-[''] before:absolute before:top-[-2px] before:left-[-100%] before:w-full before:h-[calc(100%+4px)] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:transition-all before:duration-600 before:ease-in-out before:pointer-events-none before:z-10",
                          "hover:before:left-full",
                          "hover:backdrop-blur-xl hover:bg-white/20 hover:shadow-none hover:translate-y-[-1px]",
                          "dark:hover:bg-white/8",
                          isActive
                            ? "text-brand-navy-blue dark:text-brand-yellow backdrop-blur-xl bg-white/20 shadow-none translate-y-[-1px] dark:bg-white/8"
                            : "text-brand-black dark:text-brand-white",
                          "text-shadow-[0_0_15px_rgba(255,255,255,0.4),0_2px_6px_rgba(0,0,0,0.15),0_0_30px_rgba(255,255,255,0.2)] dark:text-shadow-[0_0_20px_rgba(255,255,255,0.3),0_2px_10px_rgba(0,0,0,0.6),0_0_40px_rgba(255,255,255,0.15)]"
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span className="relative z-10">{title}</span>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center h-full px-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
