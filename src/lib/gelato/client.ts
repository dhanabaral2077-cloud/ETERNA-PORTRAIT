import {
    GelatoOrderCreateRequest,
    GelatoOrderResponse,
    GelatoQuoteRequest,
    GelatoQuoteResponse,
    GelatoShipmentMethod
} from './types';

const GELATO_API_KEY = process.env.GELATO_API_KEY;

if (!GELATO_API_KEY) {
    console.warn("GELATO_API_KEY is not defined in environment variables. Gelato integration will fail.");
}

class GelatoClient {
    private apiKey: string;
    private baseUrl: string;

    constructor() {
        this.apiKey = process.env.GELATO_API_KEY || '';
        // V4 is the latest for orders, but some endpoints might differ.
        // Using a base URL that can be adjusted per endpoint if needed, 
        // or full URLs in methods.
        // Documentation: https://developers.gelato.com/
        this.baseUrl = 'https://order.gelatoapis.com/v4';
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        if (!this.apiKey) {
            throw new Error('Gelato API Key is missing.');
        }

        const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

        const headers = {
            'X-API-KEY': this.apiKey,
            'Content-Type': 'application/json',
            ...options.headers,
        };

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            let errorBody;
            try {
                errorBody = await response.json();
            } catch (e) {
                errorBody = await response.text();
            }
            console.error(`Gelato API Error [${options.method || 'GET'} ${url}]:`, errorBody);
            throw new Error(`Gelato API request failed: ${response.status} ${response.statusText} - ${JSON.stringify(errorBody)}`);
        }

        return response.json();
    }

    /**
     * Create a new order (or draft) in Gelato
     */
    async createOrder(orderData: GelatoOrderCreateRequest): Promise<GelatoOrderResponse> {
        return this.request<GelatoOrderResponse>('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    }

    /**
     * Get an order by ID
     */
    async getOrder(orderId: string): Promise<GelatoOrderResponse> {
        return this.request<GelatoOrderResponse>(`/orders/${orderId}`);
    }

    /**
     * Cancel an order
     */
    async cancelOrder(orderId: string): Promise<void> {
        return this.request<void>(`/orders/${orderId}:cancel`, {
            method: 'POST'
        });
    }

    /**
     * Get shipping methods / Calculate Quote
     * Note: Gelato often combines shipping calculation with a quote endpoint or a specific shipment-methods endpoint.
     * For V4, typically we use /orders:quote or /shipment-methods depending on the need.
     * This implementation uses the Quote endpoint as it's more robust for "cart" scenarios.
     */
    async calculateQuote(quoteData: GelatoQuoteRequest): Promise<GelatoQuoteResponse> {
        // https://order.gelatoapis.com/v4/orders:quote
        return this.request<GelatoQuoteResponse>('/orders:quote', {
            method: 'POST',
            body: JSON.stringify(quoteData)
        });
    }

    /**
     * Legacy/Simple Shipment Method fetch
     * Good for quickly getting a list of methods for a country without a full cart structure,
     * though `calculateQuote` is more accurate for specific products.
     */
    async getShipmentMethods(countryCode: string): Promise<any> {
        // https://shipment.gelatoapis.com/v1/shipment-methods?country={country}
        // Note: Different base URL for shipment service in some docs, but often unified.
        // Let's try the specific shipment service URL if standard fail, or just use it directly.
        const url = `https://shipment.gelatoapis.com/v1/shipment-methods?country=${countryCode}`;
        return this.request<any>(url);
    }

    // --- Product/Catalog endpoints (usually read-only public or auth'd) ---
    // https://product.gelatoapis.com/v3/catalogs

    async getCatalogs(): Promise<any> {
        const url = 'https://product.gelatoapis.com/v3/catalogs';
        return this.request<any>(url);
    }

    async getProducts(catalogUid: string): Promise<any> {
        const url = `https://product.gelatoapis.com/v3/catalogs/${catalogUid}/products`;
        return this.request<any>(url);
    }

    async getProduct(productUid: string): Promise<any> {
        const url = `https://product.gelatoapis.com/v3/products/${productUid}`;
        return this.request<any>(url);
    }
}

export const gelatoClient = new GelatoClient();
