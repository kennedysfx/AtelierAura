import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '@/lib/db/client';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_for_dev_only_change_this'
);

export async function POST(request: Request) {
  try {
    const { email, code, name, action } = await request.json(); // action: 'login' | 'register'

    if (!email || !code || !action) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // 1. Fetch the most recent, non-expired OTP code for this email
    const validCodes = await sql`
      SELECT * FROM verification_codes 
      WHERE email = ${email} 
        AND code = ${code} 
        AND expires_at > NOW()
      ORDER BY created_at DESC 
      LIMIT 1
    `;

    if (validCodes.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code.' },
        { status: 400 }
      );
    }

    let user;

    // 2. Execute final database mutations based on the user action
    if (action === 'register') {
      // Double check availability to prevent race conditions
      const existingUsers = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
      if (existingUsers.length > 0) {
        return NextResponse.json({ error: 'Account already exists.' }, { status: 400 });
      }

      // Create the permanent customer record in Neon
      const newUsers = await sql`
        INSERT INTO users (email, name) 
        VALUES (${email}, ${name || null}) 
        RETURNING id, email, name
      `;
      user = newUsers[0];
    } else {
      // Fetch the existing user for login payload
      const existingUsers = await sql`SELECT id, email, name FROM users WHERE email = ${email} LIMIT 1`;
      user = existingUsers[0];
    }

    // 3. Security Burn: Delete used OTP code so it can never be recycled
    await sql`DELETE FROM verification_codes WHERE email = ${email}`;

    // 4. Issue Session Token via JWT
    const token = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d') // Session lasts 7 days
      .sign(JWT_SECRET);

    // 5. Inject secure, HTTP-only session cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error('Verification Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}