import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Newsss",
  description: "Noticias sobre Inteligencia Artificial",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${geistMono.variable} min-h-full flex flex-col font-sans antialiased`} suppressHydrationWarning>
        <nav className="border-b bg-background">
          <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
            <Link href="/" className="font-black tracking-tight text-sm uppercase">
              Newsss
            </Link>
            <Link
              href="/settings"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Configuracion
            </Link>
          </div>
        </nav>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
