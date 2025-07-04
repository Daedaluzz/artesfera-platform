import * as Icons from "lucide-react";

interface NavLink {
  title: string;
  path: string;
  icon: keyof typeof Icons; // Type for icon name
}

export const navLinks: NavLink[] = [
  { title: "Início", path: "/", icon: "Home" },
  { title: "Galeria", path: "/gallery", icon: "GalleryHorizontal" },
  { title: "Contato", path: "/contact", icon: "MessageSquare" },
];
