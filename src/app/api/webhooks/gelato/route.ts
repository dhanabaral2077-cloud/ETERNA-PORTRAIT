import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin client to update orders
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    try {
        const event = await request.json();
        // Verify webhook signature if Gelato provides one (recommended for security)

        console.log('Received Gelato Webhook:', event.topic, event.id);

        const { topic, data } = event;

        if (topic === 'order.status.changed') {
            const orderId = data.orderReferenceId; // Assuming we send our ID as reference
            const newStatus = mapGelatoStatus(data.fulfillmentStatus);

            // Update Supabase
            const { error } = await supabaseAdmin
                .from('orders')
                .update({
                    status: newStatus,
                    // delivery_status: data.fulfillmentStatus, // if we have a detailed column
                    tracking_number: data.shipment?.trackingNumber,
                    carrier: data.shipment?.shippingProvider
                })
                .eq('id', orderId);

            if (error) {
                console.error('Failed to update order via webhook:', error);
                return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
            }
        }

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

function mapGelatoStatus(gelatoStatus: string): string {
    // Map Gelato status to our internal status enum
    switch (gelatoStatus.toLowerCase()) {
        case 'printed': return 'in_production';
        case 'shipped': return 'shipped';
        case 'canceled': return 'cancelled';
        case 'delivered': return 'completed';
        default: return 'processing';
    }
}
