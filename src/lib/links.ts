import * as Icons from "lucide-react";

interface NavLink {
  title: string;
  path: string;
  icon: keyof typeof Icons; // Type for icon name
}

export const navLinks: NavLink[] = [
  { title: "Início", path: "/", icon: "Home" },
  { title: "Projetos", path: "/projects", icon: "Briefcase" },
  { title: "Daeva", path: "/daeva", icon: "Brain" },
  { title: "Galeria", path: "/gallery", icon: "GalleryHorizontal" },
  { title: "Contato", path: "/contact", icon: "MessageSquare" },
];

// Auth-related links for authenticated/unauthenticated states
export const authLinks = {
  unauthenticated: [
    { title: "Entrar", path: "/login", icon: "LogIn" as keyof typeof Icons },
  ],
  authenticated: [
    { title: "Perfil", path: "/profile", icon: "User" as keyof typeof Icons },
    { title: "Sair", path: "/logout", icon: "LogOut" as keyof typeof Icons },
  ],
};
