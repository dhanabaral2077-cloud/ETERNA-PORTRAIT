import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
        }

        // Insert into Supabase
        const { error } = await supabase
            .from('newsletter_subscribers')
            .upsert({ email }, { onConflict: 'email' });

        if (error) throw error;

        // Send Welcome Email (Fire and forget, don't block response)
        sendWelcomeEmail(email, 'WELCOME10').catch(e => console.error("Email send failed", e));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Newsletter Error:', error);
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }
}
