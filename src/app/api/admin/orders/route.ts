// src/app/api/admin/orders/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    // WARNING: Basic password protection. For production, use a proper auth system.
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('id, created_at, customer_name, customer_email, package, price, status, photo_urls')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching orders:', error.message);
      throw error;
    }

    return NextResponse.json({ orders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'An unknown error occurred' }, { status: 500 });
  }
}
