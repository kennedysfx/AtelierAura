// src/app/account/orders/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import styles from './orders.module.css';

export default function OrdersPage() {
  return (
    <div className={styles.ordersContainer}>
      <h1 className={styles.pageTitle}>Orders</h1>

      {/* Welcome Card Banner */}
      <div className={styles.welcomeCard}>
        <div className={styles.welcomeTextContent}>
          <h2 className={styles.welcomeHeading}>Welcome</h2>
          <p className={styles.welcomeSubtext}>Ready to shop?</p>
          <Link href="/" className={styles.shopNowBtn}>
            Shop now
          </Link>
        </div>
        
        <div className={styles.welcomeImages}>
          <div className={styles.imageWrapper}>
            <Image 
              src="/hero/Dore-1.webp" 
              alt="Atelier Aura Collection" 
              width={140} 
              height={180} 
              priority
              className={styles.perfumeImg}
            />
          </div>
        </div>
      </div>

      {/* Order History Section */}
      <div className={styles.historySection}>
        <h3 className={styles.historyTitle}>Transaction History</h3>
        <div className={styles.emptyOrdersBox}>
          <p className={styles.emptyText}>You haven&apos;t placed any orders yet.</p>
        </div>
      </div>
    </div>
  );
}