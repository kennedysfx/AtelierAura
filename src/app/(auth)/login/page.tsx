'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './auth.module.css';

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get('mode');

  // Authentication states
  const [isRegister, setIsRegister] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  // Form input states
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  
  // OTP split-box states
  const [otpArray, setOtpArray] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer states
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  // System states
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleAuthModeToggle = () => {
    setIsRegister(!isRegister);
    setStep(1);
    setOtpArray(['', '', '', '', '', '']);
    setMessage(null);
  };

  useEffect(() => {
    if (mode === 'register') {
      setIsRegister(true);
    } else if (mode === 'login') {
      setIsRegister(false);
    }
    setStep(1); 
  }, [mode]);

  // Handle the countdown timer when on Step 2
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // --- OTP INPUT HANDLING ---
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otpArray];
    // Take only the last character in case of rapid typing
    newOtp[index] = value.substring(value.length - 1);
    setOtpArray(newOtp);

    // Auto-advance focus
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste) {
      const newOtp = [...otpArray];
      for (let i = 0; i < paste.length; i++) {
        newOtp[i] = paste[i];
      }
      setOtpArray(newOtp);
      // Focus the next empty box or the last box
      const nextIndex = Math.min(paste.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  // --- API ROUTE HANDLERS ---
  const handleRequestOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, action: isRegister ? 'register' : 'login', ...(isRegister && { name }) }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong.');

      setStep(2);
      setCountdown(60); // Reset timer
      setCanResend(false);
      setOtpArray(['', '', '', '', '', '']); // Clear boxes
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to dispatch verification code.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalOtp = otpArray.join('');
    if (finalOtp.length < 6) {
      setMessage({ type: 'error', text: 'Please enter the complete 6-digit code.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: finalOtp, action: isRegister ? 'register' : 'login', name }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Invalid or expired verification code.');

      // 🌟 REDIRECT TO LUXURY DASHBOARD VAULT ON SUCCESS
      window.location.href = '/account';
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'apple') => {
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className={styles.pageWrapper}>
      <button 
        onClick={() => step === 2 ? setStep(1) : router.back()} 
        className={styles.closeButton} 
        aria-label={step === 2 ? "Go back" : "Close authentication screen"}
      >
        {step === 2 ? (
           <span style={{ fontSize: '0.9rem', fontFamily: 'Inter', fontWeight: 400 }}>Back</span>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        )}
      </button>

      <div className={styles.authCard}>
        <header className={styles.authHeader}>
          <h1 className={styles.authTitle}>
            {step === 1 ? (isRegister ? 'Create an Account' : 'Welcome back!') : 'OTP Verification'}
          </h1>
          <p className={styles.authSubtitle}>
            {step === 1 
              ? (isRegister ? 'Register to join the atelier.' : 'Log in to access your account.') 
              : <>We have sent a verification code to<br/><strong style={{ color: '#111111', fontWeight: 500 }}>{email}</strong></>
            }
          </p>
        </header>

        {message && (
          <div className={`${styles.messageBox} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        {/* STEP 1: INITIAL COMPILATION */}
        {step === 1 && (
          <form onSubmit={handleRequestOTP} className={styles.authForm}>
            {isRegister && (
              <div className={styles.formGroup}>
                <label className={styles.inputLabel} htmlFor="name">Full Name *</label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  className={styles.inputField}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.inputLabel} htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                required
                placeholder="Enter your email address"
                className={styles.inputField}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button type="submit" disabled={isLoading} className={styles.submitButton}>
              {isLoading ? 'DISPATCHING...' : 'GET OTP'}
            </button>
          </form>
        )}

        {/* STEP 2: VERIFICATION LOCKPAD */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className={styles.authForm}>
            <div className={styles.otpContainer}>
              {otpArray.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={handleOtpPaste}
                  className={styles.otpBox}
                />
              ))}
            </div>

            <p className={styles.timerText}>
              {canResend ? (
                <span>Didn't receive a code? <button type="button" onClick={() => handleRequestOTP()} className={styles.resendActionBtn}>Resend Code</button></span>
              ) : (
                `You can resend in ${countdown}s`
              )}
            </p>

            <button type="submit" disabled={isLoading || otpArray.join('').length < 6} className={styles.verifyGoldButton}>
              {isLoading ? 'VERIFYING...' : 'Verify'}
            </button>

            <div className={styles.securedByContainer}>
              <span className={styles.securedText}>Secured by <strong>ATELIER AURA</strong></span>
            </div>
          </form>
        )}

        {/* OAUTH & FOOTER (Only Step 1) */}
        {step === 1 && (
          <>
            <div className={styles.divider}>
              <span className={styles.dividerLine}></span>
              <span className={styles.dividerText}>or continue with</span>
              <span className={styles.dividerLine}></span>
            </div>

            <div className={styles.socialRow}>
              <button type="button" className={styles.socialButton} onClick={() => handleSocialLogin('google')} aria-label="Continue with Google">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </button>
            </div>

            <footer className={styles.authFooter}>
              <p className={styles.toggleText}>
                {isRegister ? 'Already have an account?' : 'New to the House?'}
                <button type="button" onClick={handleAuthModeToggle} className={styles.toggleLink}>
                  {isRegister ? 'Log In' : 'Create Account'}
                </button>
              </p>
              <p className={styles.legalNotice}>
                By continuing, you agree to our <Link href="/terms" className={styles.legalLink}>Terms of Service</Link>.
              </p>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{ color: '#fff', textAlign: 'center', padding: '2rem' }}>Loading authentication...</div>}>
      <AuthContent />
    </Suspense>
  );
}