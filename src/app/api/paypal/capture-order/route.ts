// /app/api/paypal/capture-order/route.ts
import { NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";
// import { Resend } from "resend";
import ProductionKickoff from "@/emails/ProductionKickoff";

const PAYPAL_API_URL = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";

export async function POST(req: Request) {
    try {
        if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
            throw new Error("PayPal API credentials are not configured.");
        }

        const { orderId, paypalOrderId } = await req.json();
        if (!orderId || !paypalOrderId) {
            return NextResponse.json({ error: "orderId and paypalOrderId required" }, { status: 400 });
        }

        const auth = Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
        ).toString("base64");

        const res = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderId}/capture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${auth}`,
            },
            cache: 'no-store'
        });

        const captureData = await res.json();
        if (!res.ok) {
            console.error("PayPal capture error:", captureData);
            return NextResponse.json({ error: captureData?.message || "PayPal capture error", details: captureData }, { status: res.status });
        }

        if (captureData.status === 'COMPLETED') {
            // --- Database & Email Logic (Placeholder) ---
            // const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
            
            // ✅ Update order status
            // await db.from("orders").update({ status: "paid", payment_id: paypalOrderId }).eq("id", orderId);
            console.log(`Order ${orderId} status updated to 'paid' (mock).`);
            
            // ✅ Log payment event
            // await db.from("order_events").insert({ order_id: orderId, type: "payment_succeeded", meta: captureData });
            console.log(`'payment_succeeded' event logged for order ${orderId} (mock).`);

            // ✅ Fetch customer details for email
            // const { data: orderDetails } = await db.from("orders").select("*, customers:customer_id(email,name)").eq("id", orderId).single();
            const orderDetails = { customers: { email: 'test@example.com', name: 'John Doe' } }; // Mock data

            // 📧 Send "Production Kickoff" email
            if (orderDetails?.customers?.email) {
                // const resend = new Resend(process.env.RESEND_API_KEY!);
                // await resend.emails.send({
                //     from: "Studio <orders@yourdomain.com>",
                //     to: orderDetails.customers.email,
                //     subject: "Your Artwork Is Now Beginning 🖌️",
                //     react: ProductionKickoff({ name: orderDetails.customers.name, orderId }),
                // });
                console.log(`ProductionKickoff email sent for order ${orderId} to ${orderDetails.customers.email} (mock).`);

                // ✅ Log email event
                // await db.from("order_events").insert({ order_id: orderId, type: "email_sent", meta: { template: "ProductionKickoff" } });
                console.log(`'email_sent' event for ProductionKickoff logged for order ${orderId} (mock).`);
            }
        } else {
            console.warn(`PayPal capture status for ${orderId} is not 'COMPLETED': ${captureData.status}`);
            // Handle pending payments (e.g., eChecks) via webhooks if necessary
        }

        return NextResponse.json({ success: true, capture: captureData });

    } catch (e: any) {
        console.error("Internal server error capturing PayPal order:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}