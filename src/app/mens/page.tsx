'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from "@/context/CartContext";
import styles from './mens.module.css';

const mensProducts = [
  { id: "rouge", name: "VALLURE ROUGE", brand: "ATELIER AURA", price: "₦180,000", image: "/bestseller/rouge.png" },
  { id: "noir", name: "VALLURE NOIR", brand: "ATELIER AURA", price: "₦195,000", image: "/bestseller/noir.png" },
  { id: "elixir", name: "Aurelius Elixir", brand: "MAISON D’OR", price: "₦95,000", image: "/bestseller/elixir.png" },
  { id: "argent", name: "Argent Noir", brand: "ONYX & CO.", price: "₦200,000", image: "/bestseller/argent.png" },
  { id: "santal", name: "Santal Impérial", brand: "ATELIER VILLION", price: "₦185,000", image: "/bestseller/santal.png" },
  { id: "sauvage", name: "Sauvage Parfum", brand: "DIOR", price: "₦185,000", image: "/featurepic/Sauvage.png" },
  { id: "armani", name: "You Intensely", brand: "EMPORIO ARMANI", price: "₦145,000", image: "/featurepic/Armani.png" },
  { id: "old", name: "Old Money", brand: "ATELIER AURA", price: "₦85,000", image: "/featurepic/Old.png" },
  { id: "haltane", name: "Haltane", brand: "PARFUMS DE MARLY", price: "₦320,000", image: "/featurepic/Haltane.png" },
  { id: "imperial", name: "Imperial", brand: "CREED", price: "₦95,000", image: "/featurepic/Imperial.png" },
  { id: "acqua", name: "Acqua Di Gio", brand: "GIORGIO ARMANI", price: "₦140,000", image: "/featurepic/Acqua.png" },
  { id: "bleu", name: "Bleu de Chanel", brand: "CHANEL", price: "₦175,000", image: "/featurepic/Bleu.png" }
];

// Sub-component to manage individual card state (selected size) cleanly
function ProductCard({ product }: { product: typeof mensProducts[0] }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("100ml");

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      selectedSize: selectedSize,
      quantity: 1,
    });
  };

  return (
    <div className={styles.productCard}>
      <div className={styles.productImageContainer}>
        <Link href={`/product/${product.id}`} className={styles.imageLink}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className={styles.productImage}
          />
        </Link>
        
        <button 
          type="button"
          className={styles.cartIconBtn} 
          aria-label="Add to Cart"
          onClick={handleAddToCart}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </button>
      </div>

      <div className={styles.productDetails}>
        <Link href={`/product/${product.id}`} className={styles.textLink}>
          <span className={styles.productBrand}>{product.brand}</span>
          <h3 className={styles.productName}>{product.name}</h3>
        </Link>
        
        <div className={styles.sizeSelector}>
          {["100ml", "50ml", "25ml"].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={`${styles.sizeBox} ${selectedSize === size ? styles.activeSize : ""}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <button 
        type="button"
        className={styles.priceButton}
        onClick={handleAddToCart}
      >
        {product.price}
      </button>
    </div>
  );
}

export default function MensPage() {
  const [sortBy, setSortBy] = useState("Featured");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const scrollToCollection = () => {
    const section = document.getElementById('collection-grid');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Sorting logic based on selected option (Dates excluded)
  const getSortedProducts = () => {
    const list = [...mensProducts];
    switch (sortBy) {
      case "Alphabetically, A-Z":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "Alphabetically, Z-A":
        return list.sort((a, b) => b.name.localeCompare(a.name));
      case "Price, low to high":
        return list.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^\d]/g, ''), 10);
          const priceB = parseInt(b.price.replace(/[^\d]/g, ''), 10);
          return priceA - priceB;
        });
      case "Price, high to low":
        return list.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^\d]/g, ''), 10);
          const priceB = parseInt(b.price.replace(/[^\d]/g, ''), 10);
          return priceB - priceA;
        });
      case "Featured":
      case "Most relevant":
      case "Best selling":
      default:
        return list;
    }
  };

  return (
    <main className={styles.mainContainer}>
      
      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={`${styles.imageWrapper} ${styles.desktopImage}`}>
          <Image src="/mens/menhero-l.png" alt="Desktop View" fill priority sizes="100vw" className={styles.heroImage} />
        </div>
        <div className={`${styles.imageWrapper} ${styles.mobileImage}`}>
          <Image src="/mens/menhero-p.png" alt="Mobile View" fill priority sizes="100vw" className={styles.heroImage} />
        </div>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.heroSubtitle}>Atelier Aura Haute Parfumerie</span>
          <h1 className={styles.heroTitle}>The Vallure Man</h1>
          <p className={styles.heroDescription}>
            A definitive curation of raw architectural intensity, heavy glass, and deep, sophisticated warmth. Engineered exclusively for the modern avant-garde style profile.
          </p>
          <button 
            type="button" 
            className={styles.heroButton}
            onClick={scrollToCollection}
          >
            Explore The Collection
          </button>
        </div>
      </section>

      {/* EDITORIAL INTRO SECTION */}
      <section className={styles.introSection}>
        <h2 className={styles.introTitle}>Pour Homme</h2>
        <p className={styles.introParagraph}>
          Spanning from crisp maritime accords and velvet ambers to the brooding intensity of rare oud, spiced leather, and smoked cedarwood—each dynamic composition is engineered to command absolute presence. Masterfully blended at pure extrait concentrations, these fragrances yield exceptional longevity, profound sillage, and structural elegance for any setting. Whether navigating bold nocturnal engagements, tailored architectural spaces, or leaving an indelible signature statement, the collection offers an elevated olfactory journey defined by rigorous craftsmanship and sophisticated masculinity.
        </p>
      </section>

      {/* FILTER BAR WITH TEXT BUTTON SITUATED JUST BEFORE THE GRID */}
      <div className={styles.filterBar}>
        <div className={styles.filterDropdownContainer}>
          <button 
            type="button" 
            className={styles.filterToggleBtn}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Filter
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              {[
                "Featured",
                "Most relevant",
                "Best selling",
                "Alphabetically, A-Z",
                "Alphabetically, Z-A",
                "Price, low to high",
                "Price, high to low"
              ].map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`${styles.dropdownItem} ${sortBy === option ? styles.activeOption : ""}`}
                  onClick={() => {
                    setSortBy(option);
                    setIsDropdownOpen(false);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DYNAMIC PRODUCT GRID SECTION */}
      <section id="collection-grid" className={styles.gridContainer}>
        <div className={styles.productGrid}>
          {getSortedProducts().map((product) => (
            <ProductCard key={product.id} product={product} />
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