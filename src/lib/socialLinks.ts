import * as Icons from "lucide-react";

interface SocialLink {
  name: string;
  url: string;
  icon: keyof typeof Icons; // Type for icon name
}

export const socialLinks: SocialLink[] = [
  { name: "GitHub", url: "https://github.com/your-profile", icon: "Github" },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/your-profile",
    icon: "Linkedin",
  },
  { name: "WhatsApp", url: "https://wa.me/your-number", icon: "MessageCircle" },
];
