import type { Metadata } from "next";
import { Inter, Merriweather, Roboto_Mono, Dancing_Script, Permanent_Marker } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const merriweather = Merriweather({ weight: ["300", "400", "700", "900"], subsets: ["latin"], variable: "--font-merriweather" });
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-roboto-mono" });
const dancingScript = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing-script" });
const permanentMarker = Permanent_Marker({ weight: "400", subsets: ["latin"], variable: "--font-permanent-marker" });

import Navbar from "@/components/Navbar";
import { CartProvider } from "@/lib/cartContext";

export const metadata: Metadata = {
  title: "Chops & Chips",
  description: "Delicious food delivered to you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${merriweather.variable} ${robotoMono.variable} ${dancingScript.variable} ${permanentMarker.variable} antialiased bg-gray-50`}
      >
        <ThemeProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
