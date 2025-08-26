// src/app/api/admin/orders/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const { password, search } = await req.json();

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let query = supabase
      .from('orders')
      .select(`
        id, 
        created_at, 
        package, 
        price, 
        status, 
        photo_urls,
        notes,
        customers (
          name,
          email
        )
      `, { count: 'exact' });

    if (search) {
      // The 'or' filter requires the referenced column to be unique for a join.
      // Since customer could be non-unique across orders, we do a textSearch on multiple columns.
      // For more complex search, a dedicated search function (e.g., pg_trgm) would be better.
      query = query.or(`package.ilike.%${search}%,customers.name.ilike.%${search}%,customers.email.ilike.%${search}%`);
    }

    const { data: orders, error, count } = await query
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching orders:', error.message);
      throw error;
    }

    const transformedOrders = orders.map(order => ({
      ...order,
      customer_name: (order.customers as any)?.name || 'N/A',
      customer_email: (order.customers as any)?.email || 'N/A',
    }));

    // Calculate stats
    const totalRevenue = orders.reduce((acc, order) => acc + order.price, 0);
    const totalOrders = count || 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return NextResponse.json({ 
        orders: transformedOrders,
        stats: {
            totalRevenue,
            totalOrders,
            averageOrderValue
        }
    });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: err.message || 'An unknown error occurred' }, { status: 500 });
  }
}
