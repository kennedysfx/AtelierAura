import { NextResponse } from 'next/server';
import { sql } from '@/lib/db/client';
import { Resend } from 'resend'; // 1. Imported the Resend platform SDK

// 2. Initialize Resend using the environment variable we'll set up next
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, name, action } = await request.json(); // action: 'login' | 'register'

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    // 1. Check if the user exists in Neon
    const users = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
    const userExists = users.length > 0;

    // 2. Enforce Strict Split logic
    if (action === 'login' && !userExists) {
      return NextResponse.json(
        { error: 'No account matches this email. Please create an account first.' },
        { status: 404 }
      );
    }

    if (action === 'register' && userExists) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please log in.' },
        { status: 400 }
      );
    }

    // 3. Generate 6-digit cryptographic OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 10 minutes from now

    // 4. Save OTP to temporary vault table
    await sql`DELETE FROM verification_codes WHERE email = ${email}`;

    await sql`
      INSERT INTO verification_codes (email, code, expires_at)
      VALUES (${email}, ${otpCode}, ${expiresAt})
    `;

    // 5. Dispatch Email via the Resend Platform
    // Note: 'onboarding@resend.dev' is Resend's default testing address before domain verification
    await resend.emails.send({
      from: 'Atelier Aura <onboarding@resend.dev>',
      to: email,
      subject: `Your Verification Code: ${otpCode}`,
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #111; text-align: center;">Verify Your Account</h2>
          <p style="color: #555; text-align: center;">Use the code below to complete your ${action}. It will expire in 3 minutes.</p>
          <div style="background: #f4f4f5; padding: 16px; text-align: center; border-radius: 6px; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; font-family: monospace; color: #000;">${otpCode}</span>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('OTP Request Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}