
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { navLinks } from '@/lib/links';
import * as Icons from 'lucide-react';

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav
      role="navigation"
      className="fixed bottom-4 md:top-4 md:bottom-auto left-1/2 -translate-x-1/2 w-11/12 md:w-auto glass-card p-2 rounded-2xl border border-white/10 shadow-glass-sm z-50"
    >
      <ul className="flex justify-around md:justify-center md:gap-x-8">
        {navLinks.map(({ title, path, icon }) => {
          const LucideIcon = Icons[icon as keyof typeof Icons];
          const isActive = pathname === path;

          return (
            <li key={title}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 120, damping: 14 }}
              >
                <Link
                  href={path}
                  className={`flex flex-col items-center text-xs md:text-sm md:flex-row md:gap-x-2 p-2 rounded-lg transition-colors ${isActive ? 'text-daeva-blue' : 'text-text-white'}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <LucideIcon className="w-5 h-5" />
                  <span className="mt-1 md:mt-0">{title}</span>
                </Link>
              </motion.div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
