
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Ensure PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET are set in your environment variables
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return NextResponse.json({ error: "PayPal API credentials are not configured." }, { status: 500 });
  }

  const { orderId, amount } = await req.json();

  if (!orderId || typeof amount !== 'number') {
    return NextResponse.json({ error: "Missing orderId or amount." }, { status: 400 });
  }

  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const PAYPAL_API_URL = process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

  try {
    const res = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          reference_id: orderId,
          amount: {
            currency_code: "USD",
            value: amount.toFixed(2)
          }
        }],
      }),
      // Caching can cause issues with API calls that need to be fresh.
      cache: 'no-store'
    });

    const data = await res.json();
    
    if (!res.ok) {
        console.error('PayPal API Error:', data);
        // Provide a more specific error message if available from PayPal
        const errorMessage = data?.details?.[0]?.description || data.message || "Failed to create PayPal order.";
        return NextResponse.json({ error: errorMessage }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
