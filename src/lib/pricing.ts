export const PRODUCT_PRICES = {
    // Classic Plan
    fine_art_poster: {
        basePrice: 45, // Was 59
        name: 'Fine Art Poster',
        plan: 'classic',
        image: '/products/Fine art/fine art poster/Gemini_Generated_Image_l3jkakl3jkakl3jk.png',
        gallery: [
            '/products/Fine art/fine art poster/Gemini_Generated_Image_l3jkakl3jkakl3jk.png',
            '/products/Fine art/fine art poster/Gemini_Generated_Image_5q3khw5q3khw5q3k.png',
            '/products/Fine art/fine art poster/Gemini_Generated_Image_ifzunfifzunfifzu.png',
            '/products/Fine art/fine art poster/Gemini_Generated_Image_x58a71x58a71x58a.png',
        ]
    },
    framed_poster_wood: {
        basePrice: 89, // Was 119
        name: 'Wooden Framed Poster',
        plan: 'classic',
        image: '/products/Fine art/wooden Framed/Gemini_Generated_Image_x4nystx4nystx4ny.png',
        gallery: [
            '/products/Fine art/wooden Framed/Gemini_Generated_Image_x4nystx4nystx4ny.png',
            '/products/Fine art/wooden Framed/Gemini_Generated_Image_grgbk0grgbk0grgb.png',
            '/products/Fine art/wooden Framed/Gemini_Generated_Image_hlxr98hlxr98hlxr.png',
        ]
    },
    framed_poster_metal: {
        basePrice: 99, // Was 129
        name: 'Metal Framed Poster',
        plan: 'classic',
        image: '/products/Fine art/Metal Framed/Gemini_Generated_Image_fhahnkfhahnkfhah.png',
        gallery: [
            '/products/Fine art/Metal Framed/Gemini_Generated_Image_fhahnkfhahnkfhah.png',
            '/products/Fine art/Metal Framed/Gemini_Generated_Image_b4dqywb4dqywb4dq.png',
            '/products/Fine art/Metal Framed/Gemini_Generated_Image_b4ufib4ufib4ufib.png',
            '/products/Fine art/Metal Framed/Gemini_Generated_Image_c4178hc4178hc417.png',
        ]
    },

    // Signature Plan
    canvas: {
        id: 'canvas',
        name: 'Standard Canvas',
        basePrice: 59,
        description: 'Gallery-quality canvas print, professionally wrapped around a sturdy wooden frame. Ready to hang.',
        image: '/products/canvas-mockup.png',
        gallery: [
            '/products/gelato_canvas_wrapped_mockup_1767017575513.png',
            '/products/canvas-mockup.png',
            '/portfolio/The_Craftsman_Hero.png'
        ],
        plan: 'signature',
    },
    'framed-canvas': {
        id: 'framed-canvas',
        name: 'Framed Canvas',
        basePrice: 89,
        description: 'Our premium canvas print accented with a sleek floating frame for a museum-quality look.',
        image: '/products/framed-canvas-mockup.png',
        gallery: [
            '/products/gelato_style_framed_canvas_mockup_1766668155063.png',
            '/products/framed-canvas-mockup.png',
            '/portfolio/collector1.png'
        ],
        plan: 'signature',
    },

    // Masterpiece Plan
    aluminum_print: {
        id: 'aluminum',
        name: 'Aluminum Print',
        basePrice: 79,
        description: 'Modern and sleek. Your pet\'s portrait printed directly onto a high-grade aluminum sheet for a stunning metallic finish.',
        image: '/products/aluminum-mockup.png',
        gallery: [
            '/products/gelato_aluminum_print_mockup_1767017590157.png',
            '/products/aluminum-mockup.png'
        ],
        plan: 'aluminum',
    },
    acrylic_print: {
        basePrice: 139, // Was 229
        name: 'Acrylic Print',
        plan: 'masterpiece',
        image: '/products/Luxury Print/Acrylic Print/AcrylicPrint.png',
        gallery: [
            '/products/Luxury Print/Acrylic Print/AcrylicPrint.png',
            '/products/Luxury Print/Acrylic Print/AcrylicPrint (4).png',
        ]
    },

    wood_print: {
        basePrice: 99, // Was 179
        name: 'Wood Print',
        plan: 'masterpiece',
        image: '/products/Luxury Print/Wood Print/Gemini_Generated_Image_aegjaxaegjaxaegj.png',
        gallery: [
            '/products/Luxury Print/Wood Print/Gemini_Generated_Image_aegjaxaegjaxaegj.png',
            '/products/Luxury Print/Wood Print/Gemini_Generated_Image_hf0rithf0rithf0r.png',
            '/products/Luxury Print/Wood Print/Gemini_Generated_Image_vjfrc1vjfrc1vjfr.png',
        ]
    },
    foam_print: {
        basePrice: 59, // Was 99
        name: 'Foam Print',
        plan: 'classic',
        image: '/products/Fine art/Foam Print/Gemini_Generated_Image_4e5rr4e5rr4e5rr4.png',
        gallery: [
            '/products/Fine art/Foam Print/Gemini_Generated_Image_4e5rr4e5rr4e5rr4.png',
            '/products/Fine art/Foam Print/Gemini_Generated_Image_dqjo0ddqjo0ddqjo.png',
            '/products/Fine art/Foam Print/Gemini_Generated_Image_u0aogqu0aogqu0ao.png',
        ]
    },

    // Gift Plan
    gift_card: {
        basePrice: 1, // Multiplier for denomination
        name: 'Eterna Gift Card',
        plan: 'gift',
        image: '/portfolio/eterna_logo_santa_hat.png',
        cogs: 0.8, // 80% cost (high margin loss for gift cards usually, unlikely to discount)
    },
} as const;

