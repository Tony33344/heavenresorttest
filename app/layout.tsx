import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "HEAVEN Resort | Transformativna Idoživetja",
  description: "Transformative nature retreat and event space on a hilltop near Šmarje pri Podčetrtku. Elegant venue for weddings, corporate retreats, and private events with accommodation for 10+ guests and stunning sunset views.",
  keywords: "heaven resort, event venue, nature retreat, wedding venue, corporate retreat, šmarje pri podčetrtku, slovenia, accommodation, transformative experiences, hilltop venue, sunset views",
  openGraph: {
    title: "HEAVEN Resort | Transformativna Idoživetja",
    description: "Transformative nature retreat and event space on a hilltop near Šmarje pri Podčetrtku with stunning sunset views",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sl" className={inter.variable}>
      <body className={inter.className}>
        <LanguageProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
