
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-10rem)] px-4 py-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="font-serif text-4xl sm:text-5xl lg:text-6xl text-text-white mb-4 leading-tight"
      >
        Discover, Create, and Collect <br className="hidden sm:inline" />
        Digital Art with ArtEsfera
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        className="font-sans text-lg sm:text-xl text-text-white mb-8 max-w-2xl"
      >
        ArtEsfera is a revolutionary platform where artists can showcase their
        unique creations and art enthusiasts can explore a curated collection
        of digital masterpieces.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
      >
        <Link href="/gallery" className="glass-button">
          Explore Gallery
        </Link>
      </motion.div>
    </section>
  );
}
