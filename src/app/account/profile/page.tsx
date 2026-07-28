'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // 🌟 Added for navigation
import styles from './profile.module.css';

// TypeScript interface for address rendering mapping
interface AddressItem {
  id: number;
  first_name: string;
  last_name: string;
  country: string;
  street_address: string;
  landmark: string;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
  is_default: boolean;
}

export default function ProfilePage() {
  const router = useRouter(); // 🌟 Initialize router
  
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [isDefaultAddressChecked, setIsDefaultAddressChecked] = useState(false);
  const [status, setStatus] = useState<"loading" | "authenticated">("loading");

  // 🌟 Account Deletion States
  const [deleteStep, setDeleteStep] = useState<0 | 1 | 2 | 3>(0); 
  const [deleteEmail1, setDeleteEmail1] = useState('');
  const [deleteEmail2, setDeleteEmail2] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // 🌟 Address List State
  const [addresses, setAddresses] = useState<AddressItem[]>([]);

  const [accountData, setAccountData] = useState({
    firstName: '',
    lastName: '',
    email: '' 
  });

  const [addressFormData, setAddressFormData] = useState({
    country: '',
    firstName: '',
    lastName: '',
    streetAddress: '',
    landmark: '', 
    city: '',
    state: '',
    postalCode: '',
    phone: '',
  });

  // 🌟 Helper function to fetch addresses from DB
  const fetchAddresses = async (email: string) => {
    try {
      const res = await fetch(`/api/user/address?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  useEffect(() => {
    fetch('/api/user/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.email) {
          setAccountData((prev) => ({ ...prev, email: data.email }));
          // Fetch user addresses immediately once email session is loaded
          fetchAddresses(data.email);
          setStatus("authenticated");
        } else {
          // 🌟 If no auth data is returned, force them to login
          router.replace('/login');
        }
      })
      .catch((err) => {
        console.error("Auth error:", err);
        router.replace('/login');
      });
  }, [router]);

  const [editFormData, setEditFormData] = useState({
    firstName: accountData.firstName,
    lastName: accountData.lastName,
  });

  const handleOpenEdit = () => {
    setEditFormData({
      firstName: accountData.firstName,
      lastName: accountData.lastName,
    });
    setIsEditProfileOpen(true);
  };

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

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      email: accountData.email,
      isDefault: isDefaultAddressChecked,
      ...addressFormData
    };

    try {
      const response = await fetch('/api/user/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsDefaultAddressChecked(false);
        setIsAddAddressOpen(false);
        setAddressFormData({
          country: '', firstName: '', lastName: '', streetAddress: '',
          landmark: '', city: '', state: '', postalCode: '', phone: '' 
        });
        // Refresh address data array dynamically on success
        fetchAddresses(accountData.email);
      }
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const handleCloseAddressModal = () => {
    setIsAddAddressOpen(false);
    setIsDefaultAddressChecked(false);
    setAddressFormData({
      country: '', firstName: '', lastName: '', streetAddress: '',
      landmark: '', city: '', state: '', postalCode: '', phone: '' 
    });
  };

  // 🌟 Account Deletion Handlers
  const handleCancelDelete = () => {
    setDeleteStep(0);
    setDeleteEmail1('');
    setDeleteEmail2('');
  };

  const executeAccountDeletion = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: accountData.email }),
      });

      if (response.ok) {
        setDeleteStep(3);
        setAccountData({ firstName: '', lastName: '', email: '' }); // Wipe local state immediately
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDoneDelete = () => {
    // 🌟 Replace browser history so they can't click back. 
    // CHANGE '/signup' IF YOUR ROUTE IS DIFFERENT (e.g., '/register')
    router.replace('/login'); 
  };

  // Validation logic for unlocking the delete button
  const isDeleteDisabled = 
    deleteEmail1 !== accountData.email || 
    deleteEmail2 !== accountData.email || 
    deleteEmail1 !== deleteEmail2 ||
    isDeleting;

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

      {/* Dynamic Addresses Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Addresses</h2>
          <button className={styles.actionBtn} onClick={() => setIsAddAddressOpen(true)}>
            Add
          </button>
        </div>
        
        {addresses.length === 0 ? (
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
        ) : (
          <div className={styles.addressGrid}>
            {addresses.map((addr) => (
              <div key={addr.id} className={styles.addressCard}>
                <div className={styles.addressCardHeader}>
                  <p className={styles.addressName}>{`${addr.first_name} ${addr.last_name}`}</p>
                  {addr.is_default && <span className={styles.defaultBadge}>Default</span>}
                </div>
                <div className={styles.addressDetails}>
                  <p>{addr.street_address}</p>
                  <p><span className={styles.detailLabel}>Landmark:</span> {addr.landmark}</p>
                  <p>{`${addr.city}, ${addr.state} ${addr.postal_code}`}</p>
                  <p>{addr.country}</p>
                  <p className={styles.addressPhone}>{addr.phone}</p>
                </div>
              </div>
            ))}
          </div>
        )}
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
        <button className={styles.deleteBtn} onClick={() => setDeleteStep(1)}>
          Delete Account
        </button>
      </section>

      {/* ================= MODALS ================= */}

      {/* 🌟 New Account Deletion Modal (3 Steps) */}
      {deleteStep > 0 && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            
            {/* Step 1: Warning */}
            {deleteStep === 1 && (
              <>
                <div className={styles.modalHeader}>
                  <h3 className={styles.dangerTitle}>Delete Account</h3>
                </div>
                <div className={styles.modalBody}>
                  <p className={styles.dangerWarningText}>
                    Are you sure you want to delete your account? All data will be permanently deleted and this action cannot be undone.
                  </p>
                </div>
                <div className={styles.modalFooter}>
                  <button className={styles.cancelBtn} onClick={handleCancelDelete}>No, keep account</button>
                  <button className={styles.dangerActionBtnActive} onClick={() => setDeleteStep(2)}>Yes, continue</button>
                </div>
              </>
            )}

            {/* Step 2: Email Confirmation */}
            {deleteStep === 2 && (
              <>
                <div className={styles.modalHeader}>
                  <h3 className={styles.dangerTitle}>Confirm Deletion</h3>
                  <button className={styles.closeBtn} onClick={handleCancelDelete}>
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
                <div className={styles.modalBody}>
                  <p className={styles.helperText} style={{marginBottom: "16px"}}>
                    Please enter your email <strong>({accountData.email})</strong> twice below to confirm.
                  </p>
                  <div className={styles.formGroup}>
                    <input 
                      type="email" 
                      className={styles.inputField} 
                      placeholder="Enter account email" 
                      value={deleteEmail1}
                      onChange={(e) => setDeleteEmail1(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <input 
                      type="email" 
                      className={styles.inputField} 
                      placeholder="Re-enter account email" 
                      value={deleteEmail2}
                      onChange={(e) => setDeleteEmail2(e.target.value)}
                    />
                  </div>
                </div>
                <div className={styles.modalFooter}>
                  <button 
                    disabled={isDeleteDisabled}
                    className={isDeleteDisabled ? styles.dangerActionBtnDisabled : styles.dangerActionBtnActive}
                    onClick={executeAccountDeletion}
                  >
                    {isDeleting ? "Deleting..." : "Permanently Delete"}
                  </button>
                </div>
              </>
            )}

            {/* Step 3: Success Message */}
            {deleteStep === 3 && (
              <>
                <div className={styles.modalHeader} style={{justifyContent: "center", marginBottom: "16px"}}>
                  <div className={styles.successIcon}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                </div>
                <div className={styles.modalBody} style={{textAlign: "center"}}>
                  <h3 style={{fontSize: "18px", fontWeight: "500", marginBottom: "8px", color: "#111111"}}>
                    Account deleted successfully
                  </h3>
                  <p className={styles.helperText}>We are sorry to see you go.</p>
                </div>
                <div className={styles.modalFooter} style={{justifyContent: "center"}}>
                  <button className={styles.saveBtnActive} style={{width: "100%"}} onClick={handleDoneDelete}>
                    Done
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

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
              <button className={styles.closeBtn} onClick={handleCloseAddressModal}>
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <form onSubmit={handleSaveAddress}>
              <div className={styles.modalBody}>
                
                <div className={styles.formGroup}>
                  <input 
                    type="text" 
                    className={styles.inputField} 
                    placeholder="Country/region" 
                    required 
                    value={addressFormData.country}
                    onChange={(e) => setAddressFormData({...addressFormData, country: e.target.value})}
                  />
                </div>

                <div className={styles.formRow}>
                  <input 
                    type="text" 
                    className={styles.inputField} 
                    placeholder="First name" 
                    required 
                    autoFocus 
                    value={addressFormData.firstName}
                    onChange={(e) => setAddressFormData({...addressFormData, firstName: e.target.value})}
                  />
                  <input 
                    type="text" 
                    className={styles.inputField} 
                    placeholder="Last name" 
                    required 
                    value={addressFormData.lastName}
                    onChange={(e) => setAddressFormData({...addressFormData, lastName: e.target.value})}
                  />
                </div>

                <div className={styles.formGroup}>
                  <input 
                    type="text" 
                    className={styles.inputField} 
                    placeholder="Address" 
                    required 
                    value={addressFormData.streetAddress}
                    onChange={(e) => setAddressFormData({...addressFormData, streetAddress: e.target.value})}
                  />
                </div>

                <div className={styles.formGroup}>
                  <input 
                    type="text" 
                    className={styles.inputField} 
                    placeholder="Landmark (closest junction)" 
                    required 
                    value={addressFormData.landmark}
                    onChange={(e) => setAddressFormData({...addressFormData, landmark: e.target.value})}
                  />
                </div>

                <div className={styles.formRowThree}>
                  <input 
                    type="text" 
                    className={styles.inputField} 
                    placeholder="City" 
                    required 
                    value={addressFormData.city}
                    onChange={(e) => setAddressFormData({...addressFormData, city: e.target.value})}
                  />
                  <input 
                    type="text" 
                    className={styles.inputField} 
                    placeholder="State" 
                    required 
                    value={addressFormData.state}
                    onChange={(e) => setAddressFormData({...addressFormData, state: e.target.value})}
                  />
                  <input 
                    type="text" 
                    className={styles.inputField} 
                    placeholder="Postal code" 
                    required 
                    value={addressFormData.postalCode}
                    onChange={(e) => setAddressFormData({...addressFormData, postalCode: e.target.value})}
                  />
                </div>

                <div className={styles.formGroup}>
                  <div className={styles.phoneInputContainer}>
                    <input 
                      type="tel" 
                      className={styles.inputField} 
                      placeholder="+234" 
                      required 
                      value={addressFormData.phone}
                      onChange={(e) => setAddressFormData({...addressFormData, phone: e.target.value})}
                    />
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
                <button type="button" className={styles.cancelBtn} onClick={handleCloseAddressModal}>Cancel</button>
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