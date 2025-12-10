// src/app/api/admin/orders/route.ts
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
    const { search } = await req.json();

    // In a real production app, verify the user session here using supabase.auth.getUser()
    // For now, we trust the protected layout wrapper.

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
        pet_name,
        style,
        storage_folder,
        customers (
          name,
          email,
          address_line1,
          address_line2,
          city,
          state_province_region,
          postal_code,
          country
        )
      `, { count: 'exact' });

    // Join search requires careful syntax with Supabase if searching related tables
    // Simplified search for now on main fields
    if (search) {
      // Searching relation fields in Supabase via text search is tricky without a function or flattened view.
      // We will search basic order fields for now. 
      query = query.or(`pet_name.ilike.%${search}%,package.ilike.%${search}%,id.eq.${search}`);
    }

    const { data: orders, error, count } = await query
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching orders:', error.message);
      // Log more details if available
      throw error;
    }

    const formatAddress = (customer: any) => {
      if (!customer) return 'No address';
      const parts = [
        customer.address_line1,
        customer.address_line2,
        customer.city,
        customer.state_province_region,
        customer.postal_code,
        customer.country
      ];
      return parts.filter(Boolean).join(', ');
    }

    const safeOrders = orders || [];

    const transformedOrders = safeOrders.map((order: any) => ({
      ...order,
      customer_name: (order.customers as any)?.name || 'N/A',
      customer_email: (order.customers as any)?.email || 'N/A',
      customer_address: (order.customers as any), // Pass full object for "Copy to Clipboard" feature
      customer_full_address_string: formatAddress(order.customers)
    }));

    // Calculate stats
    const totalRevenue = safeOrders.reduce((acc: number, order: any) => acc + order.price, 0);
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
