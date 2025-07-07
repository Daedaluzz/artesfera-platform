"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  Plus,
  Settings,
  BookOpen,
  FileText,
  Presentation,
  ChevronRight,
  MessageSquare,
  Sparkles,
  Menu,
  X,
  Star,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItemProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
  hasSubmenu?: boolean;
  isExpanded?: boolean;
  children?: React.ReactNode;
}

interface SpecializationItemProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  description: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface DaevaSidebarProps {
  onResetChat?: () => void;
  onSpecializationChange?: (
    specialization:
      | "general"
      | "editais"
      | "contratos"
      | "apresentacoes"
      | "produtora"
  ) => void;
  currentSpecialization?:
    | "general"
    | "editais"
    | "contratos"
    | "apresentacoes"
    | "produtora";
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  href,
  onClick,
  isActive = false,
  hasSubmenu = false,
  isExpanded = false,
  children,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const content = (
    <div
      className={`
        relative flex items-center justify-between w-full p-3 rounded-xl transition-all duration-300 group cursor-pointer overflow-hidden
        before:content-[''] before:absolute before:top-[-2px] before:left-[-100%] before:w-full before:h-[calc(100%+4px)] 
        before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent 
        before:transition-all before:duration-600 before:ease-in-out before:pointer-events-none before:z-10
        hover:before:left-full hover:backdrop-blur-xl hover:bg-white/20 hover:translate-y-[-1px]
        dark:hover:bg-white/15
        ${
          isActive
            ? "text-brand-navy-blue dark:text-brand-yellow backdrop-blur-xl bg-white/30 translate-y-[-1px] dark:bg-white/15 font-semibold"
            : "text-brand-black dark:text-brand-white hover:text-brand-navy-blue dark:hover:text-brand-yellow"
        }
      `}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3 relative z-10">
        <div
          className={`
            w-8 h-8 rounded-lg backdrop-blur-lg flex items-center justify-center transition-colors duration-300
            ${
              isActive
                ? "bg-brand-navy-blue/20 dark:bg-brand-yellow/20"
                : "bg-white/20 dark:bg-white/10 group-hover:bg-brand-navy-blue/15 dark:group-hover:bg-brand-yellow/15"
            }
          `}
        >
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      {hasSubmenu && (
        <ChevronRight
          className={`w-4 h-4 transition-transform duration-300 relative z-10 ${
            isExpanded ? "rotate-90" : ""
          }`}
        />
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return (
    <div>
      {content}
      {hasSubmenu && children && (
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="ml-4 mt-2 space-y-1">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

const SpecializationItem: React.FC<SpecializationItemProps> = ({
  icon: Icon,
  label,
  description,
  onClick,
  isActive = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative p-3 rounded-lg transition-all duration-300 group cursor-pointer overflow-hidden
        before:content-[''] before:absolute before:top-[-2px] before:left-[-100%] before:w-full before:h-[calc(100%+4px)] 
        before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent 
        before:transition-all before:duration-500 before:ease-in-out before:pointer-events-none before:z-10
        hover:before:left-full hover:backdrop-blur-lg hover:bg-white/15 hover:translate-y-[-1px]
        dark:hover:bg-white/8
        ${
          isActive
            ? "text-brand-navy-blue dark:text-brand-yellow backdrop-blur-lg bg-white/20 translate-y-[-1px] dark:bg-white/10 font-medium"
            : "text-brand-black dark:text-brand-white hover:text-brand-navy-blue dark:hover:text-brand-yellow"
        }
      `}
    >
      <div className="flex items-start gap-2.5 relative z-10">
        <div
          className={`
            w-6 h-6 rounded-md backdrop-blur-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300
            ${
              isActive
                ? "bg-brand-navy-blue/20 dark:bg-brand-yellow/20"
                : "bg-white/15 dark:bg-white/8 group-hover:bg-brand-navy-blue/15 dark:group-hover:bg-brand-yellow/15"
            }
          `}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium mb-0.5">{label}</p>
          <p className="text-xs opacity-70 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default function DaevaSidebar({
  onResetChat,
  onSpecializationChange,
  currentSpecialization = "general",
}: DaevaSidebarProps) {
  const [isSpecializationsHovered, setIsSpecializationsHovered] =
    useState(false);
  const [isMobileSpecializationsExpanded, setIsMobileSpecializationsExpanded] =
    useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isSpecializationActive = (spec: string) => {
    if (spec === "general") return currentSpecialization === "general";
    return currentSpecialization === spec;
  };

  const handleSpecializationClick = (
    specialization:
      | "general"
      | "editais"
      | "contratos"
      | "apresentacoes"
      | "produtora"
  ) => {
    if (onSpecializationChange) {
      onSpecializationChange(specialization);
    }
    setIsMobileMenuOpen(false);
    setIsSpecializationsHovered(false);
  };

  const toggleMobileSpecializations = () => {
    setIsMobileSpecializationsExpanded(!isMobileSpecializationsExpanded);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-20 left-4 z-50 w-10 h-10 rounded-lg backdrop-blur-lg bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 text-brand-black dark:text-brand-white hover:text-brand-navy-blue dark:hover:text-brand-yellow transition-colors duration-300 flex items-center justify-center"
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex relative">
        <div className="w-64 h-full backdrop-blur-2xl bg-white/8 dark:bg-white/4 border-r border-white/20 dark:border-white/10 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-white/15 dark:border-white/8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-navy-blue/20 dark:bg-brand-yellow/20 backdrop-blur-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-brand-navy-blue dark:text-brand-yellow" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-brand-black dark:text-brand-white">
                  Daeva AI
                </h2>
                <p className="text-xs text-brand-black/60 dark:text-brand-white/60">
                  Assistente Cultural
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4 space-y-2">
            <SidebarItem
              icon={Plus}
              label="Novo Chat"
              isActive={currentSpecialization === "general"}
              onClick={() => {
                handleSpecializationClick("general");
                if (onResetChat) {
                  onResetChat();
                }
              }}
            />

            <SidebarItem
              icon={History}
              label="Histórico"
              onClick={() => console.log("Histórico clicked")}
            />

            <div
              className="relative"
              onMouseEnter={() => setIsSpecializationsHovered(true)}
              onMouseLeave={() => setIsSpecializationsHovered(false)}
            >
              <SidebarItem
                icon={BookOpen}
                label="Especializações"
                isActive={[
                  "/daeva/editais",
                  "/daeva/contratos",
                  "/daeva/apresentacoes",
                ].includes(pathname)}
              />
            </div>

            <SidebarItem
              icon={Settings}
              label="Configurações"
              onClick={() => console.log("Configurações clicked")}
            />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/15 dark:border-white/8">
            <div className="text-xs text-brand-black/50 dark:text-brand-white/50 text-center">
              Versão 1.0.0
            </div>
          </div>
        </div>

        {/* Specializations Side Panel */}
        <AnimatePresence>
          {isSpecializationsHovered && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="absolute left-64 top-0 w-80 h-full backdrop-blur-2xl bg-white/12 dark:bg-white/6 border-r border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.24)] z-50"
              onMouseEnter={() => setIsSpecializationsHovered(true)}
              onMouseLeave={() => setIsSpecializationsHovered(false)}
            >
              <div className="p-6">
                <h3 className="text-lg font-bold text-brand-black dark:text-brand-white mb-2">
                  Especializações
                </h3>
                <p className="text-sm text-brand-black/60 dark:text-brand-white/60 mb-6">
                  Escolha uma especialização da Daeva para orientações
                  específicas
                </p>

                <div className="space-y-4">
                  <SpecializationItem
                    icon={FileText}
                    label="Editais"
                    description="Orientação para editais culturais e captação de recursos"
                    onClick={() => handleSpecializationClick("editais")}
                    isActive={isSpecializationActive("editais")}
                  />
                  <SpecializationItem
                    icon={MessageSquare}
                    label="Contratos"
                    description="Elaboração e revisão de contratos artísticos"
                    onClick={() => handleSpecializationClick("contratos")}
                    isActive={isSpecializationActive("contratos")}
                  />
                  <SpecializationItem
                    icon={Presentation}
                    label="Apresentações"
                    description="Planejamento e estruturação de apresentações culturais"
                    onClick={() => handleSpecializationClick("apresentacoes")}
                    isActive={isSpecializationActive("apresentacoes")}
                  />
                  <SpecializationItem
                    icon={Star}
                    label="Produtora"
                    description="Desenvolvimento de carreira artística e promoção"
                    onClick={() => handleSpecializationClick("produtora")}
                    isActive={isSpecializationActive("produtora")}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
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
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 bottom-0 z-50 w-64 lg:hidden backdrop-blur-2xl bg-white/90 dark:bg-black/90 border-r border-white/20 dark:border-white/10 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 pt-20 border-b border-white/15 dark:border-white/8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-navy-blue/20 dark:bg-brand-yellow/20 backdrop-blur-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-brand-navy-blue dark:text-brand-yellow" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-brand-black dark:text-brand-white">
                    Daeva AI
                  </h2>
                  <p className="text-xs text-brand-black/60 dark:text-brand-white/60">
                    Assistente Cultural
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-4 space-y-2">
              <div onClick={closeMobileMenu}>
                <SidebarItem
                  icon={Plus}
                  label="Novo Chat"
                  isActive={currentSpecialization === "general"}
                  onClick={() => {
                    handleSpecializationClick("general");
                    if (onResetChat) {
                      onResetChat();
                    }
                  }}
                />
              </div>

              <SidebarItem
                icon={History}
                label="Histórico"
                onClick={() => {
                  console.log("Histórico clicked");
                  closeMobileMenu();
                }}
              />

              <SidebarItem
                icon={BookOpen}
                label="Especializações"
                hasSubmenu
                isExpanded={isMobileSpecializationsExpanded}
                onClick={toggleMobileSpecializations}
              >
                <div>
                  <SpecializationItem
                    icon={FileText}
                    label="Editais"
                    description="Orientação para editais culturais e captação de recursos"
                    onClick={() => handleSpecializationClick("editais")}
                    isActive={isSpecializationActive("editais")}
                  />
                </div>
                <div>
                  <SpecializationItem
                    icon={MessageSquare}
                    label="Contratos"
                    description="Elaboração e revisão de contratos artísticos"
                    onClick={() => handleSpecializationClick("contratos")}
                    isActive={isSpecializationActive("contratos")}
                  />
                </div>
                <div>
                  <SpecializationItem
                    icon={Presentation}
                    label="Apresentações"
                    description="Planejamento e estruturação de apresentações culturais"
                    onClick={() => handleSpecializationClick("apresentacoes")}
                    isActive={isSpecializationActive("apresentacoes")}
                  />
                </div>
                <div>
                  <SpecializationItem
                    icon={Star}
                    label="Produtora"
                    description="Desenvolvimento de carreira artística e promoção"
                    onClick={() => handleSpecializationClick("produtora")}
                    isActive={isSpecializationActive("produtora")}
                  />
                </div>
              </SidebarItem>

              <SidebarItem
                icon={Settings}
                label="Configurações"
                onClick={() => {
                  console.log("Configurações clicked");
                  closeMobileMenu();
                }}
              />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/15 dark:border-white/8">
              <div className="text-xs text-brand-black/50 dark:text-brand-white/50 text-center">
                Versão 1.0.0
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
