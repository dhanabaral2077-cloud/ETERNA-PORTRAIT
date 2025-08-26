
import { NextResponse } from "next/server";
// Note: You would import your actual database client and email service here.
// import { createClient } from "@supabase/supabase-js";
// import { Resend } from "resend";
import ProductionKickoff from "@/emails/ProductionKickoff";

export async function POST(req: Request) {
    // Ensure PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET are set in your environment variables
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return NextResponse.json({ error: "PayPal API credentials are not configured." }, { status: 500 });
  }
  
  const { orderId, paypalOrderId } = await req.json();

  if (!orderId || !paypalOrderId) {
    return NextResponse.json({ error: "Missing orderId or paypalOrderId." }, { status: 400 });
  }

  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");
  
  const PAYPAL_API_URL = process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

  try {
    const res = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
        // It's good practice for CAPTURE calls, though often not required.
        // It prevents issues with duplicate capture attempts.
        // "PayPal-Request-Id": `capture-${orderId}-${Date.now()}` 
      },
      cache: 'no-store'
    });
  
    const data = await res.json();

    if (!res.ok) {
        console.error('PayPal Capture Error:', data);
        const errorMessage = data?.details?.[0]?.description || data.message || "Failed to capture PayPal order.";
        return NextResponse.json({ error: errorMessage }, { status: res.status });
    }

    // If the payment is successful, the status will be 'COMPLETED'
    if (data.status === 'COMPLETED') {
      // --- Database & Email Logic (Placeholder) ---
      // In a real implementation, you would uncomment and use the following:

      // ✅ 1. Update order status in your database
      // const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
      // await db.from("orders").update({ status: "paid", payment_id: paypalOrderId }).eq("id", orderId);
      console.log(`Order ${orderId} updated to 'paid' in database (mock).`);
      
      // ✅ 2. Log payment success event
      // await db.from("order_events").insert({ order_id: orderId, type: "payment_succeeded", meta: { paypalOrderId } });
      console.log(`Logged 'payment_succeeded' event for order ${orderId}.`);

      // 📧 3. Send "We’re starting your artwork” email
      // const resend = new Resend(process.env.RESEND_API_KEY!);
      // // Fetch order and customer details to personalize the email
      // const { data: orderDetails } = await db.from("orders").select("*, customers:customer_id(email,name)").eq("id", orderId).single();
      // if (orderDetails?.customers?.email) {
      //   await resend.emails.send({
      //     from: "Studio <orders@yourdomain.com>",
      //     to: orderDetails.customers.email,
      //     subject: "Your Artwork Is Now Beginning 🖌️",
      //     react: ProductionKickoff({ name: orderDetails.customers.name, orderId }),
      //   });
      //   console.log(`Production kickoff email sent for order ${orderId}.`);
      // }

      // ✅ 4. Log email event
      // await db.from("order_events").insert({ order_id: orderId, type: "email_sent", meta: { template: "ProductionKickoff" } });
      console.log(`Logged 'email_sent' event for order ${orderId} with ProductionKickoff template.`);

    } else {
       // Handle cases where capture is not immediately completed (e.g., e-checks)
       // You might want to log this and handle it via webhooks later.
       console.warn(`PayPal capture status for order ${orderId} is ${data.status}. Needs manual review or webhook handling.`);
    }

    return NextResponse.json({ success: true, capture: data });
  } catch (error) {
    console.error("Internal Server Error on Capture:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: "Internal Server Error", message: errorMessage }, { status: 500 });
  }
}
