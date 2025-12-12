export const PRODUCT_PRICES = {
    // Classic Plan
    fine_art_poster: {
        basePrice: 59, // 12x16 base
        name: 'Fine Art Poster',
        plan: 'classic',
    },
    framed_poster_wood: {
        basePrice: 119,
        name: 'Wooden Framed Poster',
        plan: 'classic',
    },
    framed_poster_metal: {
        basePrice: 129,
        name: 'Metal Framed Poster',
        plan: 'classic',
    },

    // Signature Plan
    canvas: {
        basePrice: 129,
        name: 'Canvas',
        plan: 'signature',
    },
    framed_canvas: {
        basePrice: 199,
        name: 'Framed Canvas',
        plan: 'signature',
    },

    // Masterpiece Plan
    aluminum_print: {
        basePrice: 189,
        name: 'Aluminum Print',
        plan: 'masterpiece',
    },
    acrylic_print: {
        basePrice: 229,
        name: 'Acrylic Print',
        plan: 'masterpiece',
    },

    // Gift Plan
    gift_card: {
        basePrice: 1, // Multiplier for denomination
        name: 'Eterna Gift Card',
        plan: 'gift',
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
