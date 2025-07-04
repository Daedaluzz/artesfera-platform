import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import NavBar from "@/components/NavBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArtEsfera",
  description: "A platform for artists and art lovers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-gradient-to-br from-navy-blue to-daeva-blue">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NavBar />
          <main className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8">
            <div className="glass-card flex-grow p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
