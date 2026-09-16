import { NextRequest, NextResponse } from 'next/server';
import { getCustomers, saveCustomers } from '@/lib/db';
import { customerProfileSchema } from '@/lib/validations';
import type { CustomerProfile } from '@/types/customer';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawPhone = searchParams.get('phone') || '';
    const cleanPhone = rawPhone.replace(/\D/g, '');

    if (!cleanPhone) {
      return NextResponse.json(
        { success: false, message: 'Phone number required.' },
        { status: 400 }
      );
    }

    const customers = await getCustomers();
    const cust = customers.find((c) => (c.phone || '').replace(/\D/g, '') === cleanPhone);

    if (!cust) {
      return NextResponse.json({ success: true, exists: false, profile: null });
    }

    return NextResponse.json({ success: true, exists: true, profile: cust });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve profile';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = customerProfileSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: validated.error.issues.map((e: { message: string }) => e.message).join(', ')
        },
        { status: 400 }
      );
    }

    const { phone, name, email, addresses } = validated.data;
    const cleanP = phone.replace(/\D/g, '');

    const customers = await getCustomers();
    let cust = customers.find((c) => (c.phone || '').replace(/\D/g, '') === cleanP);

    if (!cust) {
      cust = {
        phone: cleanP,
        name: name || '',
        email: email || '',
        addresses: addresses || []
      };
      customers.push(cust);
    } else {
      if (name !== undefined) cust.name = name;
      if (email !== undefined) cust.email = email;
      if (Array.isArray(addresses)) cust.addresses = addresses;
    }

    await saveCustomers(customers);

    return NextResponse.json({
      success: true,
      message: 'Profile saved successfully.',
      profile: cust
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save profile';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
