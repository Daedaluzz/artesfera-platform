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
      className="fixed bottom-4 md:top-4 md:bottom-auto left-1/2 -translate-x-1/2 w-11/12 md:w-auto glass-card p-3 rounded-2xl depth-layer-3"
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
                        "hover:bg-white/10 hover:backdrop-blur-md hover:text-accent-iridescent-blue",
                        "focus:outline-none focus:ring-2 focus:ring-accent-iridescent-blue/50 focus:ring-offset-2 focus:ring-offset-transparent",
                        isActive
                          ? "bg-white/5 text-accent-iridescent-blue"
                          : "text-adaptive"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <LucideIcon
                        className={cn(
                          "w-4 h-4 md:w-5 md:h-5 transition-all duration-300",
                          isActive &&
                            "text-accent-iridescent-blue drop-shadow-glow"
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
