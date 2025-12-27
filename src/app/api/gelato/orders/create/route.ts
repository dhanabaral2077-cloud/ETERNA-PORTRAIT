import { NextResponse } from 'next/server';
import { gelatoClient } from '@/lib/gelato/client';
import { GelatoOrderCreateRequest } from '@/lib/gelato/types';

export async function POST(request: Request) {
    try {
        const body: GelatoOrderCreateRequest = await request.json();

        // In a real app, verify authentication/authorization here
        // e.g., check session, verify payment status if not already done

        const order = await gelatoClient.createOrder(body);
        return NextResponse.json(order);

    } catch (error: any) {
        console.error('Order Creation API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
