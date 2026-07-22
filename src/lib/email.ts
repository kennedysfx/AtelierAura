import { Resend } from 'resend';

// For development, use a dummy string or your actual Resend API key from .env.local
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export async function sendOTPEmail(email: string, code: string) {
  // If no API key is set yet, just log to terminal so development isn't blocked
  if (!process.env.RESEND_API_KEY) {
    console.log(`\n--- [DEV EMAIL BYPASS] ---\nTo: ${email}\nOTP Code: ${code}\n--------------------------\n`);
    return { success: true };
  }

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Atelier Aura - Your Verification Code',
      html: `<p>Your luxury access code is: <strong>${code}</strong>. It will expire in 10 minutes.</p>`,
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}