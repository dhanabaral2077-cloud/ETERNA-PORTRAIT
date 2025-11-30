
// src/app/api/admin/orders/delete/route.ts
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
    const { password, orderId } = await req.json();

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // First, fetch order details to get the storage_folder
    const { data: orderData, error: fetchError } = await supabase
      .from('orders')
      .select('storage_folder')
      .eq('id', orderId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows found, which is ok if it's already deleted.
      console.error('Supabase error fetching order for deletion:', fetchError.message);
      throw fetchError;
    }

    // If a storage folder exists, delete associated files from Supabase Storage
    if (orderData && orderData.storage_folder) {
      const { data: files, error: listError } = await supabase.storage.from('orders').list(orderData.storage_folder);

      if (listError) {
        console.error(`Could not list files in ${orderData.storage_folder}:`, listError.message);
        // Don't throw, still try to delete the DB record
      } else if (files && files.length > 0) {
        const filePaths = files.map((file: any) => `${orderData.storage_folder}/${file.name}`);
        const { error: removeError } = await supabase.storage.from('orders').remove(filePaths);
        if (removeError) {
          console.error(`Could not remove files from ${orderData.storage_folder}:`, removeError.message);
          // Don't throw, proceed to DB deletion
        }
      }
    }

    // Explicitly delete related order_events first to prevent foreign key violation.
    const { error: eventDeleteError } = await supabase
      .from('order_events')
      .delete()
      .eq('order_id', orderId);

    if (eventDeleteError) {
      console.error('Supabase order_events delete error:', eventDeleteError.message);
      throw eventDeleteError;
    }

    // Now, delete the order from the database.
    const { error: orderDeleteError } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (orderDeleteError) {
      console.error('Supabase order delete error:', orderDeleteError.message);
      throw orderDeleteError;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: err.message || 'An unknown error occurred' }, { status: 500 });
  }
}
