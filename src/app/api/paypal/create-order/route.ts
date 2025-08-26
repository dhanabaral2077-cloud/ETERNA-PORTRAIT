
// /app/api/paypal/create-order/route.ts
import { NextResponse } from "next/server";
import client from "@/lib/paypal-client";
import paypal from "@paypal/checkout-server-sdk";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    let { orderId, amount, currency = "USD" } = body ?? {};

    // Accept numeric strings for amount as an additional convenience
    if (typeof amount === "string") {
      const parsed = parseFloat(amount);
      amount = Number.isFinite(parsed) ? parsed : undefined;
    }

    if (!orderId || typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "orderId and a positive numeric amount are required" },
        { status: 400 }
      );
    }

    // Build PayPal create order request
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: orderId,
          amount: {
            currency_code: currency.toUpperCase(),
            value: amount.toFixed(2),
          },
        },
      ],
    });

    const order = await client.execute(request);

    if (!order?.result?.id) {
      console.error("PayPal create-order executed but returned no id:", order);
      return NextResponse.json(
        { error: "PayPal did not return an order id" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: order.result.id });
  } catch (e: any) {
    console.error("PayPal create order error:", e?.message ?? e);
    return NextResponse.json({ error: e?.message ?? "Internal server error" }, { status: 500 });
  }
}
