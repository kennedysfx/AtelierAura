'use client';

import React, { useState, useEffect } from 'react';
import styles from './profile.module.css';

export default function ProfilePage() {
  // Modal visibility states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);

  // Address checkbox state
  const [isDefaultAddressChecked, setIsDefaultAddressChecked] = useState(false);

  // 🌟 Custom Auth State
  const [liveUserEmail, setLiveUserEmail] = useState("");
  const [status, setStatus] = useState<"loading" | "authenticated">("loading");

  // Main user account state
  const [accountData, setAccountData] = useState({
    firstName: '',
    lastName: '',
    email: '' 
  });

  // 🌟 Fetch the logged-in user details from your own auth system on load
  useEffect(() => {
    fetch('/api/user/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.email) {
          setLiveUserEmail(data.email);
          setAccountData((prev) => ({ ...prev, email: data.email }));
        }
        setStatus("authenticated");
      })
      .catch((err) => {
        console.error("Auth error:", err);
        setStatus("authenticated");
      });
  }, []);

  // Temporary state for the edit modal to hold changes before saving
  const [editFormData, setEditFormData] = useState({
    firstName: accountData.firstName,
    lastName: accountData.lastName,
  });

  // Handle opening the edit modal and populating current data
  const handleOpenEdit = () => {
    setEditFormData({
      firstName: accountData.firstName,
      lastName: accountData.lastName,
    });
    setIsEditProfileOpen(true);
  };

  // Send profile updates to your Neon database via API route
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: accountData.email,
          firstName: editFormData.firstName,
          lastName: editFormData.lastName,
        }),
      });

      if (response.ok) {
        setAccountData({
          ...accountData,
          firstName: editFormData.firstName,
          lastName: editFormData.lastName,
        });
        setIsEditProfileOpen(false);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  // Send address updates to your Neon database via API route
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const addressData = {
      email: accountData.email,
      isDefault: isDefaultAddressChecked,
    };

    try {
      const response = await fetch('/api/user/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData),
      });

      if (response.ok) {
        setIsDefaultAddressChecked(false);
        setIsAddAddressOpen(false);
      }
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  // Render a loading state while fetching your custom session
  if (status === "loading") {
    return <div className={styles.profileContainer}>Loading profile...</div>;
  }

  return (
    <div className={styles.profileContainer}>
      
      {/* Contact Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Contact</h2>
          <button className={styles.actionBtn} onClick={handleOpenEdit}>
            Edit
          </button>
        </div>
        <div className={styles.card}>
          <div className={styles.cardRow}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>{accountData.email}</span>
          </div>
          {(accountData.firstName || accountData.lastName) && (
            <div className={styles.cardRow}>
              <span className={styles.label}>Name</span>
              <span className={styles.value}>{`${accountData.firstName} ${accountData.lastName}`}</span>
            </div>
          )}
        </div>
      </section>

      {/* Addresses Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Addresses</h2>
          <button className={styles.actionBtn} onClick={() => setIsAddAddressOpen(true)}>
            Add
          </button>
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

      {/* ================= MODALS ================= */}

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Edit profile</h3>
              <button className={styles.closeBtn} onClick={() => setIsEditProfileOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <form onSubmit={handleSaveProfile}>
              <div className={styles.modalBody}>
                <div className={styles.formRow}>
                  <input 
                    type="text" 
                    className={styles.inputField} 
                    placeholder="First name" 
                    value={editFormData.firstName}
                    onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})}
                    autoFocus 
                  />
                  <input 
                    type="text" 
                    className={styles.inputField} 
                    placeholder="Last name" 
                    value={editFormData.lastName}
                    onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <div className={`${styles.inputWithLabel} ${styles.disabledContainer}`}>
                     <label>Email</label>
                     <input 
                       type="email" 
                       className={styles.disabledInput} 
                       value={accountData.email} 
                       disabled 
                     />
                  </div>
                  <p className={styles.helperText}>This email is used for sign-in and order updates.</p>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsEditProfileOpen(false)}>Cancel</button>
                <button type="submit" className={styles.saveBtnActive}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {isAddAddressOpen && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} ${styles.largeModal}`}>
            <div className={styles.modalHeader}>
              <h3>Add address</h3>
              <button className={styles.closeBtn} onClick={() => { setIsAddAddressOpen(false); setIsDefaultAddressChecked(false); }}>
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <form onSubmit={handleSaveAddress}>
              <div className={styles.modalBody}>
                
                <div className={styles.formGroup}>
                  <input type="text" className={styles.inputField} placeholder="Country/region" required />
                </div>

                <div className={styles.formRow}>
                  <input type="text" className={styles.inputField} placeholder="First name" required autoFocus />
                  <input type="text" className={styles.inputField} placeholder="Last name" required />
                </div>

                <div className={styles.formGroup}>
                  <input type="text" className={styles.inputField} placeholder="Address" required />
                </div>

                <div className={styles.formGroup}>
                  <input type="text" className={styles.inputField} placeholder="Apartment, suite, etc (optional)" />
                </div>

                <div className={styles.formRowThree}>
                  <input type="text" className={styles.inputField} placeholder="City" required />
                  <input type="text" className={styles.inputField} placeholder="State" required />
                  <input type="text" className={styles.inputField} placeholder="Postal code" required />
                </div>

                <div className={styles.formGroup}>
                  <div className={styles.phoneInputContainer}>
                    <input type="tel" className={styles.inputField} placeholder="+234" required />
                    <span className={styles.floatingLabel}>Phone</span>
                    <div className={styles.flagDropdown}>
                      <div className={styles.mockFlag}></div>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                </div>

                <div className={styles.checkboxContainer}>
                  <input 
                    type="checkbox" 
                    id="default-address" 
                    className={styles.checkboxInput} 
                    checked={isDefaultAddressChecked}
                    onChange={(e) => setIsDefaultAddressChecked(e.target.checked)}
                  />
                  <label htmlFor="default-address" className={styles.checkboxLabel}>
                    This is my default address
                  </label>
                </div>

              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => { setIsAddAddressOpen(false); setIsDefaultAddressChecked(false); }}>Cancel</button>
                <button 
                  type="submit" 
                  disabled={!isDefaultAddressChecked}
                  className={!isDefaultAddressChecked ? styles.saveBtn : styles.saveBtnActive}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}