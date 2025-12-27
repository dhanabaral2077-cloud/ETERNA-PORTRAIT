const fs = require('fs');

const data = JSON.parse(fs.readFileSync('products_dump.json', 'utf8'));
const targetSizes = ['12x16', '18x24', '24x36', '30x40', '45x60', '60x90']; // Partial matches
const categories = ['acrylic', 'metallic', 'wood-prints', 'posters', 'framed-posters', 'foam-print-product'];

const found = {};

for (const cat of categories) {
    if (!data[cat] || !data[cat].products) continue;

    console.log(`\n--- ${cat} ---`);
    const products = data[cat].products;

    // Group by size if possible or just list one of each size
    for (const size of targetSizes) {
        const match = products.find(p => p.productUid.includes(size));
        if (match) {
            if (!found[cat]) found[cat] = {};
            found[cat][size] = match.productUid;
        }
    }
}

fs.writeFileSync('uids_clean.json', JSON.stringify(found, null, 2));
console.log('Saved uids_clean.json');
