
import { useState, useEffect } from 'react';
import { PRODUCT_PRICES, ProductType } from '@/lib/pricing';

export function useProducts() {
    const [products, setProducts] = useState<typeof PRODUCT_PRICES>(PRODUCT_PRICES);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProducts() {
            try {
                const res = await fetch('/api/products');
                if (!res.ok) throw new Error('Failed to fetch product config');
                const dynamicProducts = await res.json();

                // Merge with defaults to ensure type safety/formatting matches what usage expects
                // But dynamicProducts should ideally structurally match PRODUCT_PRICES
                setProducts(dynamicProducts);
            } catch (err) {
                console.warn('Failed to load dynamic products, falling back to static config.', err);
                // Fallback is already set
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, []);

    return { products, loading };
}
