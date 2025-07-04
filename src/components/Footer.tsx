
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { socialLinks } from '@/lib/socialLinks';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
      className="w-full py-4 px-8 flex flex-col md:flex-row items-center justify-between glass-card text-text-white text-sm mt-8"
    >
      <p>&copy; {new Date().getFullYear()} ArtEsfera. All rights reserved.</p>
      <div className="flex space-x-4 mt-4 md:mt-0">
        {socialLinks.map((link) => {
          const LucideIcon = Icons[link.icon as keyof typeof Icons];
          return (
            <motion.div
              key={link.name}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Link href={link.url} target="_blank" rel="noopener noreferrer">
                <LucideIcon className="w-6 h-6 text-text-white hover:text-daeva-blue transition-colors" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.footer>
  );
}
