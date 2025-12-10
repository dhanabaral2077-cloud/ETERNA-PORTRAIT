
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendOrderConfirmationEmail, sendShippingUpdateEmail } from '@/lib/email';

export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { orderId, status, trackingNumber, carrier } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Update Order Status in Supabase
    const { data: order, error } = await supabase
      .from('orders')
      .update({
        status: status,
        // store tracking info if provided (you might need to add these columns to your db schema if you want to persist them)
        // For now, we'll assume they might be stored in a meta field or just used for the email
      })
      .eq('id', orderId)
      .select(`
                *,
                customers (
                    name,
                    email
                )
            `)
      .single();

    if (error) {
      console.error('Error updating order:', error);
      throw error;
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const customerEmail = (order.customers as any)?.email;
    const customerName = (order.customers as any)?.name || 'Valued Customer';

    // 2. Trigger Emails based on Status
    if (status === 'Shipped' && trackingNumber && customerEmail) {
      await sendShippingUpdateEmail({
        to: customerEmail as string,
        customerName: customerName as string,
        orderId: order.id as string,
        productName: (order.package || 'Custom Portrait') as string,
        trackingNumber: trackingNumber as string,
        carrier: (carrier || 'Standard Shipping') as string
      });
    }
    // Add more status checks here (e.g., "In Progress")

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    console.error('Update Status Error:', err);
    return NextResponse.json({ error: err.message || 'An unknown error occurred' }, { status: 500 });
  }
}
