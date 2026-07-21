"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./cosmetics.module.css";
import { useCart } from "@/context/CartContext";

// The 16 lip cosmetics exactly as you have them
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

const ProductCard = ({ product }: { product: typeof LIP_COSMETICS[0] }) => {
  const [activeSize, setActiveSize] = useState(product.sizes[0]);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
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
      {/* NEW HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroImageContainer}>
          <img src="/cosmetic/cosmetic-l.avif" alt="Atelier Aura Cosmetics Landscape" className={styles.heroImageLandscape} />
          <img src="/cosmetic/cosmetic-p.avif" alt="Atelier Aura Cosmetics Portrait" className={styles.heroImagePortrait} />
          <div className={styles.heroOverlay}></div>
        </div>
        <div className={styles.heroContent}>
          <span className={styles.heroSubtitle}>THE COUTURE ANTHOLOGY</span>
          <h1 className={styles.heroTitle}>ATELIER COSMETICS</h1>
          <p className={styles.heroDescription}>
            Discover an elevated collection of avant-garde lip artistry. Infused with botanical moisture complexes and luminous micro-pigments, engineered to radiate supreme presence.
          </p>
        </div>
      </section>

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

      
      {/* ==========================================
   LUXURY FEATURES SECTION (PURE BLACK + EXACT SVGS)
   ========================================== */}
<section className={styles.luxuryFeaturesSection}>
  <div className={styles.luxuryFeaturesContainer}>
    
    {/* Feature 1: 7-Days Returns */}
    <div className={styles.luxuryFeatureCard}>
      <div className={styles.luxuryIconWrapper}>
        <svg viewBox="0 0 100 100" className={styles.luxurySvgIcon} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Circular return arrow */}
          <path d="M72 48 C 72 28, 28 28, 28 48 C 28 68, 72 68, 72 48" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <path d="M66 40 L72 48 L78 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          {/* Inner box */}
          <path d="M42 45 L50 40 L58 45 L58 55 L50 60 L42 55 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
          <path d="M42 45 L50 50 L58 45" stroke="currentColor" strokeWidth="2.5" fill="none"/>
          <path d="M50 50 L50 60" stroke="currentColor" strokeWidth="2.5" fill="none"/>
          {/* '7 DAYS' labels */}
          <text x="50%" y="24" textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="bold" fontFamily="sans-serif">7</text>
          <text x="50%" y="34" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="bold" fontFamily="sans-serif">DAYS</text>
          {/* Curved helper texts represented elegantly */}
          <path id="curve-top" d="M 20 50 A 30 30 0 0 1 80 50" fill="none" />
          <path id="curve-bottom" d="M 80 50 A 30 30 0 0 1 20 50" fill="none" />
          <text fontSize="4.5" fill="currentColor" letterSpacing="0.6" fontWeight="600" fontFamily="sans-serif">
            <textPath href="#curve-bottom" startOffset="50%" textAnchor="middle">NO-QUESTIONS ASKED RETURN</textPath>
          </text>
        </svg>
      </div>
      <div className={styles.luxuryTextContent}>
        <h3 className={styles.luxuryFeatureTitle}>No Questions Asked Returns</h3>
        <p className={styles.luxuryFeatureDescription}>
          Applicable on first order of 100ml and 50ml perfume bottles only.
        </p>
      </div>
    </div>

    {/* Feature 2: Fast Delivery */}
    <div className={styles.luxuryFeatureCard}>
      <div className={styles.luxuryIconWrapper}>
        <svg viewBox="0 0 100 100" className={styles.luxurySvgIcon} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Main Truck Body */}
          <path d="M28 35 H68 V62 H28 Z" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" fill="none"/>
          {/* Truck Cabin */}
          <path d="M68 41 H78 L85 50 V62 H68 Z" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" fill="none"/>
          <path d="M78 41 V50 H84" stroke="currentColor" strokeWidth="2.5" fill="none"/>
          {/* Wheels */}
          <circle cx="38" cy="68" r="6" stroke="currentColor" strokeWidth="3.5" fill="none" />
          <circle cx="72" cy="68" r="6" stroke="currentColor" strokeWidth="3.5" fill="none" />
          {/* Wind Speed lines behind truck */}
          <path d="M14 42 H22" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <path d="M10 50 H22" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <path d="M15 58 H22" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </div>
      <div className={styles.luxuryTextContent}>
        <h3 className={styles.luxuryFeatureTitle}>Fast Delivery</h3>
        <p className={styles.luxuryFeatureDescription}>
          On your doorsteps in 3-5 days, with an exclusive scent surprise.
        </p>
      </div>
    </div>

    {/* Feature 3: The Lingering Effect (Neck Profile) */}
    <div className={styles.luxuryFeatureCard}>
      <div className={styles.luxuryIconWrapper}>
        <svg viewBox="0 0 100 100" className={styles.luxurySvgIcon} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Neck and Jawline Silhouette */}
          <path d="M48 30 C 48 30, 48 40, 42 45 C 38 48, 35 52, 35 58 C 35 68, 55 78, 65 78" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
          <path d="M48 30 C 51 32, 54 36, 56 38 C 58 40, 65 44, 65 52 C 65 60, 50 68, 48 78" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
          {/* Left Scent Waves */}
          <path d="M14 55 Q 19 51, 24 55" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <path d="M12 62 Q 17 58, 22 62" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          {/* Right Scent Waves */}
          <path d="M76 55 Q 81 51, 86 55" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <path d="M78 62 Q 83 58, 88 62" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        </svg>
      </div>
      <div className={styles.luxuryTextContent}>
        <h3 className={styles.luxuryFeatureTitle}>The Lingering Effect You Want</h3>
        <p className={styles.luxuryFeatureDescription}>
          VALLURE perfumes are blended with proven ingredients to last 10+ hours (Guaranteed).
        </p>
      </div>
    </div>

  </div>
</section>

    </main>
  );
}