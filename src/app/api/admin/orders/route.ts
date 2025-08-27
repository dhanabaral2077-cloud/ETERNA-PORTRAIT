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
          email,
          address_line1,
          address_line2,
          city,
          state_province_region,
          postal_code,
          country
        )
      `, { count: 'exact' });

    if (search) {
      query = query.or(`package.ilike.%${search}%,customers.name.ilike.%${search}%,customers.email.ilike.%${search}%`);
    }

    const { data: orders, error, count } = await query
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching orders:', error.message);
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

    const transformedOrders = orders.map(order => ({
      ...order,
      customer_name: (order.customers as any)?.name || 'N/A',
      customer_email: (order.customers as any)?.email || 'N/A',
      customer_address: formatAddress(order.customers)
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
