
// /app/api/paypal/capture-order/route.ts
import { NextResponse } from "next/server";
import client from "@/lib/paypal-client";
import paypal from "@paypal/checkout-server-sdk";
import ProductionKickoff from "@/emails/ProductionKickoff";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { orderId, paypalOrderId } = body ?? {};

    if (!orderId || !paypalOrderId) {
      return NextResponse.json({ error: "orderId and paypalOrderId required" }, { status: 400 });
    }

    const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
    // @ts-ignore
    request.requestBody({});

    const capture = await client.execute(request);
    const captureData = capture?.result;

    if (!captureData) {
      console.error("PayPal capture call returned no result:", capture);
      return NextResponse.json({ error: "No capture result from PayPal" }, { status: 500 });
    }

    if (captureData.status === "COMPLETED") {
      // --- Database & Email Logic (Placeholder) ---
      console.log(`Order ${orderId} status updated to 'paid' (mock).`);
      console.log(`'payment_succeeded' event logged for order ${orderId} (mock).`);

      const orderDetails = { customers: { email: "test@example.com", name: "John Doe" } }; // Mock

      if (orderDetails?.customers?.email) {
        console.log(
          `ProductionKickoff email sent for order ${orderId} to ${orderDetails.customers.email} (mock).`
        );
        console.log(
          `'email_sent' event for ProductionKickoff logged for order ${orderId} (mock).`
        );
      }
    } else {
      console.warn(
        `PayPal capture status for ${orderId} is ${captureData.status}. Consider handling pending states via webhooks.`
      );
    }

    return NextResponse.json({ success: true, capture: captureData });
  } catch (e: any) {
    console.error("Internal server error capturing PayPal order:", e?.message ?? e);
    return NextResponse.json(
      { error: e?.message ?? "Internal server error capturing order" },
      { status: 500 }
    );
  }
}
