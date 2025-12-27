
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PRODUCT_PRICES } from '@/lib/pricing';

export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const results = [];

    try {
        const products = Object.entries(PRODUCT_PRICES).map(([key, product]) => ({
            id: key,
            name: product.name,
            base_price: product.basePrice,
            plan: product.plan,
            image: (product as any).image,
            gallery: (product as any).gallery || [],
            is_active: true,
            updated_at: new Date().toISOString()
        }));

        for (const p of products) {
            const { error } = await supabase
                .from('products')
                .upsert(p)
                .select();

            if (error) {
                console.error(`Error processing ${p.id}:`, error.message);
                results.push({ id: p.id, status: 'error', error: error.message });
            } else {
                results.push({ id: p.id, status: 'success' });
            }
        }

        return NextResponse.json({ message: 'Seeding completed', results });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
