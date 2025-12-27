import { ProductType, SizeType } from '../pricing';

// These are placeholder UIDs. 
// IN PRODUCTION: You must replace these with actual Gelato Product UIDs from their Catalog API.
// You can find these by calling `await gelatoClient.getProducts(catalogId)` or checking Gelato Dashboard.
const GELATO_PRODUCT_MAP: Record<string, string> = {
    // --- Canvas ---
    'canvas_12x16': 'canvas_se_30x40cm-12x16in_18mm_701', // Example UID
    'canvas_18x24': 'canvas_se_45x60cm-18x24in_18mm_701',
    'canvas_24x36': 'canvas_se_60x90cm-24x36in_18mm_701',

    // --- Fine Art Poster ---
    'fine_art_poster_12x16': 'poster_fr_30x40cm-12x16in_200_matte',
    'fine_art_poster_18x24': 'poster_fr_45x60cm-18x24in_200_matte',
    'fine_art_poster_24x36': 'poster_fr_60x90cm-24x36in_200_matte',

    // --- Framed Poster (Wood) ---
    'framed_poster_wood_12x16': 'framed_poster_fr_30x40cm-12x16in_wood_black_matte',
    'framed_poster_wood_18x24': 'framed_poster_fr_45x60cm-18x24in_wood_black_matte',
    'framed_poster_wood_24x36': 'framed_poster_fr_60x90cm-24x36in_wood_black_matte',

    // --- Framed Poster (Metal) ---
    'framed_poster_metal_12x16': 'framed_poster_fr_30x40cm-12x16in_aluminum_black_matte',
    // --- Acrylic ---
    'acrylic_print_12x16': 'acrylic_12x16-inch-300x400-mm_4-mm_4-0_hor',
    'acrylic_print_18x24': 'acrylic_18x24-inch-450x600-mm_4-mm_4-0_hor',
    'acrylic_print_24x36': 'acrylic_24x36-inch-600x900-mm_4-mm_4-0_hor',

    // --- Aluminum (Metallic) ---
    'aluminum_print_12x16': 'metallic_12x16-inch-300x400-mm_3-mm-silver-brushed_hor-grain_4-0_hor',
    'aluminum_print_18x24': 'metallic_18x24-inch-450x600-mm_3-mm-silver-brushed_hor-grain_4-0_hor',
    'aluminum_print_24x36': 'metallic_24x36-inch-600x900-mm_3-mm-silver-brushed_hor-grain_4-0_hor',

    // --- Wood ---
    'wood_print_12x16': 'wood_12x16-inch-300x400-mm_lined-plywood_10-mm_hor-grain_4-0_hor',
    'wood_print_18x24': 'wood_18x24-inch-450x600-mm_lined-plywood_10-mm_hor-grain_4-0_hor',
    'wood_print_24x36': 'wood_24x36-inch-600x900-mm_lined-plywood_10-mm_hor-grain_4-0_hor',

    // --- Foam ---
    'foam_print_12x16': 'foam_12x16-inch-300x400-mm_5-mm_black_4-0_hor',
    'foam_print_18x24': 'foam_18x24-inch-450x600-mm_5-mm_black_4-0_hor',
    'foam_print_24x36': 'foam_24x36-inch-600x900-mm_5-mm_black_4-0_hor',
};

export function getGelatoProductUid(type: ProductType, size: SizeType): string | null {
    const key = `${type}_${size}`;
    return GELATO_PRODUCT_MAP[key] || null;
}
