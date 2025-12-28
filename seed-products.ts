import { createClient } from '@supabase/supabase-js';
import { PRODUCT_PRICES } from './src/lib/pricing';
import dotenv from 'dotenv';
import path from 'path';

// Load .env and .env.local
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

// Debug
console.log('Searching for credentials in:', __dirname);
console.log('NEXT_PUBLIC_SUPABASE_URL found:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY found:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase credentials. Please check .env or .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedProducts() {
    console.log('Seeding products...');

    const products = Object.entries(PRODUCT_PRICES).map(([key, product]) => {
        // Calculate default automated pricing limits for the base size (12x16 for most)
        // Note: In a real scenario, you'd want rows for each variant, but Supabase schema seems to be product-level.
        // We'll use the base price calculation for the main record.
        const basePrice = product.basePrice;

        // Default Logic: COGS = 40%, Min = 85%
        const cost_of_goods_sold = Number((basePrice * 0.40).toFixed(2));
        const auto_pricing_min_price = Number((basePrice * 0.85).toFixed(2));

        return {
            id: key,
            name: product.name,
            base_price: basePrice,
            plan: product.plan,
            image: (product as any).image,
            gallery: (product as any).gallery || [],
            is_active: true,
            cost_of_goods_sold,
            auto_pricing_min_price,
            updated_at: new Date().toISOString()
        };
    });

    for (const p of products) {
        const { error } = await supabase
            .from('products')
            .upsert(p)
            .select();

        if (error) {
            console.error(`Error processing ${p.id}:`, error.message);
        } else {
            console.log(`Upserted: ${p.id}`);
        }
    }

    console.log('Done.');
}

seedProducts();
