import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function main() {
    try {
        // Import client AFTER env vars are loaded
        const { gelatoClient } = await import('./src/lib/gelato/client');

        console.log('Fetching Catalogs...');
        const catalogs = await gelatoClient.getCatalogs();

        // Find "Wall Art" catalog
        // Note: Structure usually has check for `catalogUid` or name.
        console.log('Catalogs found:', catalogs.data.length);

        // List of catalogs to fetch
        const targetCatalogs = ['acrylic', 'metallic', 'wood-prints', 'posters', 'framed-posters', 'foam-print-product'];
        const allProducts: Record<string, any[]> = {};

        for (const catUid of targetCatalogs) {
            console.log(`Fetching products for ${catUid}...`);
            try {
                const response = await gelatoClient.getProducts(catUid);
                // console.log(`Response for ${catUid}:`, JSON.stringify(response, null, 2)); // Log full response to stdout
                allProducts[catUid] = response; // Save FULL response
            } catch (e) {
                console.error(`Failed to fetch ${catUid}`, e);
            }
        }

        fs.writeFileSync('products_dump.json', JSON.stringify(allProducts, null, 2));
        console.log('Saved products_dump.json');

        const wallArtCatalog = catalogs.data.find((c: any) => c.title === 'Wall Art' || c.productUid === 'wall-art');
        // In Gelato V3, "Wall Art" might be a category or catalog. 
        // Let's dump all catalogs first to see structure if we are unsure.

        fs.writeFileSync('catalogs_dump.json', JSON.stringify(catalogs, null, 2));
        console.log('Saved catalogs_dump.json');

        // If we assume a specific known structure or just want to explore:
        // Let's try to fetch products for a likely Wall Art catalog if found, 
        // or just list the first few to help me identify the right one.

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
