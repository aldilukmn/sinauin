import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ClickSpark } from "@/components/animations/ClickSpark";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "sinauin.id - Manajemen Sekolah Modern & Edukatif",
  description: "Platform SaaS sistem manajemen sekolah terintegrasi dengan game edukasi. Mudah, aman, dan dapatkan subdomain khusus untuk sekolah Anda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClickSpark sparkColor="#3b82f6" sparkSize={12} sparkRadius={25} sparkCount={10} duration={900}>
          <div className="relative w-full flex-1 flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ClickSpark>
        <Toaster position="top-center" richColors className="print:hidden" />
      </body>
    </html>
  );
}
