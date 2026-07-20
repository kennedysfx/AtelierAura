"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import styles from "./product.module.css";

// 1. MASTER PRODUCT DATA REGISTRY
const PRODUCTS_REGISTRY: Record<string, {
  name: string;
  brand: string;
  price: string;
  image: string;
  description: string;
  sizes: string[];
  notes: { top: string; heart: string; base: string };
}> = {
  // ==========================================
  // BEST SELLERS: HIM
  // (These first 4 will now populate "Curated Concurrences")
  // ==========================================
  "rouge": {
    name: "VALLURE ROUGE",
    brand: "ATELIER AURA",
    price: "₦180,000",
    image: "/bestseller/rouge.webp",
    description: "A striking, passionate statement. Vallure Rouge opens with a burst of spiced woods and settles into a deeply intoxicating, warm embrace meant for the modern gentleman.",
    sizes: ["50ml", "100ml"],
    notes: { top: "Spiced Cardamom, Blood Orange", heart: "Smoked Rose, Cinnamon", base: "Oud, Warm Amber" }
  },
  "noir": {
    name: "VALLURE NOIR",
    brand: "ATELIER AURA",
    price: "₦195,000",
    image: "/bestseller/noir.webp",
    description: "The essence of midnight elegance. Vallure Noir captures the mystery of a dark tailored suit with deep, rich leather and sophisticated peppery undertones.",
    sizes: ["50ml", "100ml"],
    notes: { top: "Black Pepper, Bergamot", heart: "Dark Leather, Vetiver", base: "Patchouli, Ebony Wood" }
  },
  "elixir": {
    name: "Aurelius Elixir",
    brand: "MAISON D’OR",
    price: "₦95,000",
    image: "/bestseller/elixir.webp",
    description: "A golden potion of refinement. Aurelius Elixir balances bright citrus with a creamy, resonant heart of vanilla and rare woods.",
    sizes: ["100ml"],
    notes: { top: "Sicilian Lemon, Mint", heart: "Vanilla Bean, Jasmine", base: "Sandalwood, Musk" }
  },
  "argent": {
    name: "Argent Noir",
    brand: "ONYX & CO.",
    price: "₦200,000",
    image: "/bestseller/argent.webp",
    description: "Cold, metallic precision meets raw earthy power. Argent Noir is an architectural masterpiece of sharp woods and aromatic greens.",
    sizes: ["50ml", "100ml"],
    notes: { top: "Juniper Berries, Cypress", heart: "Pine Needles, Cashmeran", base: "Oakmoss, Cedarwood" }
  },
  "santal": {
    name: "Santal Impérial",
    brand: "ATELIER VILLION",
    price: "₦185,000",
    image: "/bestseller/santal.webp",
    description: "A creamy, luxurious meditation on the world's finest sandalwood. Smooth, commanding, and infinitely lingering on the skin.",
    sizes: ["50ml", "100ml", "200ml"],
    notes: { top: "Cardamom, Violet", heart: "Iris, Papyrus", base: "Australian Sandalwood, Cedar" }
  },

  // ==========================================
  // BEST SELLERS: HER
  // ==========================================
  "dore": {
    name: "VALLURE DORÉ",
    brand: "ATELIER AURA",
    price: "₦210,000",
    image: "/bestseller/dore.webp",
    description: "Liquid gold in a bottle. Vallure Doré is a radiant, sun-kissed floral fragrance that exudes wealth, warmth, and untouchable glamour.",
    sizes: ["50ml", "100ml"],
    notes: { top: "Neroli, Pear", heart: "Orange Blossom, Jasmine Sambac", base: "White Amber, Vanilla" }
  },
  "blanc": {
    name: "VALLURE BLANC",
    brand: "ATELIER AURA",
    price: "₦175,000",
    image: "/bestseller/blanc.webp",
    description: "Pure, pristine, and exquisitely clean. Vallure Blanc represents minimalist luxury with its soft white florals and ethereal musks.",
    sizes: ["50ml", "100ml"],
    notes: { top: "White Tea, Bergamot", heart: "Lily of the Valley, Freesia", base: "White Musk, Cashmere Wood" }
  },
  "cristal": {
    name: "Cristal de Soie",
    brand: "PALAIS DE VERRE",
    price: "₦200,000",
    image: "/bestseller/cristal.webp",
    description: "As smooth as crushed silk against the skin. A sheer, crystalline fragrance that floats delicately but leaves an unforgettable impression.",
    sizes: ["50ml", "100ml"],
    notes: { top: "Pink Peony, Lychee", heart: "Rose, Magnolia", base: "Cedarwood, Amber" }
  },
  "ambre": {
    name: "Ambre Sacré",
    brand: "L’ÉCORCE DORÉE",
    price: "₦190,000",
    image: "/bestseller/ambre.webp",
    description: "A sacred, resinous journey. Ambre Sacré envelops the wearer in a golden cloud of sweet incense and ancient, warming ambers.",
    sizes: ["50ml", "100ml"],
    notes: { top: "Incense, Pink Pepper", heart: "Benzoin, Labdanum", base: "Vanilla, Amber" }
  },
  "absolu": {
    name: "Rouge Absolu",
    brand: "VELOURS & BRUME",
    price: "₦220,000",
    image: "/bestseller/absolu.webp",
    description: "The absolute height of floral decadence. A rich, velvety interpretation of dark red roses steeped in exotic spices and resins.",
    sizes: ["50ml", "100ml"],
    notes: { top: "Plum, Saffron", heart: "Turkish Rose, Patchouli", base: "Oud, Tonka Bean" }
  },

  // ==========================================
  // SWIPEABLE SHOWCASE PRODUCTS
  // ==========================================
  "sauvage": {
    name: "Sauvage Parfum",
    brand: "DIOR",
    price: "₦185,000",
    image: "/featurepic/Sauvage.webp",
    description: "An intense and smooth fragrance, bursting with crisp Bergamot and mysterious Ambroxan. A raw luxury composition that leans into fierce masculinity and architectural depth.",
    sizes: ["50ml", "100ml", "200ml"],
    notes: { top: "Reggio Bergamot", heart: "Sichuan Pepper, Lavender", base: "Ambroxan, Vanilla Absolute" }
  },
  "armani": {
    name: "You Intensely",
    brand: "EMPORIO ARMANI",
    price: "₦145,000",
    image: "/featurepic/Armani.webp",
    description: "An addictive oriental woody fragrance that tells a story of intense, passionate love. Features deep notes of vanilla mixed with an elegant suede accord.",
    sizes: ["50ml", "100ml"],
    notes: { top: "Pink Pepper, Juniper", heart: "Lavender, Sage, Cinnamon", base: "Amber, Tonka Bean, Vanilla" }
  },
  "ysl": {
    name: "Libre Le Parfum",
    brand: "YVES SAINT LAURENT",
    price: "₦195,000",
    image: "/featurepic/YSL.webp",
    description: "The most concentrated and long-lasting manifestation of freedom. A fiery blend where ultra-sensual orange blossom meets a burning saffron accord.",
    sizes: ["30ml", "50ml", "90ml"],
    notes: { top: "Ginger, Saffron, Mandarin", heart: "Orange Blossom, Lavender", base: "Bourbon Vanilla, Honey" }
  },
  "old": {
    name: "Old Money",
    brand: "ATELIER AURA",
    price: "₦85,000",
    image: "/featurepic/Old.webp",
    description: "A signature formulation evoking timeless lineage. Rich leather upholstery, warm library woods, and a quiet dash of crisp, clean, structured luxury tailored by hand.",
    sizes: ["10ml", "50ml", "100ml"],
    notes: { top: "Crushed Neroli", heart: "Florentine Iris, Antique Cedarwood", base: "Russian Leather, Soft Amber" }
  },
  "haltane": {
    name: "Haltane",
    brand: "PARFUMS DE MARLY",
    price: "₦320,000",
    image: "/featurepic/Haltane.webp",
    description: "An original scent of both light and shadow. A contrast of traditional rare woods and brilliant freshness, designed specifically for connoisseurs of fine artisanal blending.",
    sizes: ["125ml"],
    notes: { top: "Clary Sage, Lavender", heart: "Saffron, Praline, Oudwood", base: "Cedarwood, Elderwood, Leather" }
  },
  "cherry": {
    name: "Cherry",
    brand: "TOM FORD",
    price: "₦75,000",
    image: "/featurepic/Cherry.webp",
    description: "A full-bodied journey into the once-forbidden. A contrasting scent that reveals a tempting dichotomy of playful, candy-like gleam on the outside and luscious flesh on the inside.",
    sizes: ["50ml", "100ml"],
    notes: { top: "Black Cherry, Cherry Liqueur", heart: "Griot Syrup, Turkish Rose", base: "Roasted Tonka Bean, Sandalwood" }
  },
  "lattafa": {
    name: "Khamrah",
    brand: "LATTAFA",
    price: "₦65,000",
    image: "/featurepic/Lattafa.webp",
    description: "A luxurious oriental vanilla perfume combining precious spices, the warmth of woody notes, and the soft opulence of premium warm gourmand notes.",
    sizes: ["100ml"],
    notes: { top: "Cognac, Cinnamon, Oak", heart: "Tonka Bean, Praline, Dates", base: "Vanilla, Sandalwood, Amberwood" }
  },
  "imperial": {
    name: "Imperial",
    brand: "CREED",
    price: "₦95,000",
    image: "/featurepic/Imperial.webp",
    description: "A gold standard in fragrance profiles. Crisp, clean, refreshing notes of sea salt and sun-ripened Mediterranean citrus fruits nestled inside a royal musk anchor.",
    sizes: ["50ml", "100ml"],
    notes: { top: "Bergamot, Green Mandarin", heart: "Iris, Marine Sea Salt", base: "Sandalwood, Amber, Musk" }
  },
  "acqua": {
    name: "Acqua Di Gio",
    brand: "GIORGIO ARMANI",
    price: "₦140,000",
    image: "/featurepic/Acqua.webp",
    description: "A classic aquatic masterpiece born from the volcanic shores of the Mediterranean. Pure freshness combined with complex earthy sea minerals.",
    sizes: ["75ml", "125ml", "200ml"],
    notes: { top: "Calabrian Bergamot, Marine Notes", heart: "Rosemary, Clary Sage", base: "Patchouli, Incense" }
  },
  "bleu": {
    name: "Bleu de Chanel",
    brand: "CHANEL",
    price: "₦175,000",
    image: "/featurepic/Bleu.webp",
    description: "An ode to masculine freedom expressed in a woody aromatic fragrance with a captivating trail. A timeless scent housed in an enigmatic blue bottle.",
    sizes: ["50ml", "100ml", "150ml"],
    notes: { top: "Grapefruit, Mint, Pink Pepper", heart: "Ginger, Nutmeg, Jasmine", base: "Incense, Vetiver, Cedarwood" }
  }
};


