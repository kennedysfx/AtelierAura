import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { Playfair_Display } from 'next/font/google';
import { CartProvider } from "@/context/CartContext"; 

export const metadata: Metadata = {
  title: "Atelier Aura | Ultra-Luxury Fragrance House",
  description: "Undiluted perfume oils and high-end designer fragrance impressions.",
  icons: {
    icon: '/favicon.png?v=2',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png?v=2" />
      </head>
      <body>
        <CartProvider>
          <Header />
          
          <main style={{ minHeight: "calc(100vh - var(--nav-height))" }}>
            {children}
          </main>
          
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}