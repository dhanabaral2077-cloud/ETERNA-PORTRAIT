
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env and .env.local
const envPath = path.resolve(process.cwd(), '.env');
const envLocalPath = path.resolve(process.cwd(), '.env.local');

console.log(`Current working directory: ${process.cwd()}`);
console.log(`Loading .env from: ${envPath}`);

dotenv.config({ path: envPath });
dotenv.config({ path: envLocalPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('NEXT_PUBLIC_SUPABASE_URL found:', !!supabaseUrl);
console.log('SUPABASE_SERVICE_ROLE_KEY found:', !!supabaseKey);

const validKey = supabaseKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !validKey) {
    console.error('Error: Missing Supabase credentials (URL or Key). Please check .env');
    process.exit(1);
}

if (!supabaseKey) {
    console.warn('WARNING: Using Anon Key. Delete/Update operations might fail if RLS is enabled.');
}

const supabase = createClient(supabaseUrl, validKey);

async function fixProducts() {
    console.log('Starting product fix...');

    // 1. Fetch all products
    const { data: products, error } = await supabase
        .from('products')
        .select('*');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    console.log(`Fetched ${products?.length} products.`);

    // 2. Identify duplicates for "Framed Canvas"
    const framedCanvasProducts = products?.filter(p => p.name === 'Framed Canvas');
    console.log(`Found ${framedCanvasProducts?.length} "Framed Canvas" products.`);

    if (framedCanvasProducts && framedCanvasProducts.length > 1) {
        // Sort by created_at to keep the oldest (or newest, doesn't strictly matter, but let's keep one)
        // Let's keep the one that seems most "correct" or simply the first one found if they are identical.
        // Usually, we keep the older one to preserve any existing relations, or newer if it's a replacement.
        // Let's keep the first one in the list.
        const productToKeep = framedCanvasProducts[0];
        const productsToDelete = framedCanvasProducts.slice(1);

        console.log(`Keeping product ID: ${productToKeep.id}`);

        for (const p of productsToDelete) {
            console.log(`Deleting duplicate product ID: ${p.id}`);
            const { error: deleteError } = await supabase
                .from('products')
                .delete()
                .eq('id', p.id);

            if (deleteError) {
                console.error(`Error deleting product ${p.id}:`, deleteError);
            } else {
                console.log(`Deleted product ${p.id}`);
            }
        }
    } else {
        console.log('No duplicate "Framed Canvas" products found.');
    }

    // 3. Update image paths
    // Map of Product Name -> New Image Path
    const imageUpdates: Record<string, string> = {
        'Framed Canvas': '/products/Premium Canvas/Framed Canvas/Gemini_Generated_Image_4yh4vm4yh4vm4yh4.png',
        'Standard Canvas': '/products/Premium Canvas/Canvas/Gemini_Generated_Image_4msi914msi914msi.png', // Assuming "Standard Canvas" is the name for the canvas one
        'Aluminum Print': '/products/Luxury Print/Aluminum Print/Gemini_Generated_Image_tsomwttsomwttsom.png',
        // Add others if needed based on the folders found

        // "fine art poster" (from folder listing) - checking if a product exists for this
        // "Foam Print"
        // "Metal Framed"
        // "wooden Framed"
        // "Acrylic Print"
        // "Wood Print"
    };

    // We can also double check "Standard Canvas" name from the fetched products
    // Let's just iterate over all products and update if we have a mapping

    // Check for "Standard Canvas" name in fetched products to be sure
    const standardCanvas = products?.find(p => p.name === 'Standard Canvas' || p.name === 'Canvas');
    if (standardCanvas) {
        console.log(`Found Standard Canvas product with name: "${standardCanvas.name}"`);
        // If name matches key in imageUpdates, it will be updated below
    }

    for (const [name, imagePath] of Object.entries(imageUpdates)) {
        const productToUpdate = await supabase
            .from('products')
            .select('*')
            .eq('name', name)
            .single(); // We expect uniqueness now (after deletion step for Framed Canvas)

        // Note: .single() might fail if we didn't fix duplicates yet or if not found.
        // But since we fixed Framed Canvas above, it should be fine.
        // For others, if they don't exist, we skip.

        // Actually, let's use the fetched list if possible, but fetching fresh is safer after deletion.
        // However, `data` from `.single()` gives data or null/error.

        if (productToUpdate.data) {
            const { error: updateError } = await supabase
                .from('products')
                .update({ image: imagePath })
                .eq('id', productToUpdate.data.id);

            if (updateError) {
                console.error(`Error updating image for ${name}:`, updateError);
            } else {
                console.log(`Updated image for ${name} to ${imagePath}`);
            }
        } else {
            console.log(`Product "${name}" not found (or multiple found if we didn't fix them). Skipping update.`);
        }
    }

    console.log('Product fix completed.');
}

fixProducts();
