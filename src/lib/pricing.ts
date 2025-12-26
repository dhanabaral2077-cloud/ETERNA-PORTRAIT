export const PRODUCT_PRICES = {
    // Classic Plan
    fine_art_poster: {
        basePrice: 59, // 12x16 base
        name: 'Fine Art Poster',
        plan: 'classic',
        image: '/products/Fine art/fine art poster/Gemini_Generated_Image_l3jkakl3jkakl3jk.png',
    },
    framed_poster_wood: {
        basePrice: 119,
        name: 'Wooden Framed Poster',
        plan: 'classic',
        image: '/products/Fine art/wooden Framed/Gemini_Generated_Image_grgbk0grgbk0grgb.png',
    },
    framed_poster_metal: {
        basePrice: 129,
        name: 'Metal Framed Poster',
        plan: 'classic',
        image: '/products/Fine art/Metal Framed/Gemini_Generated_Image_b4dqywb4dqywb4dq.png',
    },

    // Signature Plan
    canvas: {
        basePrice: 129,
        name: 'Canvas',
        plan: 'signature',
        image: '/products/Premium Canvas/Canvas/Gemini_Generated_Image_4msi914msi914msi.png',
    },
    framed_canvas: {
        basePrice: 199,
        name: 'Framed Canvas',
        plan: 'signature',
        image: '/products/Premium Canvas/Framed Canvas/Gemini_Generated_Image_4yh4vm4yh4vm4yh4.png',
    },

    // Masterpiece Plan
    aluminum_print: {
        basePrice: 189,
        name: 'Aluminum Print',
        plan: 'masterpiece',
        image: '/products/Luxury Print/Aluminum Print/Gemini_Generated_Image_vlvqunvlvqunvlvq.png',
    },
    acrylic_print: {
        basePrice: 229,
        name: 'Acrylic Print',
        plan: 'masterpiece',
        image: '/products/Luxury Print/Acrylic Print/AcrylicPrint.png',
    },

    // Gift Plan
    gift_card: {
        basePrice: 1, // Multiplier for denomination
        name: 'Eterna Gift Card',
        plan: 'gift',
        image: '/portfolio/eterna_logo_santa_hat.png', // Fallback or specific gift card image
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
        modifier: 0.8, // Slightly cheaper than base
    },
    '12x16': {
        name: '30x40 cm / 12x16"',
        modifier: 1.0, // Base size
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
