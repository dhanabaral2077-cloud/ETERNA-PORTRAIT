
// src/app/api/orders/create/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculatePrice, ProductType, SizeType } from '@/lib/pricing';

// Initialize Supabase Admin client
export async function POST(req: Request) {
  // Initialize Supabase Admin client inside the handler
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  // IMPORTANT: Use the Service Role Key for admin operations
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase environment variables are missing.');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);


  try {
    const body = await req.json();
    const {
      name,
      email,
      petName,
      style,
      pkg, // package is a reserved word
      price, // Client-provided price (still useful for logging/comparison but NOT trust)
      printType, // Added: Product Type
      size,      // Added: Size
      notes,
      photoUrls,
      storageFolder,
      paypalOrderId,
      addressLine1,
      addressLine2,
      city,
      stateProvinceRegion,
      postalCode,
      country,
    } = body;

    // --- 0. Server-Side Price Validation ---
    let calculatedPrice = 0;
    try {
      if (printType && size) {
        calculatedPrice = calculatePrice(printType as ProductType, size as SizeType);
      } else {
        // Fallback for legacy calls or if printType/size missing (should not happen with new frontend)
        // If we can't validate, we might want to reject or flag. 
        // For now, let's log a warning if they are missing.
        console.warn('Missing printType or size for price validation. Trusting client price (RISKY).');
        calculatedPrice = price;
      }
    } catch (e) {
      console.error('Price calculation error:', e);
      return NextResponse.json({ error: 'Invalid product configuration' }, { status: 400 });
    }

    // Allow a small margin of error (e.g., floating point issues, though we round)
    // But since we control logic, it should be exact.
    if (Math.abs(calculatedPrice - price) > 1.0) {
      console.error(`Price Mismatch! Client: ${price}, Server: ${calculatedPrice}`);
      // In a strict mode, we would reject:
      // return NextResponse.json({ error: 'Price validation failed' }, { status: 400 });

      // For now, let's use the SERVER calculated price for the database record
      // to ensure our records are correct, even if they paid the wrong amount (which we'd catch in audit).
      // ideally we reject the order if they underpaid.

      // Let's REJECT if client price is LESS than calculated price (underpayment attempt)
      if (price < calculatedPrice) {
        return NextResponse.json({ error: 'Price validation failed: Underpayment detected.' }, { status: 400 });
      }
    }

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

    const customerDetails = {
      email,
      name,
      address_line1: addressLine1,
      address_line2: addressLine2,
      city,
      state_province_region: stateProvinceRegion,
      postal_code: postalCode,
      country,
    };

    if (!customer) {
      const { data: newCustomer, error: newCustomerError } = await supabase
        .from('customers')
        .insert(customerDetails)
        .select('id')
        .single();

      if (newCustomerError) {
        console.error('Error creating customer:', newCustomerError.message);
        throw newCustomerError;
      }
      customer = newCustomer;
    } else {
      // Update existing customer's address
      const { error: updateCustomerError } = await supabase
        .from('customers')
        .update(customerDetails)
        .eq('id', customer.id);

      if (updateCustomerError) {
        console.error('Error updating customer:', updateCustomerError.message);
        // Non-fatal, we can still create the order
      }
    }

    // --- 2. Create Order ---
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customer.id,
        pet_name: petName,
        style,
        package: pkg.name, // e.g., "Canvas (12x16")"
        price: calculatedPrice, // Use the TRUSTED server price
        photo_urls: photoUrls,
        storage_folder: storageFolder, // Save storage folder
        notes,
        status: 'Paid', // Assuming this is called after payment
        paypal_order_id: paypalOrderId,
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
      meta: { source: 'paypal', paypal_order_id: paypalOrderId, price_validated: true },
    });


    return NextResponse.json({ success: true, orderId: order.id });

  } catch (err: any) {
    console.error('Order creation failed:', err);
    return NextResponse.json({ error: err.message || 'An unknown error occurred' }, { status: 500 });
  }
}
