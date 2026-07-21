"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";
import { useCart } from "@/context/CartContext"; 

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // 🌟 2. Access the global cart count
  const { cartCount } = useCart();
  
  // Search state variables
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      window.dispatchEvent(new Event("menuClosed"));
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      if (window.innerWidth > 1024 && desktopSearchInputRef.current) {
        desktopSearchInputRef.current.focus();
      } else if (mobileSearchInputRef.current) {
        mobileSearchInputRef.current.focus();
      }
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen && searchValue === "") {
      const timer = setTimeout(() => {
        setIsSearchOpen(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen, searchValue]);

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
        <div className={styles.navContainer}>
          
          {/* MOBILE ONLY: Left-aligned Utility Group (Cart Only) */}
          <div className={styles.mobileLeftIcons}>
            <Link href="/cart" className={styles.iconButton} aria-label="Shopping Cart">
              <div className={styles.cartIconWrapper}>
                <svg className={styles.svgIcon} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <circle cx="9" cy="21" r="1" fill="currentColor" />
                  <circle cx="20" cy="21" r="1" fill="currentColor" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <span className={styles.cartCount}>{cartCount}</span>
              </div>
            </Link>
          </div>

          {/* Desktop Left: Collections */}
          <nav className={styles.navGroup}>
            <Link href="/womens" className={styles.navLink}>
              <span className={styles.hoverTranslate}>
                <span className={styles.primaryText}>Pour Femme</span>
                <span className={styles.secondaryText}>For Women</span>
              </span>
            </Link>
            <Link href="/mens" className={styles.navLink}>
              <span className={styles.hoverTranslate}>
                <span className={styles.primaryText}>Pour Homme</span>
                <span className={styles.secondaryText}>For Men</span>
              </span>
            </Link>
    
            <Link href="/cosmetics" className={styles.navLink}>Cosmetics</Link>
          </nav>

          {/* Center: Brand Logo */}
          <Link href="/" className={styles.logo}>
            <Image 
              src="/logo.png" 
              alt="Atelier Aura" 
              width={100} 
              height={140} 
              priority
              className={styles.logoImage}
            />
          </Link>

          {/* Desktop Right: Actions */}
          <nav className={styles.navGroupRight}>
            {pathname !== '/' && (
              <Link href="/" className={styles.navLink}>Home</Link>
            )}
            <Link href="/contact" className={styles.navLink}>Contact</Link>
            
            <div className={`${styles.searchContainer} ${isSearchOpen ? styles.searchActive : ""}`}>
              <button 
                className={styles.iconButton} 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search"
              >
                <svg className={styles.svgIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
              <input 
                ref={desktopSearchInputRef}
                type="text" 
                placeholder="Search raw accords..." 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className={styles.searchInput}
              />
            </div>

<Link href="/login?mode=login" className={styles.iconButton} aria-label="Vault Profile">
  <svg className={styles.svgIcon} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
</Link>

            <Link href="/cart" className={styles.iconButton} aria-label="Shopping Cart">
              <div className={styles.cartIconWrapper}>
                <svg className={styles.svgIcon} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" fill="currentColor" />
                  <circle cx="20" cy="21" r="1" fill="currentColor" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <span className={styles.cartCount}>{cartCount}</span>
              </div>
            </Link>
          </nav>

          <button 
            className={styles.hamburgerBtn} 
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <span className={styles.hamburgerLine}></span>
            <span className={`${styles.hamburgerLine} ${styles.middleLine}`}></span>
            <span className={styles.hamburgerLine}></span>
          </button>
        </div>
      </header>

      {/* Mobile Overlay & Drawer */}
      <div 
        className={`${styles.overlay} ${isMobileMenuOpen ? styles.overlayActive : ""}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      <aside className={`${styles.mobileDrawer} ${isMobileMenuOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.drawerHeader}>
          <button 
            className={`${styles.hamburgerBtn} ${styles.closeBtn} ${isMobileMenuOpen ? styles.closeActive : ""}`} 
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <span className={styles.hamburgerLine}></span>
            <span className={`${styles.hamburgerLine} ${styles.middleLine}`}></span>
            <span className={styles.hamburgerLine}></span>
          </button>

          <div className={styles.drawerRightIcons}>
            <div className={`${styles.searchContainer} ${isSearchOpen ? styles.searchActive : ""}`}>
              <button 
                className={styles.iconButton} 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search"
              >
                <svg className={styles.svgIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
              <input 
                ref={mobileSearchInputRef}
                type="text" 
                placeholder="Search..." 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <Link 
              href="/login" 
              className={styles.iconButton} 
              onClick={() => setIsMobileMenuOpen(false)} 
              aria-label="Vault Profile"
            >
              <svg className={styles.svgIcon} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
          </div>
        </div>

        <nav className={styles.mobileNav}>
          {pathname !== '/' && (
            <Link href="/" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>home</Link>
          )}
          <Link href="/womens" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>For Women</Link>
          <Link href="/mens" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>For Men</Link>
          <Link href="/cosmetics" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Cosmetics</Link>
          <Link href="/contact" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>

        </nav>
        
{/* 🌟 New Mobile Menu Footer containing Authentication Links */}
<div className={styles.mobileDrawerFooter}>
  <Link href="/login?mode=login" className={styles.mobileSignInBtn} onClick={() => setIsMobileMenuOpen(false)}>
    Login
  </Link>
  <Link href="/login?mode=register" className={styles.mobileSignUpBtn} onClick={() => setIsMobileMenuOpen(false)}>
    Sign up
  </Link>
</div>
      </aside>
    </>
  );
}