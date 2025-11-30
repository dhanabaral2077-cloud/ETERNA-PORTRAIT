// src/app/api/admin/orders/update-status/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);


  try {
    const { password, orderId, status } = await req.json();

    // Basic password protection. Use a proper auth system for production.
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Order ID and status are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status: status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Supabase status update error:', error.message);
      throw error;
    }

    return NextResponse.json({ success: true, updatedOrder: data });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: err.message || 'An unknown error occurred' }, { status: 500 });
  }
}
