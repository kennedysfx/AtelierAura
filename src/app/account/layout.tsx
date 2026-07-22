// src/app/account/layout.tsx
'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import styles from './account.module.css';

export default function AccountLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1. Fire the secure POST request to drop the HTTP-only cookie backend-side
      await fetch('/api/auth/logout', { method: 'POST' });
      
      // 2. Refresh the server component router state to drop client cache
      router.refresh();
      
      // 3. Redirect cleanly to the luxury storefront homepage
      window.location.href = '/';
    } catch (error) {
      console.error('Logout execution failed:', error);
    }
  };

  return (
    <div className={styles.accountWrapper}>
{/* Custom Minimal Account Header */}
      <header className={styles.accountHeader}>
        <div className={styles.headerContent}>
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
            {/* 🌟 Logout button moved inline, before the icon */}
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Log out
            </button>
            
            <div className={styles.userIconWrapper} aria-label="Account Profile">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Main Account Content Area */}
      <main className={styles.accountMain}>
        {/* Navigation Tabs (Orders / Profile) */}
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