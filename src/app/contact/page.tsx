"use client";

import React, { useState } from "react";
import styles from "./contact.module.css";

export default function ContactPage() {
  // 1. Form state management initialization
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 2. Real-time value tracking and clear error flags as the user modifies entries
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // 3. Custom form data filter matching validation criteria
  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", email: "", message: "" };

    // Name Field Check
    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
      valid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
      valid = false;
    }

    // Email String Structural Verification
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      valid = false;
    }

    // Message Input Bulk Check
    if (!formData.message.trim()) {
      newErrors.message = "Please write a message.";
      valid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // 4. Submission controller
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Data is secure and valid. Ready to handle database writes or third-party mailing API integrations.
      console.log("Validated Form Data:", formData);
      
      setIsSubmitted(true);
      setFormData({ name: "", email: "", message: "" }); // Clean out input strings
      
      // Automatic removal window for success graphics banner after delay
      setTimeout(() => {
        setIsSubmitted(false);
      }, 6000);
    }
  };

  return (
    <main className={styles.pageWrapper}>
      
      {/* =========================================
         LUXURY HERO SECTION (FULL BLEED)
         ========================================= */}
      <section className={styles.heroSection}>
        <div className={styles.heroImageContainer}>
          <img 
            src="/featurepic/contact-l.avif" 
            alt="Atelier Aura Contact Studio Landscape" 
            className={styles.heroImageLandscape} 
          />
          <img 
            src="/featurepic/contact-p.avif" 
            alt="Atelier Aura Contact Studio Portrait" 
            className={styles.heroImagePortrait} 
          />
          <div className={styles.heroOverlay}></div>
        </div>

        <div className={styles.heroContent}>
          <span className={styles.heroSubtitle}>GET IN TOUCH</span>
          <h1 className={styles.heroTitle}>CONTACT US</h1>
          <p className={styles.heroDescription}>
            Whether you are seeking custom fragrance consultations, order inquiries, or bespoke private client services, the Atelier concierge team is dedicated to providing an unparalleled response.
          </p>
        </div>
      </section>

      {/* =========================================
         CONCIERGE & DETAILS SECTION
         ========================================= */}
      <section className={styles.infoSection}>
        <div className={styles.infoContainer}>
          
          {/* Left Column: Brand Statement & Invitation */}
          <div className={styles.textColumn}>
            <h2 className={styles.infoHeading}>Our Concierge Services</h2>
            <p className={styles.infoParagraph}>
              Welcome to the Atelier Aura private concierge. We welcome your unique inquiries, collections feedback, and bespoke requests. Our dedicated client services team is entirely committed to providing a seamless, sophisticated experience tailored intimately to your personal fragrance journey.
            </p>
            <p className={styles.infoParagraph}>
              Should you require assistance selecting a signature unisex blend, managing a private acquisition, or sharing your impressions of our seasonal olfactive rollouts, our specialists are poised to provide immediate, highly personalized guidance.
            </p>
            <p className={styles.infoParagraph}>
              We deeply value our global community's insights. Rest assured that every dialogue initiated with the house is met with the utmost discretion, care, and an absolute commitment to an elegant resolution.
            </p>
          </div>

          {/* Right Column: Minimalist Direct Channels (Pushed down on Desktop via .detailsColumn) */}
          <div className={styles.detailsColumn}>
            <h3 className={styles.detailsHeading}>Direct Channels</h3>
            
            <div className={styles.contactBlock}>
              <span className={styles.contactLabel}>Digital Correspondence</span>
              <a href="mailto:concierge@atelieraura.com" className={styles.contactLink}>concierge@atelieraura.com</a>
            </div>
            
            <div className={styles.contactBlock}>
              <span className={styles.contactLabel}>Availability</span>
              <p className={styles.contactText}>Monday — Friday<br />09:00 to 18:00 WAT</p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================
         SHOWROOM LOCATION & INTERACTIVE FORM
         ========================================= */}
      <section className={styles.interactiveSection}>
        <div className={styles.interactiveContainer}>
          
          {/* Left Column: Native Identity Social Selection Grid Elements */}
          <div className={styles.infoColumnLeft}>
            <p className={styles.formIntroText}>
              For all customer service &amp; general inquiries please contact us below. One of our staff members will be in contact you within 24 hours.
            </p>
            
            <h2 className={styles.formMainHeading}>CONTACT US</h2>

            {/* Premium Social Correspondence Stack */}
            <div className={styles.socialOptionsContainer}>
              
              {/* WhatsApp Option */}
              <a 
                href="https://wa.me/2349086819339" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.socialOptionCard}
              >
                <div className={`${styles.socialIconBox} ${styles.whatsappBox}`}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className={styles.socialSvg}>
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.66.986 3.296 1.48 4.825 1.481 5.273 0 9.56-4.283 9.564-9.554.002-2.553-1.001-4.955-2.822-6.779C16.392 2.478 13.99 1.474 11.432 1.474c-5.235 0-9.497 4.259-9.501 9.53-.001 1.62.438 3.203 1.272 4.586l-.993 3.63 3.733-.979zm11.368-6.18c-.282-.14-1.664-.82-1.923-.914-.258-.095-.446-.14-.633.14-.187.28-.724.912-.888 1.096-.164.186-.328.21-.61.07-2.95-1.474-4.25-2.227-5.87-5.013-.26-.444.26-.412.744-1.375.082-.164.041-.308-.02-.448-.06-.14-.633-1.527-.868-2.09-.228-.551-.46-.476-.633-.485-.164-.008-.352-.01-.54-.01-.187 0-.492.07-.75.35-.258.28-.984.962-.984 2.344 0 1.381 1.008 2.716 1.15 2.902.14.187 1.984 3.029 4.81 4.25 1.734.75 2.454.844 3.334.712.56-.084 1.664-.68 1.9-.1.334-.234.656-.628.75-.722.094-.093.094-.186.046-.326z"/>
                  </svg>
                </div>
                <div className={styles.socialMeta}>
                  <span className={styles.socialTitle}>WhatsApp</span>
                  <span className={styles.socialDescription}>Instant boutique messaging &amp; concierge chat</span>
                </div>
                <div className={styles.socialArrowBox}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.arrowSvg}>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </a>

              {/* Instagram Option */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.socialOptionCard}
              >
                <div className={`${styles.socialIconBox} ${styles.instagramBox}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.socialSvgStroke}>
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
                <div className={styles.socialMeta}>
                  <span className={styles.socialTitle}>Instagram</span>
                  <span className={styles.socialDescription}>Olfactive visual journal &amp; collection updates</span>
                </div>
                <div className={styles.socialArrowBox}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.arrowSvg}>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </a>

              {/* TikTok Option */}
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.socialOptionCard}
              >
                <div className={`${styles.socialIconBox} ${styles.tiktokBox}`}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className={styles.socialSvg}>
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.6 4.17 1.12 1.22 2.69 1.95 4.31 2v3.83c-.08-.01-.15-.01-.23-.01-1.63-.02-3.21-.57-4.52-1.54L17.56 12c0 2.2-.61 4.35-1.78 6.13-1.8 2.65-4.85 4.17-8.06 3.94-3.57-.27-6.6-2.99-7.4-6.52C-.6 11.41 1.34 7.02 5.16 5.43c1.2-.5 2.5-.66 3.79-.47v3.98c-.76-.17-1.57-.07-2.27.28-1.53.79-2.29 2.63-1.76 4.28.51 1.58 2.11 2.64 3.78 2.53 1.7-.1 3.12-1.47 3.32-3.17.04-2.15.02-4.31.02-6.46 0-2.13.01-4.26.01-6.38z"/>
                  </svg>
                </div>
                <div className={styles.socialMeta}>
                  <span className={styles.socialTitle}>TikTok</span>
                  <span className={styles.socialDescription}>Behind the scenes, formulation, &amp; atelier craft</span>
                </div>
                <div className={styles.socialArrowBox}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.arrowSvg}>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </a>

            </div>
          </div>

          {/* Right Column: Dedicated Input Fields Block (Pushed down on Desktop via .formColumnRight) */}
          <div className={styles.formColumnRight}>
            <form className={styles.contactFormWrapper} onSubmit={handleSubmit} noValidate>
              
              {/* Submission Alert Box Banner */}
              {isSubmitted && (
                <div className={styles.successNotification}>
                  Thank you. Your inquiry has been received by the atelier.
                </div>
              )}

              {/* Name Field Layout Group */}
              <div className={styles.formFieldGroup}>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Name" 
                  value={formData.name}
                  onChange={handleChange}
                  className={`${styles.luxuryInput} ${errors.name ? styles.invalidInput : ""}`} 
                />
                {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
              </div>
              
              {/* Email Field Layout Group */}
              <div className={styles.formFieldGroup}>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email" 
                  value={formData.email}
                  onChange={handleChange}
                  className={`${styles.luxuryInput} ${errors.email ? styles.invalidInput : ""}`} 
                />
                {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
              </div>
              
              {/* Message Field Layout Group */}
              <div className={styles.formFieldGroup}>
                <textarea 
                  name="message"
                  placeholder="Message" 
                  rows={6} 
                  value={formData.message}
                  onChange={handleChange}
                  className={`${styles.luxuryTextarea} ${errors.message ? styles.invalidInput : ""}`}
                ></textarea>
                {errors.message && <span className={styles.errorMessage}>{errors.message}</span>}
              </div>

              <button type="submit" className={styles.formSubmitButton}>
                SEND
              </button>
            </form>
          </div>

        </div>
      </section>

    </main>
  );
}