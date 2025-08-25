
import { NextResponse } from "next/server";
// Note: You would import your actual database client and email service here.
// For this example, we'll use placeholder comments.
// import { createClient } from "@supabase/supabase-js";
// import { Resend } from "resend";
// import ProductionKickoff from "@/emails/ProductionKickoff";

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
      },
      cache: 'no-store'
    });
  
    const data = await res.json();

    if (!res.ok) {
        console.error('PayPal Capture Error:', data);
        return NextResponse.json({ error: data.message || "Failed to capture PayPal order." }, { status: res.status });
    }

    // If the payment is successful, the status will be 'COMPLETED'
    if (data.status === 'COMPLETED') {
      // ✅ Update order status in your database
      // const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
      // await db.from("orders").update({ status: "paid", payment_id: paypalOrderId }).eq("id", orderId);
      console.log(`Order ${orderId} updated to paid in database.`);

      // 📧 Send "We’re starting your artwork” email
      // const resend = new Resend(process.env.RESEND_API_KEY!);
      // const { data: order } = await db.from("orders").select("*, customers:customer_id(email,name)").eq("id", orderId).single();
      // if (order?.customers?.email) {
      //   await resend.emails.send({
      //     from: "Studio <orders@yourdomain.com>",
      //     to: order.customers.email,
      //     subject: "Your Artwork Is Now Beginning 🖌️",
      //     react: ProductionKickoff({ name: order.customers.name, orderId }),
      //   });
      //   console.log(`Confirmation email sent for order ${orderId}.`);
      // }
    } else {
       // Handle cases where capture is not immediately completed (e.g., e-checks)
       console.warn(`PayPal capture status for order ${orderId} is ${data.status}.`);
    }

    return NextResponse.json({ success: true, capture: data });
  } catch (error) {
    console.error("Internal Server Error on Capture:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

