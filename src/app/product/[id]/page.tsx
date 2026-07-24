import Image from "next/image";
import Link from "next/link";
import { PRODUCTS_REGISTRY } from "@/lib/products";
import ProductActions from "./ProductActions";
import styles from "./product.module.css";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = id.toLowerCase();
  const product = PRODUCTS_REGISTRY[productId] || PRODUCTS_REGISTRY["sauvage"];

  return (
    <main className={styles.productPageWrapper}>
      {/* 1. PRIMARY SECTION: SPLIT MULTI-SCREEN LAYOUT */}
      <section className={styles.mainLayoutContainer}>
        <div className={styles.imageGalleryBlock}>
          <div className={styles.stickyImageStickyGuard}>
            <Image
              src={product.image}
              alt={`${product.brand} ${product.name}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.primaryProductHeroImg}
            />
          </div>
        </div>

        <div className={styles.productMetaDetailsBlock}>
          <span className={styles.brandSubtitleLabel}>{product.brand}</span>
          <h1 className={styles.mainProductHeadingTitle}>{product.name}</h1>
          <p className={styles.productPriceTag}>{product.price}</p>

          <hr className={styles.luxeDividerLine} />

          <ProductActions product={product} productId={productId} />
        </div>
      </section>

      {/* 2. THE OLFACTORY PALETTE */}
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
                "The silage and quality of this particular formulation is architectural. It sits close to the skin like a second layer of silk but leaves an unmistakable imprint through an open room. Sublime delivery speed."
              </p>
            </div>
            <div className={styles.singleReviewItemFeedCard}>
              <div className={styles.reviewMetadataTitleBarFlexLine}>
                <span className={styles.reviewerSignatureNameLabel}>Tunde O.</span>
                <span className={styles.reviewTimestampLabelDate}>June 2026</span>
              </div>
              <p className={styles.verifiedReviewTextContentProse}>
                "Bespoke luxury in every literal definition. Packaging was unblemished, the item feels weighted and expensive. Truly a magnificent addition to my daily routine."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CROSS-SELL RECIPROCATION MODULE */}
      <section className={styles.crossSellReciprocationSectionContainer}>
        <h3 className={styles.crossSellSectionSectionTitleHeaderLabel}>You May Also Like</h3>
        <div className={styles.crossSellProductsHorizontalFlexTrackRow}>
          {Object.entries(PRODUCTS_REGISTRY).slice(0, 6).map(([itemId, item]) => (
            <Link href={`/product/${itemId}`} key={itemId} className={styles.crossSellMiniatureProductCardCard}>
              <div className={styles.crossSellImageContainerViewportWrapper}>
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 480px) 33vw, 150px"
                  className={styles.miniatureProductThumbnailImgImg}
                />
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