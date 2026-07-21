"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./cosmetics.module.css";
import { useCart } from "@/context/CartContext";

// The 16 lip cosmetics exactly as they map to your folder
const LIP_COSMETICS = [
  { id: "lip_ashton", name: "ASHTON LIP TINT", brand: "ATELIER AURA", price: "₦32,000", image: "/lipcosmetic/ashton.jpg", sizes: ["5ML"] },
  { id: "lip_bullet", name: "SIGNATURE MATTE", brand: "ATELIER AURA", price: "₦42,000", image: "/lipcosmetic/bullet.jpg", sizes: ["3.5G"] },
  { id: "lip_chanel", name: "ROUGE ALLURE", brand: "CHANEL", price: "₦65,000", image: "/lipcosmetic/chanel.jpg", sizes: ["3.5G"] },
  { id: "lip_dior", name: "ADDICT LIP GLOW", brand: "DIOR", price: "₦58,000", image: "/lipcosmetic/dior.jpg", sizes: ["3.2G"] },
  { id: "lip_gold", name: "AURA GOLD RED", brand: "ATELIER AURA", price: "₦55,000", image: "/lipcosmetic/gold.jpg", sizes: ["4G"] },
  { id: "lip_hozho", name: "HOZHO MATTE", brand: "ATELIER AURA", price: "₦38,000", image: "/lipcosmetic/hozho.jpg", sizes: ["4G"] },
  { id: "lip_kahi", name: "WRINKLE BOUNCE", brand: "KAHI", price: "₦45,000", image: "/lipcosmetic/kahi.jpg", sizes: ["9G"] },
  { id: "lip_lipss", name: "ESSENTIAL SERUM", brand: "ATELIER AURA", price: "₦30,000", image: "/lipcosmetic/lipss.jpg", sizes: ["10ML"] },
  { id: "lip_luxe", name: "LUXE BOLD ROUGE", brand: "ATELIER AURA", price: "₦45,000", image: "/lipcosmetic/luxe.jpg", sizes: ["3.5G", "4G"] },
  { id: "lip_mars", name: "MARS VELVET", brand: "ATELIER AURA", price: "₦36,000", image: "/lipcosmetic/mars.jpg", sizes: ["3.5G"] },
  { id: "lip_nonstop", name: "NONSTOP LIQUID", brand: "ATELIER AURA", price: "₦34,000", image: "/lipcosmetic/nonstop.jpg", sizes: ["6ML"] },
  { id: "lip_oil", name: "NOURISHING OIL", brand: "ATELIER AURA", price: "₦40,000", image: "/lipcosmetic/oil.jpg", sizes: ["7ML"] },
  { id: "lip_petal", name: "ROSE PETAL", brand: "ATELIER AURA", price: "₦40,000", image: "/lipcosmetic/petal.jpg", sizes: ["3.5G"] },
  { id: "lip_rhode", name: "PEPTIDE TREATMENT", brand: "RHODE", price: "₦28,000", image: "/lipcosmetic/rhode.jpg", sizes: ["10ML"] },
  { id: "lip_topface", name: "MAUVE SEDUCTION", brand: "TOPFACE", price: "₦28,000", image: "/lipcosmetic/topface.jpg", sizes: ["4G"] },
  { id: "lip_yanlanxi", name: "LUMINOUS BB", brand: "YANLANXI", price: "₦35,000", image: "/lipcosmetic/yanlanxi.jpg", sizes: ["30G"] }
];

// Product Card Component for clean reusability

const ProductCard = ({ product }: { product: typeof LIP_COSMETICS[0] }) => {
  const [activeSize, setActiveSize] = useState(product.sizes[0]);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents navigating to the product page when clicking the cart icon
    addToCart({ ...product, selectedSize: activeSize, quantity: 1 });
  };

  return (
    <div className={styles.productCard}>
      <Link href={`/product/${product.id}`} className={styles.imageLinkWrapper}>
        <div className={styles.imageContainer}>
          <img src={product.image} alt={product.name} className={styles.productImage} />
          <button className={styles.cartIconButton} onClick={handleAddToCart} aria-label="Add to cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.cartIcon}>
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </button>
        </div>
      </Link>
      
      <div className={styles.productDetails}>
        <span className={styles.brandName}>{product.brand}</span>
        <h2 className={styles.productName}>{product.name}</h2>
        
        <div className={styles.sizeSelectorGroup}>
          {product.sizes.map((size) => (
            <button 
              key={size}
              className={`${styles.sizeBox} ${activeSize === size ? styles.activeSize : ""}`}
              onClick={() => setActiveSize(size)}
            >
              {size}
            </button>
          ))}
        </div>

        {/* UPDATED: Now a Link that navigates to the individual product page */}
        <Link href={`/product/${product.id}`} className={styles.priceBlockButton}>
          {product.price}
        </Link>
      </div>
    </div>
  );
};

export default function CosmeticsPage() {
  const mainCosmetics = LIP_COSMETICS.slice(0, 10);
  const crossSellCosmetics = LIP_COSMETICS.slice(10, 16);

  return (
    <main className={styles.pageWrapper}>
      {/* SECTION 1: LUXE COSMETICS (10 Items) */}
      <section className={styles.productSection}>
        <h1 className={styles.sectionHeader}>LUXE COSMETICS</h1>
        <div className={styles.productGrid}>
          {mainCosmetics.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      {/* SECTION 2: YOU MAY ALSO LIKE (6 Items) */}
      <section className={styles.productSection}>
        <h2 className={styles.sectionHeaderSecondary}>YOU MAY ALSO LIKE</h2>
        <div className={styles.productGrid}>
          {crossSellCosmetics.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </main>
  );
}