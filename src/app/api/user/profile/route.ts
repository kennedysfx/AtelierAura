import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, firstName, lastName } = body;

    // Connect to Neon securely on the server
    const sql = neon(process.env.DATABASE_URL!);

    // Run your SQL query to update the user
    // Replace 'users' with your actual table name
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