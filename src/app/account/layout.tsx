// src/app/account/layout.tsx
'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import styles from './account.module.css';
import { useCart } from '@/context/CartContext';

export default function AccountLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount } = useCart();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.refresh();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout execution failed:', error);
    }
  };

  return (
    <div className={styles.accountWrapper}>
      <header className={styles.accountHeader}>
        <div className={styles.headerContent}>
          {/* 🌟 Cart icon — now at the true left end of the header */}
           <Link href="/account/cart" className={styles.cartIconWrapper} aria-label="Shopping Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" fill="currentColor" />
              <circle cx="20" cy="21" r="1" fill="currentColor" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className={styles.cartCount}>{cartCount}</span>
          </Link>

          <Link href="/" className={styles.logoLink} aria-label="Atelier Aura Home">
            <Image 
              src="/logo.png" 
              alt="Atelier Aura" 
              width={70} 
              height={95} 
              priority
              className={styles.logoImage}
            />
          </Link>
          
          <div className={styles.headerRight}>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className={styles.accountMain}>
        <nav className={styles.accountTabs}>
          <Link 
            href="/account/orders" 
            className={`${styles.tabLink} ${pathname.includes('/orders') ? styles.activeTab : ''}`}
          >
            Orders
          </Link>
          <Link 
            href="/account/profile" 
            className={`${styles.tabLink} ${pathname.includes('/profile') ? styles.activeTab : ''}`}
          >
            Profile
          </Link>
        </nav>

        <div className={styles.tabContent}>
          {children}
        </div>
      </main>
    </div>
  );
}