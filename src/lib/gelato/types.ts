export interface GelatoAddress {
    companyName?: string;
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postCode: string;
    state?: string;
    country: string;
    email: string;
    phone?: string;
}

export interface GelatoFile {
    type: 'default' | 'preview';
    url: string;
}

export interface GelatoItem {
    itemReferenceId: string;
    productUid: string;
    files: GelatoFile[];
    quantity: number;
}

export interface GelatoOrderCreateRequest {
    orderType: 'draft' | 'order';
    orderReferenceId: string;
    customer: {
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
    };
    shippingAddress: GelatoAddress;
    items: GelatoItem[];
}

export interface GelatoOrderResponse {
    id: string;
    orderReferenceId: string;
    orderType: string;
    fulfillmentStatus: string;
    financialStatus: string;
    currency: string;
    total: number;
    items: any[];
    shippingAddress: GelatoAddress;
    shipment: any;
    receipts: any[];
    createdAt: string;
    updatedAt: string;
}

export interface GelatoShipmentMethod {
    shipmentMethodUid: string;
    name: string;
    price: number;
    deliveryDays: {
        min: number;
        max: number;
    };
}

export interface GelatoQuoteRequest {
    orderType: 'draft' | 'order';
    orderReferenceId: string;
    customer: {
        country: string;
    };
    shippingAddress: {
        country: string;
        firstName?: string; // Sometimes required for validation
        lastName?: string;
        addressLine1?: string;
        city?: string;
        postCode?: string;
    };
    items: GelatoItem[];
}

export interface GelatoQuoteResponse {
    quotes: {
        itemReferenceId: string;
        price: number;
        currency: string;
        products: {
            productUid: string;
            price: number;
            currency: string;
            quantity: number;
        }[];
    }[];
    shipmentMethods: GelatoShipmentMethod[];
}

export interface GelatoWebhookEvent {
    id: string;
    topic: string; // e.g., 'order.status.changed'
    createdAt: string;
    data: any; // Order object usually
}
