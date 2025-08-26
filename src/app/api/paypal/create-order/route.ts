// /app/api/paypal/create-order/route.ts
import { NextResponse } from "next/server";

// Fallback to sandbox if not set
const PAYPAL_API_URL = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
    // Ensure PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET are set
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
        throw new Error("PayPal API credentials are not configured in environment variables.");
    }

    const auth = Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const res = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ grant_type: "client_credentials" }),
        cache: 'no-store' // Important for token requests
    });

    if (!res.ok) {
        const errorBody = await res.json();
        console.error("Failed to get PayPal access token:", errorBody);
        throw new Error(`Failed to get PayPal access token. Status: ${res.status}`);
    }

    const data = await res.json();
    return data.access_token;
}

export async function POST(req: Request) {
    try {
        const { orderId, amount, currency = "USD" } = await req.json();
        if (!orderId || typeof amount !== 'number') {
            return NextResponse.json({ error: "orderId and a numeric amount are required" }, { status: 400 });
        }

        const accessToken = await getAccessToken();

        const res = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
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
            }),
            cache: 'no-store' // Ensure fresh data for order creation
        });

        const data = await res.json();
        if (!res.ok) {
            console.error("PayPal create order error:", data);
            return NextResponse.json({ error: data?.message || "PayPal create order error", details: data }, { status: res.status });
        }

        return NextResponse.json(data);

    } catch (e: any) {
        console.error("Internal server error creating PayPal order:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}