
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: true }); // Or any default sort

        if (error) {
            console.error('Error fetching products:', error);
            return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
        }

        // Return as map for easy lookup, similar to PRODUCT_PRICES
        const productMap = products.reduce((acc: any, product: any) => {
            acc[product.id] = {
                basePrice: product.base_price,
                name: product.name,
                plan: product.plan,
                image: product.image,
                gallery: product.gallery,
                // Add other fields if needed
            };
            return acc;
        }, {});

        return NextResponse.json(productMap);

    } catch (err: any) {
        console.error('API Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
