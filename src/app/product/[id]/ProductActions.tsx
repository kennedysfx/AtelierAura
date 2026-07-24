"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/products";
import styles from "./product.module.css";

export default function ProductActions({
  product,
  productId,
}: {
  product: Product;
  productId: string;
}) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [activeTab, setActiveTab] = useState("description");
  const { addToCart } = useCart();

  return (
    <>
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
              Every product is safely secured inside our signature cream-woven geometric boxes, then wrapped with heavyweight custom tissue paper. Domestically shipped with localized insurance options within 48 business hours.
            </p>
          )}
        </div>
      </div>
    </>
  );
}