import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ArtEsfera - Ecossistema de Suporte e Fomento à Arte",
    template: "%s | ArtEsfera",
  },
  description:
    "ArtEsfera é um ecossistema de suporte, fomento e profissionalização de todas as formas da arte, para artistas, criadores, fazedores de cultura e negócios culturais. Descubra, contrate e exponha talentos únicos em um ambiente digital revolucionário.",
  keywords: [
    "arte",
    "artistas",
    "criadores",
    "talentos únicos",
    "cultura",
    "negócios culturais",
    "ecossistema artístico",
    "fomento à arte",
    "profissionalização",
    "contratação de talentos",
    "exposição artística",
    "galeria",
    "plataforma",
    "obras de arte",
    "marketplace",
    "criatividade",
  ],
  authors: [{ name: "ArtEsfera Team" }],
  creator: "ArtEsfera",
  publisher: "ArtEsfera",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://app.artesfera.tech"
  ),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "ArtEsfera - Ecossistema de Suporte e Fomento à Arte",
    description:
      "ArtEsfera é um ecossistema de suporte, fomento e profissionalização de todas as formas da arte. Descubra, contrate e exponha talentos únicos em um ambiente digital revolucionário.",
    url: "https://app.artesfera.tech",
    siteName: "ArtEsfera",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArtEsfera - Ecossistema de Suporte e Fomento à Arte",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArtEsfera - Ecossistema de Suporte e Fomento à Arte",
    description:
      "ArtEsfera é um ecossistema de suporte, fomento e profissionalização de todas as formas da arte. Descubra, contrate e exponha talentos únicos em um ambiente digital revolucionário.",
    images: ["/og-image.png"],
    creator: "@artesfera",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FCC931" },
    { media: "(prefers-color-scheme: dark)", color: "#000167" },
  ],
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <JsonLd />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NavBar />
          <main className="min-h-screen flex flex-col">
            <div className="flex-grow">{children}</div>
            <Footer />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
