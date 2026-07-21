"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Image from 'next/image';
import styles from "./home.module.css";

const slides = [
  { id: "vallure", landscape: "/hero/Vallure-l.webp", portrait: "/hero/Vallure-p.webp", title: "THE VALLURE COLLECTION", subtitle: "The Undisputed Pinnacle of Modern Haute Parfumerie.", titleColor: "#D4AF37", subtitleColor: "#FFFFFF" },
  { id: "blanc", landscape: "/hero/Blanc-l.webp", portrait: "/hero/Blanc-p.webp", title: "VALLURE BLANC", subtitle: "Arguably the Purest, Most Luminous Skin Scent on the Planet.", titleColor: "#E0E0E0", subtitleColor: "#FFFFFF" },
  { id: "noir", landscape: "/hero/Noir-l.webp", portrait: "/hero/Noir-p.webp", title: "VALLURE NOIR", subtitle: "The Longest-Lasting Night Fragrance Ever Crafted.", titleColor: "#C0A060", subtitleColor: "#D3D3D3" },
  { id: "rouge", landscape: "/hero/Rouge-l.webp", portrait: "/hero/Rouge-p.webp", title: "VALLURE ROUGE", subtitle: "A Ferociously Bold Projection That Commands the Room.", titleColor: "#9B111E", subtitleColor: "#333333" },
  { id: "dore", landscape: "/hero/Dore-l.webp", portrait: "/hero/Dore-p.webp", title: "VALLURE DORÉ", subtitle: "Unmatched Golden Opulence That Lingers for Days.", titleColor: "#DAA520", subtitleColor: "#333333" },
];

const himProducts = [
  { id: "rouge", name: "VALLURE ROUGE", brand: "ATELIER AURA", image: "/bestseller/rouge.webp", price: "₦180,000", isEmpty: false },
  { id: "noir", name: "VALLURE NOIR", brand: "ATELIER AURA", image: "/bestseller/noir.webp", price: "₦195,000", isEmpty: false },
  { id: "elixir", name: "Aurelius Elixir", brand: "Maison d’Or", image: "/bestseller/elixir.webp", price: "₦95,000", isEmpty: false },
  { id: "argent", name: "Argent Noir", brand: "Onyx & Co.", image: "/bestseller/argent.webp", price: "₦200,000", isEmpty: false },
  { id: "santal", name: "Santal Impérial", brand: "Atelier Villion", image: "/bestseller/santal.webp", price: "₦185,000", isEmpty: false },
];

