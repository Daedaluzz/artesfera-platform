"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const { user, userDocument, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // Redirect to login if not authenticated
        router.push("/login");
        return;
      }

      if (userDocument?.username) {
        // Redirect to username-based profile
        router.push(`/@${userDocument.username}`);
      } else {
        // Fallback to user ID if username not set (shouldn't happen in normal flow)
        router.push(`/@${user.uid.slice(0, 8)}`);
      }
    }
  }, [authLoading, user, userDocument, router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-brand-cream to-brand-beige dark:from-brand-black dark:via-brand-navy-900 dark:to-brand-navy-800">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy-blue dark:border-brand-yellow"></div>
        <div className="absolute inset-0 rounded-full h-12 w-12 border-t-2 border-brand-navy-blue/20 dark:border-brand-yellow/20 animate-ping"></div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
