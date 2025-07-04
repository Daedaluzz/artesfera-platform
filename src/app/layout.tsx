import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArtEsfera",
  description: "Uma plataforma para artistas e amantes da arte.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NavBar />
          <main className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8">
            <div className="relative flex-grow p-4 sm:p-6 lg:p-8 rounded-lg backdrop-blur-lg bg-white/20 dark:bg-black/20 border border-blue-500/20 dark:border-white/10 shadow-lg shadow-blue-500/10 dark:shadow-white/5 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-yellow-400/60 dark:before:via-cyan-400/60 before:to-transparent before:pointer-events-none before:z-[1]">
              {children}
            </div>
            <Footer />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