const herProducts = [
  { id: "dore", name: "VALLURE DORÉ", brand: "ATELIER AURA", image: "/bestseller/dore.webp", price: "₦210,000", isEmpty: false },
  { id: "blanc", name: "VALLURE BLANC", brand: "ATELIER AURA", image: "/bestseller/blanc.webp", price: "₦175,000", isEmpty: false },
  { id: "cristal", name: "Cristal de Soie", brand: "Palais de Verre", image: "/bestseller/cristal.webp", price: "₦200,000", isEmpty: false },
  { id: "ambre", name: "Ambre Sacré", brand: "L’Écorce Dorée", image: "/bestseller/ambre.webp", price: "₦190,000", isEmpty: false },
  { id: "absolu", name: "Rouge Absolu", brand: "Velours & Brume", image: "/bestseller/absolu.webp", price: "₦220,000", isEmpty: false },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<"him" | "her">("him");
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  // Mobile Swipe Gesture State Tracking
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [showArrow, setShowArrow] = useState(false);
  const [hasSwiped, setHasSwiped] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Show the bouncing arrow indicator only when the user scrolls down to this section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasSwiped) {
          setShowArrow(true);
        }
      },
      { threshold: 0.15 } // Fires when 15% of the bestseller container is on-screen
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, [hasSwiped]);

  // Reset category lists and scroll coordinates when toggling categories
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollLeft = 0;
    }
    setHasSwiped(false);
  }, [activeTab]);

  // Instantly slide the arrow out to the right when horizontal swipe action begins
  const handleGridScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollLeft > 15) {
      setHasSwiped(true);
    }
  };

  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const currentProducts = activeTab === "him" ? himProducts : herProducts;

  return (
  
  <main className={styles.main}>
  {/* HERO SECTION */}
  <section className={styles.heroContainer}>
    {slides.map((slide, index) => {
      const isActive = index === currentSlide;
      const isVallure = slide.id === 'vallure';

      return (
        <div key={slide.id} className={`${styles.slide} ${isActive ? styles.slideActive : ""}`}>
          
          {/* Desktop Landscape Image */}
          <div className={styles.desktopImageWrapper}>
            <Image 
              src={slide.landscape} 
              alt={slide.title} 
              fill
              sizes="100vw"
              priority={isActive} // Crucial performance trick: Only preload the visible slide!
              className={styles.bgImage}
            />
          </div>

          {/* Mobile/Tablet Portrait Image */}
          <div className={styles.mobileImageWrapper}>
            <Image 
              src={slide.portrait} 
              alt={slide.title} 
              fill
              sizes="100vw"
              priority={isActive} // Preloads the mobile image only if this slide is active
              className={styles.bgImage}
            />
          </div>

          <div className={`${styles.textContent} ${isVallure ? styles.vallureText : ''}`}>
            <h1 className={styles.title} style={{ color: slide.titleColor }}>{slide.title}</h1>
            <p className={styles.subtitle} style={{ color: slide.subtitleColor }}>{slide.subtitle}</p>
          </div>

          <button 
            className={`${styles.shopButton} ${isVallure ? styles.vallureButton : ''} ${(slide.id === 'dore' || slide.id === 'rouge') ? styles.darkButton : ''}`}
            onClick={() => sectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
          >
            Shop Now
          </button>
        </div>
      );
    })}
  </section>


      {/* BEST SELLER SECTION */}
      <section ref={sectionRef} className={styles.bestSellerSection}>
        <h2 className={styles.bestSellerHeader}>Our Bestsellers</h2>
        
        {/* Category Toggles */}
        <div className={styles.bestsellerNav}>
          <button 
            className={activeTab === "him" ? styles.navButtonActive : styles.navButton}
            onClick={() => setActiveTab("him")}
          >
            For Him
          </button>
          <button 
            className={activeTab === "her" ? styles.navButtonActive : styles.navButton}
            onClick={() => setActiveTab("her")}
          >
            For Her
          </button>
        </div>

        {/* Dynamic Bouncing Action Indicator (Mobile/Tablet Only) */}
        <div className={`${styles.swipeArrow} ${showArrow ? styles.arrowVisible : ''} ${hasSwiped ? styles.arrowHidden : ''}`}>
          <svg className={styles.arrowIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>

        {/* Product Grid / Row Slider */}
        <div 
          ref={gridRef}
          onScroll={handleGridScroll}
          className={styles.productGrid}
        >
          {currentProducts.map((product) => {
            const currentSize = selectedSizes[product.id] || "100ml";

            if (product.isEmpty) {
              return (
                <div key={product.id} className={`${styles.productCard} ${styles.emptyCard}`}>
                  <div className={styles.emptyImageContainer}>
                    <span className={styles.emptyLogo}>A</span>
                  </div>
                  <div className={styles.productInfo}>
                    <span className={styles.brandName}>{product.brand}</span>
                    <h3 className={styles.productName}>COMING SOON</h3>
                  </div>
                </div>
              );
            }

return (
  <div key={product.id} className={styles.productCard}>
    <div className={styles.imageWrapper}>
      
      {/* UPGRADED NEXT.JS IMAGE COMPONENT */}
      <Image 
        src={product.image} 
        alt={product.name} 
        fill // Fills the container perfectly
        sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 25vw" // Serves the exact right resolution per device
        className={styles.productImage}
      />

      <button 
        className={styles.cartIconButton} 
        aria-label="Add to Cart"
        onClick={() => addToCart({
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          image: product.image,
          selectedSize: currentSize,
          quantity: 1,
        })}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      </button>
    </div>

    <div className={styles.productInfo}>
      <span className={styles.brandName}>{product.brand}</span>
      <h3 className={styles.productName}>{product.name}</h3>
      
      <div className={styles.sizeSelector}>
        {["100ml", "50ml", "25ml"].map((size) => (
          <button
            key={size}
            className={`${styles.sizeBtn} ${currentSize === size ? styles.sizeBtnActive : ""}`}
            onClick={() => handleSizeSelect(product.id, size)}
          >
            {size}
          </button>
        ))}
      </div>

      <Link href={`/product/${product.id}`} className={styles.priceCta}>
        {product.price}
      </Link>
    </div>
  </div>

            );
          })}
        </div>
      </section>

      {/* Put this section directly after the </section> of your bestSellerSection inside src/app/page.tsx */}

      {/* FEATURED / BRAND TICKER SECTION */}
      <section className={styles.featuredSection}>
        <span className={styles.featuredSub}>As Featured In</span>
        
        <div className={styles.tickerContainer}>
          <div className={styles.tickerTrack}>
            {/* First Set of Logos */}
            <div className={styles.tickerSlide}>
              {/* CHANEL */}
              <svg viewBox="0 0 160 35" className={styles.brandLogo}>
                <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontWeight="700" fontSize="18" letterSpacing="0.35em" fill="currentColor">CHANEL</text>
              </svg>
              {/* DIOR */}
              <svg viewBox="0 0 160 35" className={styles.brandLogo}>
                <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Didot', 'Bodoni MT', serif" fontWeight="400" fontSize="21" letterSpacing="0.2em" fill="currentColor">Dior</text>
              </svg>
              {/* CREED */}
              <svg viewBox="0 0 160 35" className={styles.brandLogo}>
                <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Times New Roman', Times, serif" fontWeight="700" fontSize="19" letterSpacing="0.25em" fill="currentColor">CREED</text>
              </svg>
              {/* TOM FORD */}
              <svg viewBox="0 0 160 35" className={styles.brandLogo}>
                <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Arial Black', Gadget, sans-serif" fontWeight="900" fontSize="15" letterSpacing="0.15em" fill="currentColor">TOM FORD</text>
              </svg>
              {/* BYREDO */}
              <svg viewBox="0 0 160 35" className={styles.brandLogo}>
                <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Century Gothic', sans-serif" fontWeight="normal" fontSize="17" letterSpacing="0.4em" fill="currentColor">BYREDO</text>
              </svg>
              {/* HERMÈS */}
              <svg viewBox="0 0 160 35" className={styles.brandLogo}>
                <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Georgia', serif" fontWeight="bold" fontSize="14" letterSpacing="0.3em" fill="currentColor">HERMÈS</text>
              </svg>
            </div>

            {/* Identical Duplicate Set (Needed to make the loop seamless and infinite) */}
            <div className={styles.tickerSlide}>
              {/* CHANEL */}
              <svg viewBox="0 0 160 35" className={styles.brandLogo}>
                <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontWeight="700" fontSize="18" letterSpacing="0.35em" fill="currentColor">CHANEL</text>
              </svg>
              {/* DIOR */}
              <svg viewBox="0 0 160 35" className={styles.brandLogo}>
                <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Didot', 'Bodoni MT', serif" fontWeight="400" fontSize="21" letterSpacing="0.2em" fill="currentColor">Dior</text>
              </svg>
              {/* CREED */}
              <svg viewBox="0 0 160 35" className={styles.brandLogo}>
                <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Times New Roman', Times, serif" fontWeight="700" fontSize="19" letterSpacing="0.25em" fill="currentColor">CREED</text>
              </svg>
              {/* TOM FORD */}
              <svg viewBox="0 0 160 35" className={styles.brandLogo}>
                <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Arial Black', Gadget, sans-serif" fontWeight="900" fontSize="15" letterSpacing="0.15em" fill="currentColor">TOM FORD</text>
              </svg>
              {/* BYREDO */}
              <svg viewBox="0 0 160 35" className={styles.brandLogo}>
                <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Century Gothic', sans-serif" fontWeight="normal" fontSize="17" letterSpacing="0.4em" fill="currentColor">BYREDO</text>
              </svg>
              {/* HERMÈS */}
              <svg viewBox="0 0 160 35" className={styles.brandLogo}>
                <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fontFamily="'Georgia', serif" fontWeight="bold" fontSize="14" letterSpacing="0.3em" fill="currentColor">HERMÈS</text>
              </svg>
            </div>
          </div>
        </div>


        {/* NEW: Horizontal Swipeable Fragrance Showcase */}
  <div className={styles.carouselWrapper}>
    <div className={styles.carouselTrack}>
      {[
        { name: "Sauvage Parfum", price: "₦185,000", asset: "Sauvage" },
        { name: "You Intensely", price: "₦145,000", asset: "Armani" },
        { name: "Libre Le Parfum", price: "₦195,000", asset: "YSL" },
        { name: "Old Money", price: "₦85,000", asset: "Old" },
        { name: "Haltane", price: "₦320,000", asset: "Haltane" },
        { name: "Cherry", price: "₦75,000", asset: "Cherry" },
        { name: "Khamrah", price: "₦65,000", asset: "Lattafa" },
        { name: "Imperial", price: "₦95,000", asset: "Imperial" },
        { name: "Acqua Di Gio", price: "₦140,000", asset: "Acqua" },
        { name: "Bleu de Chanel", price: "₦175,000", asset: "Bleu" }
      ].map((perfume, index) => (
        <div key={index} className={styles.productCard}>
          
          {/* Main Top Portion: Video container */}
          <div className={styles.mediaContainer}>
       <video 
         className={styles.featuredVideo}
        src={`/featurevideo/${perfume.asset}.mp4`}
        autoPlay
        loop
        muted
        playsInline
        onTimeUpdate={(e) => {
    // If the video plays past 6 seconds, instantly snap it back to the start
    if (e.currentTarget.currentTime >= 6) {
      e.currentTarget.currentTime = 0;
    }
  }}
/>
            
            {/* Embedded overlapping PNG Image Container */}
<div className={styles.overlapImageContainer}>
  <Image 
    src={`/featurepic/${perfume.asset}.webp`} 
    alt={perfume.name} 
    fill // Tells it to adapt completely to your container dimensions
    sizes="(max-width: 768px) 80vw, 40vw" // Helps Next.js optimize the asset weight for mobile screens
    className={styles.overlapImage}
  />
</div>
</div>

          {/* Bottom Portion: Product Info Box with Button */}
           <div className={styles.infoBox}>
           <h4 className={styles.productTitle}>{perfume.name}</h4>
           <Link href={`/product/${perfume.asset.toLowerCase()}`} className={styles.productPriceButton}>
  {perfume.price}
</Link>
         </div>

        </div>
      ))}
    </div>
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

{/* ==========================================
    CELEBRITY SOCIAL PROOF SECTION
   ========================================== */}
<section className={styles.celebSection}>
  {/* Elegant Serif Header */}
  <h2 className={styles.celebHeader}>Worn by Icons. Loved by Thousands.</h2>

  <div className={styles.celebGrid}>
    
    {/* Celebrity 1: Ranbir Kapoor */}
    <div className={styles.celebCard}>
      <Image 
        src="/celebrities/ranbir-kapoor.avif" 
        alt="Ranbir Kapoor" 
        fill
        sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className={styles.celebPortrait} 
      />
      <div 
        className={styles.celebOverlay} 
        style={{ background: 'linear-gradient(to top, rgba(12, 12, 12, 0.98) 0%, rgba(12, 12, 12, 0.6) 50%, rgba(12, 12, 12, 0) 100%)' }}
      >
        <div className={styles.celebProductBadge}>
          <Image 
            src="/bestseller/noir.webp" 
            alt="Vallure Noir Bottle" 
            fill
            sizes="80px"
            className={styles.celebProductImg} 
          />
        </div>
        <div className={styles.celebText}>
          <h4 className={styles.celebName}>Ranbir Kapoor</h4>
          <p className={styles.celebScent}>Vallure Noir</p>
        </div>
      </div>
    </div>

    {/* Celebrity 2: Sobhita Dhulipala */}
    <div className={styles.celebCard}>
      <Image 
        src="/celebrities/sobhita-dhulipala.avif" 
        alt="Sobhita Dhulipala" 
        fill
        sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className={styles.celebPortrait} 
      />
      <div 
        className={styles.celebOverlay} 
        style={{ background: 'linear-gradient(to top, rgba(54, 42, 33, 0.98) 0%, rgba(54, 42, 33, 0.6) 50%, rgba(54, 42, 33, 0) 100%)' }}
      >
        <div className={styles.celebProductBadge}>
          <Image 
            src="/bestseller/elixir.webp" 
            alt="Aurelius Elixir Bottle" 
            fill
            sizes="80px"
            className={styles.celebProductImg} 
          />
        </div>
        <div className={styles.celebText}>
          <h4 className={styles.celebName}>Sobhita Dhulipala</h4>
          <p className={styles.celebScent}>Aurelius Elixir</p>
        </div>
      </div>
    </div>

    {/* Celebrity 3: Regé-Jean Page */}
    <div className={styles.celebCard}>
      <Image 
        src="/celebrities/rege-jean-page.avif" 
        alt="Regé-Jean Page" 
        fill
        sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className={styles.celebPortrait} 
      />
      <div 
        className={styles.celebOverlay} 
        style={{ background: 'linear-gradient(to top, rgba(18, 20, 26, 0.98) 0%, rgba(18, 20, 26, 0.6) 50%, rgba(18, 20, 26, 0) 100%)' }}
      >
        <div className={styles.celebProductBadge}>
          <Image 
            src="/bestseller/argent.webp" 
            alt="Argent Noir Bottle" 
            fill
            sizes="80px"
            className={styles.celebProductImg} 
          />
        </div>
        <div className={styles.celebText}>
          <h4 className={styles.celebName}>Regé-Jean Page</h4>
          <p className={styles.celebScent}>Argent Noir</p>
        </div>
      </div>
    </div>

    {/* Celebrity 4: Anya Taylor-Joy */}
    <div className={styles.celebCard}>
      <Image 
        src="/celebrities/anya-taylor-joy.avif" 
        alt="Anya Taylor-Joy" 
        fill
        sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className={styles.celebPortrait} 
      />
      <div 
        className={styles.celebOverlay} 
        style={{ background: 'linear-gradient(to top, rgba(110, 94, 79, 0.98) 0%, rgba(110, 94, 79, 0.6) 50%, rgba(110, 94, 79, 0) 100%)' }}
      >
        <div className={styles.celebProductBadge}>
          <Image 
            src="/bestseller/santal.webp" 
            alt="Santal Impérial Bottle" 
            fill
            sizes="80px"
            className={styles.celebProductImg} 
          />
        </div>
        <div className={styles.celebText}>
          <h4 className={styles.celebName}>Anya Taylor-Joy</h4>
          <p className={styles.celebScent}>Santal Impérial</p>
        </div>
      </div>
    </div>

  </div>
</section>

{/* ==========================================
    COLLECTIONS ROW SECTION
   ========================================== */}
<section className={styles.collectionsSection}>
  <div className={styles.collectionsContainer}>
    
    {/* Collection 1: Cristal de Soie */}
    <div className={styles.collectionCard}>
      <div className={styles.collectionImageRing}>
        <img 
          src="/bestseller/cristal.webp" 
          alt="Cristal de Soie Collection" 
          className={styles.collectionImage} 
        />
      </div>
      <h4 className={styles.collectionTitle}>
        <span className={styles.collectionBrandName}>Cristal de Soie</span>
        <span className={styles.collectionLabel}>Collection</span>
      </h4>
    </div>

    {/* Collection 2: Rouge Absolu */}
    <div className={styles.collectionCard}>
      <div className={styles.collectionImageRing}>
        <img 
          src="/bestseller/absolu.webp" 
          alt="Rouge Absolu Collection" 
          className={styles.collectionImage} 
        />
      </div>
      <h4 className={styles.collectionTitle}>
        <span className={styles.collectionBrandName}>Rouge Absolu</span>
        <span className={styles.collectionLabel}>Collection</span>
      </h4>
    </div>

    {/* Collection 3: Aurelius Elixir */}
    <div className={styles.collectionCard}>
      <div className={styles.collectionImageRing}>
        <img 
          src="/bestseller/elixir.webp" 
          alt="Aurelius Elixir Collection" 
          className={styles.collectionImage} 
        />
      </div>
      <h4 className={styles.collectionTitle}>
        <span className={styles.collectionBrandName}>Aurelius Elixir</span>
        <span className={styles.collectionLabel}>Collection</span>
      </h4>
    </div>

    {/* Collection 4: Santal Impérial */}
    <div className={styles.collectionCard}>
      <div className={styles.collectionImageRing}>
        <img 
          src="/bestseller/santal.webp" 
          alt="Santal Impérial Collection" 
          className={styles.collectionImage} 
        />
      </div>
      <h4 className={styles.collectionTitle}>
        <span className={styles.collectionBrandName}>Santal Impérial</span>
        <span className={styles.collectionLabel}>Collection</span>
      </h4>
    </div>

  </div>
</section>

{/* ==========================================
    CAMPAIGN CATEGORY SHOP SECTION 
   ========================================== */}
<section className={styles.shopCategorySection}>
  <div className={styles.shopCategoryContainer}>

    {/* FOR HIM CARD */}
    <div className={styles.shopCategoryItem}>
      <Image 
        src="/celebrities/malemodel.png" 
        alt="For Him Campaign" 
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className={styles.shopCategoryImg} 
      />
<div className={styles.shopTextOverlay}>
      <h3 className={styles.shopTitle}>For Him</h3>
      <Link href="/mens" className={styles.shopLink}>
        SHOP now
      </Link>
    </div>
  </div>

    {/* FOR HER CARD */}
    <div className={styles.shopCategoryItem}>
      <Image 
        src="/celebrities/anokyai.png" 
        alt="For Her Campaign" 
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className={styles.shopCategoryImg} 
      />
<div className={styles.shopTextOverlay}>
      <h3 className={styles.shopTitle}>For Her</h3>
      <Link href="/womens" className={styles.shopLink}>
        SHOP now
      </Link>
    </div>
  </div>

  </div>
</section>

{/* ==========================================
    ATELIER AURA FULL-IMAGE HERO SECTION
   ========================================== */}
<section className={styles.cosmeticHero}>
  
  {/* The Background Canvas Layer */}
  <div className={styles.imageBackground}>
    {/* Desktop Landscape Image */}
    <img 
      src="/cosmetic/cosmetic-l.avif" 
      alt="Atelier Aura Desktop Background" 
      className={`${styles.bgImg} ${styles.desktopImg}`}
    />
    {/* Mobile Portrait Image */}
    <img 
      src="/cosmetic/cosmetic-p.avif" 
      alt="Atelier Aura Mobile Background" 
      className={`${styles.bgImg} ${styles.mobileImg}`}
    />
  </div>

  {/* The Overlay Layer (Sits directly on top of the active image) */}
  <div className={styles.contentOverlay}>
    
    {/* Text Group (Pins to Top on Mobile, Mid-Right on Desktop) */}
    <div className={styles.textGroup}>
      <span className={styles.brandTag}>ATELIER AURA</span>
      <h2 className={styles.heading}>THE DISCOVERY COFFRET</h2>
      <p className={styles.subHeading}>4 X 10ML</p>
      <div className={styles.divider}></div>
      <p className={styles.description}>CURATE YOUR SIGNATURE AURA</p>
    </div>
    
{/* Button Wrapper (Pins to Bottom on Mobile, Mid-Right on Desktop) */}
<div className={styles.btnWrapper}>
  <Link href="/cosmetics" className={styles.checkoutBtn}>
    DISCOVER NOW
  </Link>
</div>
    
  </div>
</section>
{/* ==========================================
    ATELIER AURA "ABOUT US" SECTION
   ========================================== */}
<section className={styles.aboutSection}>
  <div className={styles.aboutContainer}>
    
    {/* 1. Narrative Column (First: Left on Desktop, Top on Mobile) */}
    <div className={styles.aboutTextBlock}>
      <span className={styles.aboutSub}>THE HERITAGE</span>
      <h2 className={styles.aboutHeading}>RAW LUXURY, REFINED BY HAND</h2>
      
      <p className={styles.aboutParagraph}>
        Atelier Aura began as a quiet rebellion against mass-market noise. Founded in a sun-drenched private studio, our origin lies in the tactile appreciation of pure ingredients—stripping away synthetic excess to focus on the raw, unadulterated essence of luxury. What started as bespoke blending for a handful of collectors has grown into a dedicated study of minimalist design and sensory alchemy.
      </p>

      <p className={styles.aboutParagraph}>
        Today, the House of Atelier Aura stands as an independent sanctuary of modern olfactory art. Operating at the intersection of raw nature and architectural refinement, we craft intimate discovery sets and travel coffrets designed to accompany you through a lifetime of journeys. We do not just make cosmetics; we preserve a slower, more deliberate way of experiencing beauty.
      </p>
      
      <div className={styles.aboutSignature}>
        <p className={styles.signatureText}>The House of Atelier Aura</p>
      </div>
    </div>

{/* 2. Visual Column (Second: Right on Desktop, Bottom on Mobile) */}
<div className={styles.aboutImageBlock}>
  <Image 
    src="/cosmetic/about-us.avif" 
    alt="Atelier Aura Artisanal Craftsmanship" 
    fill
    sizes="(max-width: 768px) 100vw, 50vw"
    className={styles.aboutImg}
  />
</div>

  </div>
</section>

{/* ==========================================
    ATELIER AURA "GET INSPIRED" MOVING CAROUSEL
   ========================================== */}
<section className={styles.inspirationSection}>
  
  {/* Header Block */}
  <div className={styles.inspirationHeader}>
    <h2 className={styles.inspireTitle}>Get Inspired</h2>
    <p className={styles.socialHandle}>@atelieraura</p>
  </div>

  {/* Carousel Viewport Container */}
  <div className={styles.carouselViewport}>
    
    <div className={styles.inspireTrack}>
      
      {/* ==================== SET 1 (10 Images) ==================== */}
      <div className={styles.carouselGroup}>
        {/* Card 1 */}
        <div className={styles.carouselCard}>
          <Image src="/cosmetic/inspire-1.png" alt="Floral Notes" fill sizes="(max-width: 768px) 50vw, 25vw" className={styles.cardImg} />
          <div className={styles.cardOverlay}>
            <span className={styles.overlayText}>FLORAL</span>
            <span className={styles.overlaySubText}>RADIANT</span>
          </div>
        </div>
        {/* Card 2 */}
        <div className={styles.carouselCard}>
          <Image src="/cosmetic/inspire-2.png" alt="Atelier Aura Bottle and Pearls" fill sizes="(max-width: 768px) 50vw, 25vw" className={styles.cardImg} />
        </div>
        {/* Card 3 */}
        <div className={styles.carouselCard}>
          <Image src="/cosmetic/inspire-3.png" alt="Cozy Notes" fill sizes="(max-width: 768px) 50vw, 25vw" className={styles.cardImg} />
          <div className={styles.cardOverlay}>
            <span className={styles.overlayText}>COZY</span>
            <span className={styles.overlaySubText}>DECADENT</span>
          </div>
        </div>
        {/* Card 4 */}
        <div className={styles.carouselCard}>
          <Image src="/cosmetic/inspire-4.png" alt="Luxe Bottle on Travertine" fill sizes="(max-width: 768px) 50vw, 25vw" className={styles.cardImg} />
        </div>
        {/* Card 5 */}
        <div className={styles.carouselCard}>
          <Image src="/cosmetic/inspire-5.png" alt="Citrus and Vanilla ingredients" fill sizes="(max-width: 768px) 50vw, 25vw" className={styles.cardImg} />
        </div>
        {/* Card 6 */}
        <div className={styles.carouselCard}>
          <Image src="/cosmetic/inspire-6.png" alt="Atelier Aura White Flowers" fill sizes="(max-width: 768px) 50vw, 25vw" className={styles.cardImg} />
        </div>
        {/* Card 7 */}
        <div className={styles.carouselCard}>
          <Image src="/cosmetic/inspire-7.png" alt="Warm Silk Reflections" fill sizes="(max-width: 768px) 50vw, 25vw" className={styles.cardImg} />
        </div>
        {/* Card 8 */}
        <div className={styles.carouselCard}>
          <Image src="/cosmetic/inspire-8.png" alt="Earthy Notes" fill sizes="(max-width: 768px) 50vw, 25vw" className={styles.cardImg} />
          <div className={styles.cardOverlay}>
            <span className={styles.overlayText}>EARTHY</span>
            <span className={styles.overlaySubText}>GROUNDED</span>
          </div>
        </div>
        {/* Card 9 */}
        <div className={styles.carouselCard}>
          <Image src="/cosmetic/inspire-9.png" alt="Mist Atomizer Close-up" fill sizes="(max-width: 768px) 50vw, 25vw" className={styles.cardImg} />
        </div>
        {/* Card 10 */}
        <div className={styles.carouselCard}>
          <Image src="/cosmetic/inspire-10.png" alt="Minimalist Product Lineup" fill sizes="(max-width: 768px) 50vw, 25vw" className={styles.cardImg} />
        </div>
      </div>

      {/* ==================== SET 2 (Exact Duplicate for Seamless Loop) ==================== */}
      <div className={styles.carouselGroup} aria-hidden="true">
        {/* Card 1 */}
        <div className={styles.carouselCard}>
          <Image src="/cosmetic/inspire-1.png" alt="" fill sizes="(max-width: 768px) 50vw, 25vw" className={styles.cardImg} />
          <div className={styles.cardOverlay}>
            <span className={styles.overlayText}>FLORAL</span>
            <span className={styles.overlaySubText}>RADIANT</span>
          </div>
        </div>
        {/* Card 2 */}
        <div className={styles.carouselCard}>
          <Image src="/cosmetic/inspire-2.png" alt="" fill sizes="(max-width: 768px) 50vw, 25vw" className={styles.cardImg} />
        </div>
        {/* Card 3 */}
        <div className={styles.carouselCard}>
          <Image src="/cosmetic/inspire-3.png" alt="" fill sizes="(max-width: 768px) 50vw, 25vw" className={styles.cardImg} />
          <div className={styles.cardOverlay}>
            <span className={styles.overlayText}>COZY</span>
            <span className={styles.overlaySubText}>DECADENT</span>
          </div>
        </div>
        {/* Card 4 */}
        <div className={styles.carouselCard}>
          <Image src="/cosmetic/inspire-4.png" alt="" fill sizes="(max-width: 768px) 50vw, 25vw" className={styles.cardImg} />
        </div>
        {/* Card 5 */}
        <div className={styles.carouselCard}>
          <Image src="/cosmetic/inspire-5.png" alt="" fill sizes="(max-width: 768px) 50vw, 25vw" className={styles.cardImg} />
        </div>
        {/* Card 6 */}
        <div className={styles.carouselCard}>
          <Image src="/cosmetic/inspire-6.png" alt="" fill sizes="(max-width: 768px) 50vw, 25vw" className={styles.cardImg} />
        </div>
        {/* Card 7 */}
        <div className={styles.carouselCard}>
          <Image src="/cosmetic/inspire-7.png" alt="" fill sizes="(max-width: 768px) 50vw, 25vw" className={styles.cardImg} />
        </div>
        {/* Card 8 */}
        <div className={styles.carouselCard}>
          <Image src="/cosmetic/inspire-8.png" alt="" fill sizes="(max-width: 768px) 50vw, 25vw" className={styles.cardImg} />
          <div className={styles.cardOverlay}>
            <span className={styles.overlayText}>EARTHY</span>
            <span className={styles.overlaySubText}>GROUNDED</span>
          </div>
        </div>
        {/* Card 9 */}
        <div className={styles.carouselCard}>
          <Image src="/cosmetic/inspire-9.png" alt="" fill sizes="(max-width: 768px) 50vw, 25vw" className={styles.cardImg} />
        </div>
        {/* Card 10 */}
        <div className={styles.carouselCard}>
          <Image src="/cosmetic/inspire-10.png" alt="" fill sizes="(max-width: 768px) 50vw, 25vw" className={styles.cardImg} />
        </div>
      </div>

    </div>
  </div>
</section>

    </main>
  );
}