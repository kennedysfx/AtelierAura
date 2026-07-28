import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { cookies } from 'next/headers';

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, firstName, lastName } = body;

    await sql`
      UPDATE users 
      SET first_name = ${firstName}, last_name = ${lastName}
      WHERE email = ${email}
    `;

    return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required for deletion' },
        { status: 400 }
      );
    }

    // 🌟 Delete addresses first (they reference the user's email)
    await sql`DELETE FROM addresses WHERE user_email = ${email}`;

    // Then delete the user record itself
    await sql`DELETE FROM users WHERE email = ${email}`;

    // Clear the session cookie now that this account no longer exists
    const cookieStore = await cookies();
    cookieStore.set('auth_session', '', { maxAge: 0, path: '/' });

    return NextResponse.json(
      { message: 'Account deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database error in DELETE /api/user/profile:', error);
    return NextResponse.json(
      { error: 'Internal server error failed to delete account.' },
      { status: 500 }
    );
  }
}