
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env 
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase credentials.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
    console.log('Verifying products...');

    const { data: products, error } = await supabase
        .from('products')
        .select('*');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    // Check Framed Canvas
    const framed = products?.filter(p => p.name === 'Framed Canvas');
    console.log(`Framed Canvas Count: ${framed?.length}`);
    if (framed && framed.length === 1) {
        console.log('SUCCESS: Duplicate removed.');
        console.log('Current Image:', framed[0].image);
    } else {
        console.error('FAILURE: Correct count should be 1.');
    }

    // Check others
    const standard = products?.find(p => p.name === 'Standard Canvas' || p.name === 'Canvas');
    console.log('Standard Canvas Image:', standard?.image);

    const aluminum = products?.find(p => p.name === 'Aluminum Print');
    console.log('Aluminum Print Image:', aluminum?.image);
}

verify();
