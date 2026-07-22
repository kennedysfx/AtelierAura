export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '@/lib/db/client';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_for_dev_only_change_this'
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=MissingAuthCode', request.url));
  }

  try {
    let email = '';
    let name = '';

    if (provider === 'google') {
      // 1. Exchange code for Google tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID || '',
          client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
          redirect_uri: `${url.origin}/api/auth/callback/google`,
          grant_type: 'authorization_code',
        }),
      });

      const tokens = await tokenResponse.json();
      if (!tokenResponse.ok) throw new Error(tokens.error_description || 'Google Token Exchange Failed');

      // 2. Fetch user profile from Google
      const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      
      const profile = await profileResponse.json();
      email = profile.email;
      name = profile.name;

    } else if (provider === 'apple') {
      // Note: Apple token exchange requires a client_secret signed with your Apple .p8 private key.
      // Once you generate your Apple Developer credentials, you can plug your token exchange fetch request here.
      return NextResponse.redirect(new URL('/login?error=AppleNotFullyConfigured', request.url));
    } else {
      return NextResponse.redirect(new URL('/login?error=UnsupportedProvider', request.url));
    }

    if (!email) throw new Error('Could not retrieve email from provider.');

    // 3. Database Sync Layer (Neon)
    let users = await sql`SELECT id, email, name FROM users WHERE email = ${email} LIMIT 1`;
    let user = users[0];

    if (!user) {
      const newUsers = await sql`
        INSERT INTO users (email, name)
        VALUES (${email}, ${name || null})
        RETURNING id, email, name
      `;
      user = newUsers[0];
    }

    // 4. Issue secure 7-day JWT session cookie
    const token = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set('auth_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    // 🌟 Redirect updated to point directly to the account page layout hierarchy
    return NextResponse.redirect(new URL('/account', request.url));

  } catch (error) {
    console.error(`OAuth Callback Error (${provider}):`, error);
    return NextResponse.redirect(new URL('/login?error=AuthenticationFailed', request.url));
  }
}