export const ART_STYLES = {
    artist: {
        id: 'artist',
        title: 'Artist Choice',
        description: 'Our most popular, balanced style.',
        image: '/Art Styles/Artist Choice.png',
    },
    renaissance: {
        id: 'renaissance',
        title: 'Renaissance',
        description: 'Classic, royal, and timeless.',
        image: '/Art Styles/Renaissance.png',
    },
    classic_oil: {
        id: 'classic_oil',
        title: 'Classic Oil',
        description: 'Rich textures and deep tones.',
        image: '/Art Styles/Classic Oil.png',
    },
    watercolor: {
        id: 'watercolor',
        title: 'Watercolor',
        description: 'Soft, dreamy, and artistic.',
        image: '/Art Styles/Watercolor.png',
    },
    modern_minimalist: {
        id: 'modern_minimalist',
        title: 'Modern',
        description: 'Clean lines and bold colors.',
        image: '/Art Styles/Modern.png',
    },
} as const;

export const SIZE_MODIFIERS = {
    '5x7': {
        name: '13x18 cm / 5x7"',
        modifier: 0.8,
    },
    '12x16': {
        name: '30x40 cm / 12x16"',
        modifier: 1.0,
    },
    '18x24': {
        name: '45x60 cm / 18x24"',
        modifier: 1.6,
    },
    '24x36': {
        name: '60x90 cm / 24x36"',
        modifier: 2.2,
    },
    // Gift Denominations
    'gift_50': {
        name: '$50 Gift Card',
        modifier: 50,
    },
    'gift_100': {
        name: '$100 Gift Card',
        modifier: 100,
    },
    'gift_150': {
        name: '$150 Gift Card',
        modifier: 150,
    },
    'gift_200': {
        name: '$200 Gift Card',
        modifier: 200,
    },
} as const;

export type ProductType = keyof typeof PRODUCT_PRICES;
export type SizeType = keyof typeof SIZE_MODIFIERS;

export function calculatePrice(type: ProductType, size: SizeType): number {
    const product = PRODUCT_PRICES[type];
    const sizeMod = SIZE_MODIFIERS[size];

    if (!product || !sizeMod) {
        throw new Error('Invalid product type or size');
    }

    // Calculate and round to nearest whole dollar for clean pricing
    return Math.round(product.basePrice * sizeMod.modifier);
}

// Helper to get Automated Discount Limits
export function getAutomatedPricingLimits(type: ProductType, size: SizeType) {
    const price = calculatePrice(type, size);

    // Default logic:
    // COGS = ~40% of price (Healthy margin)
    // Min Price = ~85% of price (Allow up to 15% automated discount)

    // Specific overrides can be added to PRODUCT_PRICES if needed, e.g. (product as any).cogsBaseline

    const cogs = Number((price * 0.40).toFixed(2));
    const minPrice = Number((price * 0.85).toFixed(2));

    return { cogs, minPrice };
}

export function getProductDetails(type: ProductType, size: SizeType) {
    const product = PRODUCT_PRICES[type];
    const sizeMod = SIZE_MODIFIERS[size];

    return {
        name: product.name,
        plan: product.plan,
        sizeName: sizeMod.name,
        price: calculatePrice(type, size),
    };
}
