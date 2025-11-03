import * as Icons from "lucide-react";

interface SocialLink {
  name: string;
  url: string;
  icon: keyof typeof Icons; // Type for icon name
}

export const socialLinks: SocialLink[] = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/art.esfera.tech/",
    icon: "Instagram",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/your-profile",
    icon: "Linkedin",
  },
  { name: "WhatsApp", url: "https://wa.me/your-number", icon: "MessageCircle" },
];
