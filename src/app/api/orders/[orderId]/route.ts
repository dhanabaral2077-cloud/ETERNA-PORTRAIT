// src/app/api/orders/[orderId]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(
    req: Request,
    { params }: { params: { orderId: string } }
) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Supabase environment variables are missing.');
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    try {
        const { orderId } = params;

        // Fetch order with customer details
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select(`
        id,
        created_at,
        customer_id,
        customers (
          email,
          name,
          country
        )
      `)
            .eq('id', orderId)
            .single();

        if (orderError || !order) {
            console.error('Error fetching order:', orderError);
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Access customer data (Supabase returns joined data as an object, not array)
        const customer = order.customers as any;

        if (!customer || !customer.email || !customer.country) {
            console.error('Customer data incomplete');
            return NextResponse.json({ error: 'Customer data incomplete' }, { status: 500 });
        }

        // Calculate estimated delivery date (14 days from order creation)
        const orderDate = new Date(order.created_at);
        const estimatedDeliveryDate = new Date(orderDate);
        estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 14);

        // Format date as YYYY-MM-DD
        const formattedDeliveryDate = estimatedDeliveryDate.toISOString().split('T')[0];

        return NextResponse.json({
            orderId: order.id,
            email: customer.email,
            deliveryCountry: customer.country,
            estimatedDeliveryDate: formattedDeliveryDate,
        });

    } catch (err: any) {
        console.error('Failed to fetch order details:', err);
        return NextResponse.json({ error: err.message || 'An unknown error occurred' }, { status: 500 });
    }
}
