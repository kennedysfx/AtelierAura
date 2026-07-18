import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { Playfair_Display } from 'next/font/google';
import { CartProvider } from "@/context/CartContext"; 

export const metadata: Metadata = {
  title: "Atelier Aura | Ultra-Luxury Fragrance House",
  description: "Undiluted perfume oils and high-end designer fragrance impressions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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