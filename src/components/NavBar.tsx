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
      className="sticky top-0 w-full backdrop-blur-2xl bg-white/15 dark:bg-white/8 border-b border-white/30 dark:border-white/15 p-4 z-[9999] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent before:pointer-events-none before:z-[1]"
    >
      <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="ArtEsfera"
            width={32}
            height={32}
            className="w-8 h-8 color-red-500 dark:color-yellow-500"
          />
          <span className="ml-2 text-lg font-semibold text-brand-black dark:text-brand-white">
            ArtEsfera
          </span>
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
                        "nav-link flex items-center text-sm md:text-base p-2 md:p-3 rounded-lg transition-all duration-300",
                        "hover:bg-white/15 hover:backdrop-blur-md hover:text-brand-navy-blue dark:hover:text-brand-yellow",
                        "focus:outline-none focus:text-brand-navy-blue dark:focus:text-brand-black",
                        isActive
                          ? "bg-white/10 text-brand-navy-blue dark:text-brand-yellow"
                          : "text-brand-black dark:text-brand-white"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span>{title}</span>
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
