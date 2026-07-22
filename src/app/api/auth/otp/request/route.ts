import { NextResponse } from 'next/server';
import { sql } from '@/lib/db/client';
import { sendOTPEmail } from '@/lib/email';

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
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // 4. Save OTP to temporary vault table
    await sql`
      INSERT INTO verification_codes (email, code, expires_at)
      VALUES (${email}, ${otpCode}, ${expiresAt})
    `;

    // 5. Dispatch Email
    await sendOTPEmail(email, otpCode);

    return NextResponse.json({ success: true, message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('OTP Request Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}