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
      .select(`
        id, 
        created_at, 
        package, 
        price, 
        status, 
        photo_urls,
        paypal_order_id,
        customers (
          name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching orders:', error.message);
      throw error;
    }

    // Transform the data to match the expected flat structure for the admin page
    const transformedOrders = orders.map(order => ({
      ...order,
      customer_name: (order.customers as any)?.name || 'N/A',
      customer_email: (order.customers as any)?.email || 'N/A',
    }));


    return NextResponse.json({ orders: transformedOrders });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: err.message || 'An unknown error occurred' }, { status: 500 });
  }
}
