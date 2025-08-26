// /app/api/paypal/create-order/route.ts
import { NextResponse } from "next/server";
import client from '@/lib/paypal-client';
import paypal from '@paypal/checkout-server-sdk';

export async function POST(req: Request) {
    try {
        const { orderId, amount, currency = "USD" } = await req.json();
        if (!orderId || typeof amount !== 'number') {
            return NextResponse.json({ error: "orderId and a numeric amount are required" }, { status: 400 });
        }

        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: "CAPTURE",
            purchase_units: [
                {
                    reference_id: orderId,
                    amount: {
                        currency_code: currency,
                        value: amount.toFixed(2),
                    },
                },
            ],
        });

        const order = await client.execute(request);

        return NextResponse.json({ id: order.result.id });

    } catch (e: any) | any {
        console.error("PayPal create order error:", e.message);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
