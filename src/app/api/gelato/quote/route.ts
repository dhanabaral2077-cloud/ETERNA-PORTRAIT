import { NextResponse } from 'next/server';
import { gelatoClient } from '@/lib/gelato/client';
import { GelatoQuoteRequest } from '@/lib/gelato/types';

export async function POST(request: Request) {
    try {
        const body: GelatoQuoteRequest = await request.json();

        // Validate minimal fields
        if (!body.items || body.items.length === 0) {
            return NextResponse.json({ error: 'Items are required for a quote.' }, { status: 400 });
        }
        if (!body.shippingAddress || !body.shippingAddress.country) {
            return NextResponse.json({ error: 'Shipping country is required.' }, { status: 400 });
        }

        const quote = await gelatoClient.calculateQuote(body);
        return NextResponse.json(quote);

    } catch (error: any) {
        console.error('Quote API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