export default function ProductTemplate() {
  // useParams() safely reads the URL across Next.js 13, 14, and 15 without errors
  const params = useParams();
  const productId = typeof params?.id === "string" ? params.id.toLowerCase() : "sauvage";
  
  // Fallback to sauvage if URL typing contains a mistake
  const product = PRODUCTS_REGISTRY[productId] || PRODUCTS_REGISTRY["sauvage"];

  // Page Interactive UI States
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [activeTab, setActiveTab] = useState("description");
  const { addToCart } = useCart();

  return (
    <main className={styles.productPageWrapper}>
      
      {/* 1. PRIMARY SECTION: SPLIT MULTI-SCREEN LAYOUT */}
      <section className={styles.mainLayoutContainer}>
        
        {/* Left Column: Visual Showcase Block */}
        <div className={styles.imageGalleryBlock}>
          <div className={styles.stickyImageStickyGuard}>
            <img 
              src={product.image} 
              alt={`${product.brand} ${product.name}`} 
              className={styles.primaryProductHeroImg} 
            />
          </div>
        </div>

        {/* Right Column: Interaction & Meta details block */}
        <div className={styles.productMetaDetailsBlock}>
          <span className={styles.brandSubtitleLabel}>{product.brand}</span>
          <h1 className={styles.mainProductHeadingTitle}>{product.name}</h1>
          <p className={styles.productPriceTag}>{product.price}</p>
          
          <hr className={styles.luxeDividerLine} />

          {/* Size Select Architecture */}
          <div className={styles.sizeSelectionGroupContainer}>
            <h3 className={styles.controlGroupTitleLabel}>Select Size</h3>
            <div className={styles.sizeChipsFlexTrack}>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`${styles.sizeChipItemButton} ${selectedSize === size ? styles.activeSizeChip : ""}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

               {/* Transaction Checkout Action Area */}
               <div className={styles.checkoutInteractionsRowButtonGroup}>
                 <button 
                   type="button" 
                   className={styles.addToCartDrawerTriggerBtn}
                   onClick={() => {
                     addToCart({
                       id: productId,
                       name: product.name,
                       brand: product.brand,
                       price: product.price,
                       image: product.image,
                       selectedSize: selectedSize,
                       quantity: 1,
                     });
                     alert(`${product.name} added to bag!`);
                   }}
                 >
                   Add To Shopping Bag
                 </button>
                 
                 <button type="button" className={styles.instantPurchaseDirectCheckoutBtn}>
                   Purchase Now
                 </button>
               </div>

          {/* Tabs Navigation: Story vs Details */}
          <div className={styles.editorialTabsSystemContainer}>
            <div className={styles.tabsToggleHeadersRowNavigation}>
              <button 
                type="button"
                onClick={() => setActiveTab("description")}
                className={`${styles.tabHeaderNavTitleLabel} ${activeTab === "description" ? styles.activeTabStateLine : ""}`}
              >
                The Story
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab("shipping")}
                className={`${styles.tabHeaderNavTitleLabel} ${activeTab === "shipping" ? styles.activeTabStateLine : ""}`}
              >
                Delivery & Packaging
              </button>
            </div>
            
            <div className={styles.tabContentBodyDisplayPanel}>
              {activeTab === "description" ? (
                <p className={styles.tabDescriptionParagraphProse}>{product.description}</p>
              ) : (
                <p className={styles.tabDescriptionParagraphProse}>
                  Every bottle is safely secured inside our signature cream-woven geometric boxes, then wrapped with heavyweight custom tissue paper. Domestically shipped with localized insurance options within 48 business hours.
                </p>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 2. THE OLFACTORY PALETTE (Scent Notes Matrix) */}
      <section className={styles.olfactoryCompositionSectionContainer}>
        <h2 className={styles.sectionSectionCenteredTitleLabel}>The Olfactory Architecture</h2>
        <div className={styles.scentNotesStructuralGridThreeColumnLayout}>
          <div className={styles.scentNoteMetricCardBlock}>
            <span className={styles.noteLevelWeightSubtitleHeader}>Top Notes</span>
            <p className={styles.noteLevelListingIngredientsLabel}>{product.notes.top}</p>
          </div>
          <div className={styles.scentNoteMetricCardBlock}>
            <span className={styles.noteLevelWeightSubtitleHeader}>Heart Notes</span>
            <p className={styles.noteLevelListingIngredientsLabel}>{product.notes.heart}</p>
          </div>
          <div className={styles.scentNoteMetricCardBlock}>
            <span className={styles.noteLevelWeightSubtitleHeader}>Base Notes</span>
            <p className={styles.noteLevelListingIngredientsLabel}>{product.notes.base}</p>
          </div>
        </div>
      </section>

      {/* 3. REVIEWS ANCHOR VIEWPORT */}
      <section className={styles.clientReviewsViewportWrapperSection}>
        <div className={styles.reviewsStructuralSplitLayoutRow}>
          <div className={styles.reviewsSummaryStickySidebarBlock}>
            <h2 className={styles.editorialReviewsTitleLabelHeading}>Client Vernacular</h2>
            <p className={styles.verifiedFiveStarAverageMetricSubtitleScore}>4.9 / 5.0 Rating</p>
            <span className={styles.totalAccumulatedCountReviewsLabel}>Based on 142 private inquiries</span>
          </div>
          
          <div className={styles.reviewsFeedFlowListTimelineBlock}>
            <div className={styles.singleReviewItemFeedCard}>
              <div className={styles.reviewMetadataTitleBarFlexLine}>
                <span className={styles.reviewerSignatureNameLabel}>Amara K.</span>
                <span className={styles.reviewTimestampLabelDate}>July 2026</span>
              </div>
              <p className={styles.verifiedReviewTextContentProse}>
                "The silage on this particular formulation is architectural. It sits close to the skin like a second layer of silk but leaves an unmistakable imprint through an open room. Sublime delivery speed."
              </p>
            </div>
            <div className={styles.singleReviewItemFeedCard}>
              <div className={styles.reviewMetadataTitleBarFlexLine}>
                <span className={styles.reviewerSignatureNameLabel}>Tunde O.</span>
                <span className={styles.reviewTimestampLabelDate}>June 2026</span>
              </div>
              <p className={styles.verifiedReviewTextContentProse}>
                "Bespoke luxury in every literal definition. Packaging was unblemished, the item feels weighted and expensive. Truly a magnificent signature fragrance addition."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CROSS-SELL RECIPROCATION MODULE: YOU MAY ALSO LIKE */}
      <section className={styles.crossSellReciprocationSectionContainer}>
        <h3 className={styles.crossSellSectionSectionTitleHeaderLabel}>Curated Concurrences</h3>
        <div className={styles.crossSellProductsHorizontalFlexTrackRow}>
          {Object.entries(PRODUCTS_REGISTRY).slice(0, 6).map(([id, item]) => (
            <Link href={`/product/${id}`} key={id} className={styles.crossSellMiniatureProductCardCard}>
              <div className={styles.crossSellImageContainerViewportWrapper}>
                <img src={item.image} alt={item.name} className={styles.miniatureProductThumbnailImgImg} />
              </div>
              <h4 className={styles.miniatureCardTitleLabel}>{item.name}</h4>
              <p className={styles.miniatureCardPriceLabelText}>{item.price}</p>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}