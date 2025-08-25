// /app/api/orders/route.ts
import { NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";
// import { Resend } from "resend";
// import OrderConfirmation from "@/emails/OrderConfirmation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, style, format, size, petName, photoUrl, priceCents, notes } = body;

    // --- Database & Email Logic (Placeholder) ---
    // In a real implementation, you would uncomment and use the following:
    
    // const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // // 1. Upsert customer
    // const { data: customer, error: cErr } = await db
    //   .from("customers")
    //   .upsert({ email, name })
    //   .select()
    //   .single();
    // if (cErr) throw new Error(`Supabase customer error: ${cErr.message}`);
    const customer = { id: `cus_${crypto.randomUUID()}`, email, name };
    console.log("Upserted Customer (mock):", customer);

    // // 2. Create order
    // const { data: order, error: oErr } = await db
    //   .from("orders")
    //   .insert({
    //     customer_id: customer.id,
    //     status: "pending",
    //     style, format, size,
    //     pet_name: petName,
    //     photo_url: photoUrl,
    //     price_cents: priceCents,
    //     notes
    //   })
    //   .select()
    //   .single();
    // if (oErr) throw new Error(`Supabase order error: ${oErr.message}`);
    const order = { id: `ord_${crypto.randomUUID()}` };
    console.log("Created Order (mock):", order);


    // // 3. Log event
    // await db.from("order_events").insert({ order_id: order.id, type: "created", meta: { priceCents } });
    console.log("Logged 'created' event for order:", order.id);

    // // 4. Send branded confirmation email
    // const resend = new Resend(process.env.RESEND_API_KEY!);
    // await resend.emails.send({
    //   from: "Studio <orders@yourdomain.com>",
    //   to: email,
    //   subject: "Your Pet’s Portrait Commission Has Begun ✨",
    //   react: OrderConfirmation({ name, orderId: order.id, style, format, size, petName }),
    // });
    console.log("Sent Order Confirmation email to:", email);


    // // 5. Log email event
    // await db.from("order_events").insert({ order_id: order.id, type: "email_sent", meta: { template: "OrderConfirmation" } });
    console.log("Logged 'email_sent' event for order:", order.id);

    return NextResponse.json({ orderId: order.id });

  } catch (error) {
      console.error("Error creating order:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}