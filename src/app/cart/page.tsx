"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; // 🌟 Imported useRouter for history navigation
import styles from "./cart.module.css";
import { useCart } from "@/context/CartContext"; 

export default function CartPage() {
  const router = useRouter(); // 🌟 Initialized the router instance
  
  // Pulling live data and functions directly from the Context
  const { cartItems, updateQuantity, removeItem } = useCart();

  // Local state just for the order note input field
  const [orderNote, setOrderNote] = useState("");

  // Helper function to strip currencies and commas for pure math
  const parsePrice = (priceStr: string): number => {
    return parseInt(priceStr.replace(/[^0-9]/g, ""), 10) || 0;
  };

  // Dynamically calculate the subtotal based on the live context items
  const subtotal = cartItems.reduce((acc, item) => acc + parsePrice(item.price) * item.quantity, 0);

  return (
    <div className={styles.cartPageWrapper}>
      <div className={styles.cartMainLayoutContainer}>
        
        {/* Left Column: List Layout & Order Notes */}
        <div className={styles.cartLeftMediaBlock}>
          <h1 className={styles.cartMainTitleHeading}>Your Cart</h1>
          <div className={styles.luxeDividerLine} />

          {cartItems.length === 0 ? (
            <div className={styles.emptyCartNotice}>
              <p>Your luxury curation edit is currently empty.</p>
              {/* 🌟 Changed from Link to button with router.back() */}
              <button 
                type="button" 
                onClick={() => router.back()} 
                className={styles.continueShoppingBtn}
              >
                Discover Fragrances
              </button>
            </div>
          ) : (
            <>
              <div className={styles.cartItemsTimelineFlex}>
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className={styles.singleCartItemCard}>
<Link href={`/product/${item.id}`} className={styles.itemImageViewportWrapper}>
  <Image 
    src={item.image} 
    alt={item.name} 
    fill
    sizes="80px"
    className={styles.itemThumbnailImg} 
  />
</Link>

                    <div className={styles.itemMetaDetailsInformation}>
                      <span className={styles.itemBrandSubtitleLabel}>{item.brand}</span>
                      <Link href={`/product/${item.id}`} className={styles.itemNameInteractiveTitle}>
                        {item.name}
                      </Link>
                      <span className={styles.itemSelectedSizeBadge}>Size: {item.selectedSize}</span>
                      
                      <button 
                        type="button"
                        onClick={() => removeItem(item.id, item.selectedSize)} 
                        className={styles.removeItemActionTextBtn}
                      >
                        Remove
                      </button>
                    </div>

                    <div className={styles.itemPriceAndQuantityControlsMatrix}>
                      <span className={styles.itemUnitDynamicPrice}>{item.price}</span>
                      <div className={styles.quantityIncrementalStepperControl}>
                        <button type="button" onClick={() => updateQuantity(item.id, item.selectedSize, -1)} className={styles.qtyAdjustmentMathBtn}>−</button>
                        <span className={styles.qtyValueDisplayLabel}>{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, item.selectedSize, 1)} className={styles.qtyAdjustmentMathBtn}>+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.editorialOrderNotesContainer}>
                <label htmlFor="orderNote" className={styles.controlGroupTitleLabel}>
                  Leave a note with your order
                </label>
                <textarea
                  id="orderNote"
                  className={styles.luxuryOrderNotesTextAreaInput}
                  placeholder="Special delivery instructions, or custom requests..."
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  rows={4}
                />
              </div>
            </>
          )}
        </div>

        {/* Right Column: Checkout Summary Panel */}
        {cartItems.length > 0 && (
          <div className={styles.cartSummaryStickySidebarBlock}>
            <div className={styles.summaryBreakdownCardCanvas}>
              <h2 className={styles.summaryTitleHeaderLabel}>Order Summary</h2>
              <div className={styles.luxeDividerLine} />
              
              <div className={styles.summarySubtotalRowFlexLine}>
                <span className={styles.subtotalHorizontalFixedLabel}>Total</span>
                <span className={styles.subtotalCalculatedValuePrice}>
                  ₦{subtotal.toLocaleString()}.00 NGN
                </span>
              </div>
              
              <p className={styles.taxShippingDisclaimerProseText}>
                Taxes and premium shipping protocols calculated during secure checkout processing.
              </p>

              <div className={styles.checkoutInteractionsRowButtonGroup}>
                <button 
                  type="button"
                  onClick={() => alert("Proceeding to secure payment gate...")} 
                  className={styles.addToCartDrawerTriggerBtn}
                >
                  Checkout
                </button>
                
                {/* 🌟 Changed from Link to button with router.back() */}
                <button 
                  type="button"
                  onClick={() => router.back()} 
                  className={styles.instantPurchaseDirectCheckoutBtn}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}