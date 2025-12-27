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
        } else {
            console.log(`Upserted: ${p.id}`);
        }
    }

    console.log('Done.');
}

seedProducts();
