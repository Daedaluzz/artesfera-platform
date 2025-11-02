"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "@/lib/links";
import { ThemeToggle } from "./ThemeToggle";
import Image from "next/image";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { PrimaryButton } from "@/components/ui/primary-button";
import { LogIn, Menu, X, LogOut, User } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      closeMobileMenu();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
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
          <Link
            href="/"
            className="flex items-center relative group h-full cursor-pointer"
            onClick={closeMobileMenu}
          >
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

          {/* Desktop Navigation, Auth Buttons and Theme Toggle */}
          <div className="hidden lg:flex items-stretch h-full">
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
                            "flex items-center justify-center h-full text-sm md:text-base px-2 sm:px-3 md:px-4 relative group cursor-pointer",
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
                
                {/* Dashboard link - only show when authenticated */}
                {user && (
                  <NavigationMenuItem className="h-full">
                    <NavigationMenuLink asChild className="h-full">
                      <Link
                        href="/dashboard"
                        className={cn(
                          "flex items-center justify-center h-full text-sm md:text-base px-2 sm:px-3 md:px-4 relative group cursor-pointer",
                          "hover:text-brand-navy-blue dark:hover:text-brand-yellow transition-colors duration-300",
                          "bg-transparent backdrop-filter-none shadow-none transition-all duration-300 relative overflow-hidden",
                          "before:content-[''] before:absolute before:top-[-2px] before:left-[-100%] before:w-full before:h-[calc(100%+4px)] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:transition-all before:duration-600 before:ease-in-out before:pointer-events-none before:z-10",
                          "hover:before:left-full",
                          "hover:backdrop-blur-xl hover:bg-white/20 hover:shadow-none hover:translate-y-[-1px]",
                          "dark:hover:bg-white/8",
                          pathname === "/dashboard"
                            ? "text-brand-navy-blue dark:text-brand-yellow backdrop-blur-xl bg-white/20 shadow-none translate-y-[-1px] dark:bg-white/8"
                            : "text-brand-black dark:text-brand-white",
                          "text-shadow-[0_0_15px_rgba(255,255,255,0.4),0_2px_6px_rgba(0,0,0,0.15),0_0_30px_rgba(255,255,255,0.2)] dark:text-shadow-[0_0_20px_rgba(255,255,255,0.3),0_2px_10px_rgba(0,0,0,0.6),0_0_40px_rgba(255,255,255,0.15)]"
                        )}
                        aria-current={pathname === "/dashboard" ? "page" : undefined}
                      >
                        <span className="relative z-10">Dashboard</span>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Desktop Auth Buttons */}
            <div className="flex items-center h-full gap-1 px-2">
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-navy-blue dark:border-brand-yellow" />
              ) : user ? (
                <>
                  <SecondaryButton
                    leftIcon={<User className="w-3 h-3" />}
                    onClick={() => (window.location.href = "/profile")}
                    className="px-2 py-1.5 text-xs scale-90"
                  >
                    <span className="hidden lg:inline text-xs">Perfil</span>
                  </SecondaryButton>

                  <PrimaryButton
                    leftIcon={<LogOut className="w-3 h-3" />}
                    onClick={handleLogout}
                    className="px-2 py-1.5 text-xs scale-90"
                  >
                    <span className="hidden lg:inline text-xs">Sair</span>
                  </PrimaryButton>
                </>
              ) : (
                <SecondaryButton
                  leftIcon={<LogIn className="w-3 h-3" />}
                  onClick={() => (window.location.href = "/login")}
                  className="px-2 py-1.5 text-xs scale-90"
                >
                  <span className="hidden lg:inline text-xs">Entrar</span>
                </SecondaryButton>
              )}
            </div>

            <div className="flex items-center h-full px-1">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="flex lg:hidden items-center h-full gap-2">
            <ThemeToggle />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobileMenu}
              className="flex items-center justify-center w-10 h-10 rounded-lg backdrop-blur-lg bg-white/[0.1] dark:bg-white/[0.05] border border-white/[0.2] dark:border-white/[0.1] text-brand-black dark:text-brand-white hover:text-brand-navy-blue dark:hover:text-brand-yellow transition-colors duration-300"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9998] lg:hidden"
            onClick={closeMobileMenu}
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-16 left-0 right-0 z-[9998] lg:hidden px-4"
            style={{ top: "4rem" }} // 64px = 4rem for the navbar height
          >
            <div className="relative p-6 rounded-[20px] backdrop-blur-[20px] bg-white/[0.35] dark:bg-black/[0.35] border border-white/[0.4] dark:border-white/[0.25] shadow-[0_12px_40px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_0_rgba(255,255,255,0.2),inset_0_0_30px_15px_rgba(255,255,255,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_30px_15px_rgba(255,255,255,0.06)]">
              {/* Mobile Navigation Links */}
              <div className="space-y-2 mb-6">
                {navLinks.map(({ title, path }) => {
                  const isActive = pathname === path;

                  return (
                    <Link
                      key={title}
                      href={path}
                      onClick={closeMobileMenu}
                      className={cn(
                        "flex items-center w-full px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 relative overflow-hidden group",
                        "before:content-[''] before:absolute before:top-[-2px] before:left-[-100%] before:w-full before:h-[calc(100%+4px)] before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent before:transition-all before:duration-600 before:ease-in-out before:pointer-events-none before:z-10",
                        "hover:before:left-full",
                        "hover:backdrop-blur-xl hover:bg-white/30 hover:translate-y-[-1px]",
                        "dark:hover:bg-white/15",
                        isActive
                          ? "text-brand-navy-blue dark:text-brand-yellow backdrop-blur-xl bg-white/30 translate-y-[-1px] dark:bg-white/15 font-bold"
                          : "text-brand-black dark:text-brand-white hover:text-brand-navy-blue dark:hover:text-brand-yellow"
                      )}
                    >
                      <span className="relative z-10">{title}</span>
                    </Link>
                  );
                })}
                
                {/* Dashboard link - only show when authenticated */}
                {user && (
                  <Link
                    href="/dashboard"
                    onClick={closeMobileMenu}
                    className={cn(
                      "flex items-center w-full px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 relative overflow-hidden group",
                      "before:content-[''] before:absolute before:top-[-2px] before:left-[-100%] before:w-full before:h-[calc(100%+4px)] before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent before:transition-all before:duration-600 before:ease-in-out before:pointer-events-none before:z-10",
                      "hover:before:left-full",
                      "hover:backdrop-blur-xl hover:bg-white/30 hover:translate-y-[-1px]",
                      "dark:hover:bg-white/15",
                      pathname === "/dashboard"
                        ? "text-brand-navy-blue dark:text-brand-yellow backdrop-blur-xl bg-white/30 translate-y-[-1px] dark:bg-white/15 font-bold"
                        : "text-brand-black dark:text-brand-white hover:text-brand-navy-blue dark:hover:text-brand-yellow"
                    )}
                  >
                    <span className="relative z-10">Dashboard</span>
                  </Link>
                )}
              </div>

              {/* Mobile Auth Buttons */}
              <div className="space-y-2 pt-3 border-t border-white/[0.3] dark:border-white/[0.2]">
                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-navy-blue dark:border-brand-yellow" />
                  </div>
                ) : user ? (
                  <>
                    <SecondaryButton
                      leftIcon={<User className="w-3 h-3" />}
                      onClick={() => {
                        window.location.href = "/profile";
                        closeMobileMenu();
                      }}
                      fullWidth
                      className="text-xs font-medium py-2"
                    >
                      Perfil
                    </SecondaryButton>

                    <PrimaryButton
                      leftIcon={<LogOut className="w-3 h-3" />}
                      onClick={handleLogout}
                      fullWidth
                      className="text-xs font-medium py-2"
                    >
                      Sair
                    </PrimaryButton>
                  </>
                ) : (
                  <SecondaryButton
                    leftIcon={<LogIn className="w-3 h-3" />}
                    onClick={() => {
                      window.location.href = "/login";
                      closeMobileMenu();
                    }}
                    fullWidth
                    className="text-xs font-medium py-2"
                  >
                    Entrar
                  </SecondaryButton>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
