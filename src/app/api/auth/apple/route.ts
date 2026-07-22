import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const clientId = process.env.APPLE_CLIENT_ID;

  if (!clientId) {
    return NextResponse.redirect(new URL('/login?error=AppleClientIdMissing', request.url));
  }

  const rootUrl = 'https://appleid.apple.com/auth/authorize';
  const options = {
    client_id: clientId,
    redirect_uri: `${origin}/api/auth/callback/apple`,
    response_type: 'code',
    response_mode: 'query',
    scope: 'name email',
  };

  const qs = new URLSearchParams(options);
  return NextResponse.redirect(`${rootUrl}?${qs.toString()}`);
}