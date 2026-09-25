"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./cart.module.css";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const router = useRouter();

  const { cartItems, updateQuantity, removeItem } = useCart();

  const [orderNote, setOrderNote] = useState("");
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const parsePrice = (priceStr: string): number => {
    return parseInt(priceStr.replace(/[^0-9]/g, ""), 10) || 0;
  };

  const subtotal = cartItems.reduce((acc, item) => acc + parsePrice(item.price) * item.quantity, 0);

  const handleCheckout = async () => {
    if (!email) {
      alert("Please enter an email address to receive your receipt.");
      return;
    }

    setIsProcessing(true);

    try {
      const PaystackPop = (await import("@paystack/inline-js")).default;
      const paystack = new PaystackPop();

      paystack.newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: email,
        amount: subtotal * 100,
        currency: "NGN",
        onSuccess: async (transaction: { reference: string }) => {
          const verifyRes = await fetch("/api/paystack/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference: transaction.reference }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.status) {
            alert("Payment successful and verified! Thank you for your luxury order.");
            router.push("/");
          } else {
            alert("Payment completed, but verification failed.");
            setIsProcessing(false);
          }
        },
        onCancel: () => {
          setIsProcessing(false);
        },
      });
    } catch (error) {
      console.error("Payment initialization error:", error);
      alert("Could not load payment gateway. Please check your internet connection.");
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.cartPageWrapper}>
      <div className={styles.cartMainLayoutContainer}>
        
        <div className={styles.cartLeftMediaBlock}>
          <h1 className={styles.cartMainTitleHeading}>Your Cart</h1>
          <div className={styles.luxeDividerLine} />

          {cartItems.length === 0 ? (
            <div className={styles.emptyCartNotice}>
              <p>Your luxury curation edit is currently empty.</p>
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

              <div style={{ marginBottom: '1rem', marginTop: '1rem' }}>
                <label htmlFor="email" style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: '#555' }}>
                  Email Address for Receipt
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div className={styles.checkoutInteractionsRowButtonGroup}>
                <button 
                  type="button"
                  onClick={handleCheckout} 
                  disabled={isProcessing}
                  className={styles.addToCartDrawerTriggerBtn}
                  style={{ opacity: isProcessing ? 0.7 : 1, cursor: isProcessing ? 'not-allowed' : 'pointer' }}
                >
                  {isProcessing ? "Connecting..." : "Checkout"}
                </button>
                
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