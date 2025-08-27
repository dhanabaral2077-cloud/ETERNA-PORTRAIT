
// src/app/api/admin/orders/delete/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const { password, orderId } = await req.json();

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!orderId) {
        return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }
    
    // First, delete associated files from Supabase Storage if a storage_folder is present
    const { data: orderData, error: fetchError } = await supabase
        .from('orders')
        .select('storage_folder')
        .eq('id', orderId)
        .single();
    
    if (fetchError) {
        console.error('Supabase error fetching order for deletion:', fetchError.message);
        // Don't throw, still try to delete the DB record
    }

    if (orderData && orderData.storage_folder) {
        const { data: files, error: listError } = await supabase.storage.from('orders').list(orderData.storage_folder);
        if (listError) {
            console.error(`Could not list files in ${orderData.storage_folder}:`, listError.message);
        } else if (files && files.length > 0) {
            const filePaths = files.map(file => `${orderData.storage_folder}/${file.name}`);
            const { error: removeError } = await supabase.storage.from('orders').remove(filePaths);
            if(removeError) {
                 console.error(`Could not remove files from ${orderData.storage_folder}:`, removeError.message);
            }
        }
    }


    // Now, delete the order from the database.
    // ON DELETE CASCADE will handle related order_events.
    const { error: deleteError } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (deleteError) {
      console.error('Supabase order delete error:', deleteError.message);
      throw deleteError;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: err.message || 'An unknown error occurred' }, { status: 500 });
  }
}
