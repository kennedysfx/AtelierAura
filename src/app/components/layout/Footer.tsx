import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        
        {/* Brand Column */}
        <div className={styles.brandSection}>
          <h2 className={styles.logo}>Atelier Aura</h2>
          <p className={styles.tagline}>Elevating the essence of raw luxury.</p>
        </div>
        
        {/* Navigation Grid */}
        <div className={styles.linkGrid}>
          <div className={styles.linkColumn}>
            <h3>The House</h3>
            <Link href="/about">Philosophy</Link>
            <Link href="/ingredients">Raw Ingredients</Link>
            <Link href="/contact">Contact Us</Link>
          </div>
          
          <div className={styles.linkColumn}>
            <h3>Collections</h3>
            <Link href="/womens">Pour Femme</Link>
            <Link href="/mens">Pour Homme</Link>
            <Link href="/cosmetics">Cosmetics</Link>
          </div>
        </div>

        {/* Newsletter Column */}
        <div className={styles.newsletterSection}>
          <h3>Join the Inner Circle</h3>
          <form className={styles.newsletterForm}>
            <input 
              type="email" 
              placeholder="Email Address" 
              required 
              className={styles.input} 
            />
            <button type="submit" className={styles.submitBtn}>Subscribe</button>
          </form>
        </div>

      </div>

      <div className={styles.bottomBar}>
        <p>&copy; {new Date().getFullYear()} Atelier Aura. All rights reserved.</p>
      </div>
    </footer>
  );
}