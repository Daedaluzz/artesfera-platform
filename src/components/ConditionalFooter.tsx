"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Don't show footer on Daeva page
  if (pathname === "/daeva") {
    return null;
  }

  return <Footer />;
}
