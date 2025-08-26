
// src/app/api/orders/create/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// IMPORTANT: Use the Service Role Key for admin operations
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; 
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      petName,
      style,
      pkg, // package is a reserved word
      price,
      notes,
      photoUrls,
      storageFolder, // Get the storage folder path
      paypalOrderId,
    } = body;

    // --- 1. Find or Create Customer ---
    let { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('email', email)
      .single();

    if (customerError && customerError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error finding customer:', customerError.message);
      throw customerError;
    }

    if (!customer) {
      const { data: newCustomer, error: newCustomerError } = await supabase
        .from('customers')
        .insert({ email, name })
        .select('id')
        .single();
      
      if (newCustomerError) {
        console.error('Error creating customer:', newCustomerError.message);
        throw newCustomerError;
      }
      customer = newCustomer;
    }

    // --- 2. Create Order ---
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customer.id,
        pet_name: petName,
        style,
        package: pkg.name,
        price,
        photo_urls: photoUrls,
        storage_folder: storageFolder, // Save storage folder
        notes,
        status: 'Paid', // Assuming this is called after payment
        paypal_order_id: paypalOrderId, // Save PayPal Order ID
      })
      .select('id')
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError.message);
      throw orderError;
    }
      
    // --- 3. Create Order Event (Optional but good practice) ---
     await supabase.from('order_events').insert({
        order_id: order.id,
        type: 'payment_succeeded',
        meta: { source: 'paypal', paypal_order_id: paypalOrderId },
    });


    return NextResponse.json({ success: true, orderId: order.id });

  } catch (err: any) {
    console.error('Order creation failed:', err);
    return NextResponse.json({ error: err.message || 'An unknown error occurred' }, { status: 500 });
  }
}
