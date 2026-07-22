import React from 'react';
import styles from './profile.module.css';

export default function ProfilePage() {
  return (
    <div className={styles.profileContainer}>
      
      {/* Contact Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Contact</h2>
          <button className={styles.textBtn}>Edit</button>
        </div>
        <div className={styles.card}>
          <div className={styles.cardRow}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>kennedyeducates@gmail.com</span>
          </div>
        </div>
      </section>

      {/* Addresses Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Addresses</h2>
          <button className={styles.textBtn}>Add</button>
        </div>
        <div className={styles.card}>
          <div className={styles.emptyState}>
            <div className={styles.iconWrapper}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <span className={styles.emptyText}>No addresses added</span>
          </div>
        </div>
      </section>

      {/* Marketing Preferences Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Marketing preferences</h2>
        </div>
        <div className={styles.card}>
          <div className={styles.marketingRow}>
            <div className={styles.marketingLeft}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.envelopeIcon}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span className={styles.label}>Email</span>
            </div>
            
            {/* Custom Black Toggle */}
            <div className={styles.toggleWrapper}>
              <input type="checkbox" id="marketing-toggle" className={styles.toggleInput} defaultChecked />
              <label htmlFor="marketing-toggle" className={styles.toggleLabel}></label>
            </div>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className={styles.dangerSection}>
        <button className={styles.deleteBtn}>
          Delete Account
        </button>
      </section>

    </div>
  );
}