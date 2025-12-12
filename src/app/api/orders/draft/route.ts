import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
    try {
        const { email, session_id, form_data } = await request.json();

        // Used primarily for abandoned carts.
        // We use upsert based on email if present, or just insert new row if anonymous?
        // For simplicity, we'll try to match by email if it exists, otherwise just log it.

        // This is a simplified "Upsert" logic. In reality, you'd want a more robust session tracking.
        let query = supabase.from('order_drafts');

        // If we have an email, try to find a recent draft for this email
        // Ideally we would upsert on a unique constraint, but drafts can be many.
        // We will just insert for now to act as a log of "attempts".
        // A cleaner way is to have a 'cart_id' generated on the client.

        const { error } = await query.insert({
            email,
            session_id,
            form_data,
            updated_at: new Date().toISOString()
        });

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Draft Error:', error);
        return NextResponse.json({ error: 'Failed to save draft' }, { status: 500 });
    }
}
