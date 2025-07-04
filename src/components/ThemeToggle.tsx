
'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <motion.button
      className="glass-button p-2 rounded-full"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? (
        <Sun className="h-5 w-5 text-accent-orange" />
      ) : (
        <Moon className="h-5 w-5 text-daeva-blue" />
      )}
      <span className="sr-only">Toggle theme</span>
    </motion.button>
  );
}
