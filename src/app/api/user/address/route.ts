import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// 🌟 NEW: GET method to fetch all addresses for a user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Fetch addresses ordered by default first, then newest
    const addresses = await sql`
      SELECT * FROM addresses 
      WHERE user_email = ${email} 
      ORDER BY is_default DESC, created_at DESC
    `;

    return NextResponse.json(addresses, { status: 200 });
  } catch (error) {
    console.error('Database error in GET /api/user/address:', error);
    return NextResponse.json(
      { error: 'Internal server error failed to fetch addresses.' },
      { status: 500 }
    );
  }
}

// Keep your existing POST method completely intact
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      isDefault,
      country,
      firstName,
      lastName,
      streetAddress,
      landmark,
      city,
      state,
      postalCode,
      phone,
    } = body;

    if (!email || !landmark) {
      return NextResponse.json(
        { error: 'User email and landmark are required to save an address.' },
        { status: 400 }
      );
    }

    if (isDefault) {
      await sql`
        UPDATE addresses 
        SET is_default = false 
        WHERE user_email = ${email}
      `;
    }

    await sql`
      INSERT INTO addresses (
        user_email,
        country,
        first_name,
        last_name,
        street_address,
        landmark,
        city,
        state,
        postal_code,
        phone,
        is_default
      ) VALUES (
        ${email},
        ${country},
        ${firstName},
        ${lastName},
        ${streetAddress},
        ${landmark},
        ${city},
        ${state},
        ${postalCode},
        ${phone},
        ${isDefault}
      )
    `;

    return NextResponse.json(
      { message: 'Address saved successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Database error in POST /api/user/address:', error);
    return NextResponse.json(
      { error: 'Internal server error failed to save address.' },
      { status: 500 }
    );
  }
}