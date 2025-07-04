"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { navLinks } from "@/lib/links";
import * as Icons from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
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
      className="fixed bottom-4 md:top-4 md:bottom-auto left-1/2 -translate-x-1/2 w-11/12 md:w-auto rounded-2xl backdrop-blur-lg bg-white/20 dark:bg-black/20 border border-blue-500/20 dark:border-white/10 shadow-lg shadow-blue-500/10 dark:shadow-white/5 p-3 z-[9999] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-blue-500/60 before:to-transparent before:pointer-events-none before:z-[1]"
      style={{ zIndex: 9999 }}
    >
      <div className="flex items-center justify-between w-full">
        <NavigationMenu className="flex-grow">
          <NavigationMenuList className="flex justify-around md:justify-center md:gap-x-4 flex-grow">
            {navLinks.map(({ title, path, icon }) => {
              const LucideIcon = Icons[
                icon as keyof typeof Icons
              ] as React.ComponentType<{ className?: string }>;
              const isActive = pathname === path;

              return (
                <NavigationMenuItem key={title}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={path}
                      className={cn(
                        "nav-link flex flex-col items-center text-xs md:text-sm md:flex-row md:gap-x-2 p-2 md:p-3 rounded-lg transition-all duration-300",
                        "hover:bg-white/10 hover:backdrop-blur-md hover:text-blue-600 dark:hover:text-blue-400",
                        "focus:outline-none focus:ring-2 focus:ring-accent-iridescent-blue/50 focus:ring-offset-2 focus:ring-offset-transparent",
                        isActive
                          ? "bg-white/5 text-blue-600 dark:text-blue-400"
                          : "text-gray-800 dark:text-white"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <LucideIcon
                        className={cn(
                          "w-4 h-4 md:w-5 md:h-5 transition-all duration-300",
                          isActive &&
                            "text-blue-600 dark:text-blue-400 drop-shadow-[0_0_4px_rgb(0,102,204)] dark:drop-shadow-[0_0_4px_rgb(0,242,255)]"
                        )}
                      />
                      <span className="mt-1 md:mt-0 text-xs">{title}</span>
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
