import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'Eterna Portrait <orders@eternaportrait.com>'; // Update this once you verify your domain in Resend
const ADMIN_EMAIL = 'orders@eternaportrait.com'; // Your admin email

interface OrderEmailProps {
  to: string;
  customerName: string;
  orderId: string;
  productName: string;
  trackingNumber?: string;
  carrier?: string;
}

export async function sendOrderConfirmationEmail({
  to,
  customerName,
  orderId,
  productName,
}: OrderEmailProps) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not found. Skipping email.');
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `Order Confirmed - Eterna Portrait #${orderId.slice(0, 8)}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6d28d9;">Thank you for your order!</h1>
          <p>Hi ${customerName},</p>
          <p>We are thrilled to begin crafting your bespoke masterpiece. Your order for <strong>${productName}</strong> has been received and our artists are sharpening their pencils (and styluses)!</p>
          <p><strong>Order Reference:</strong> #${orderId.slice(0, 8)}</p>
          <p>We will notify you as soon as your artwork ships.</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
          <p style="font-size: 12px; color: #666;">If you have any questions, simply reply to this email.</p>
        </div>
      `,
    });
    console.log(`Order confirmation sent to ${to}`);
  } catch (error) {
    console.error('Failed to send order confirmation:', error);
  }
}

export async function sendShippingUpdateEmail({
  to,
  customerName,
  orderId,
  trackingNumber,
  carrier
}: OrderEmailProps) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not found. Skipping email.');
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      // bcc: [ADMIN_EMAIL], // Optional: Copy yourself
      subject: `Your Portrait Has Shipped! - Order #${orderId.slice(0, 8)}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6d28d9;">It's on the way!</h1>
          <p>Hi ${customerName},</p>
          <p>Great news! Your custom Eterna Portrait has been printed and shipped.</p>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">Tracking Information</p>
            <p style="margin: 5px 0 0;">Carrier: ${carrier}</p>
            <p style="margin: 5px 0 0;">Tracking Number: <a href="https://www.google.com/search?q=${trackingNumber}" style="color: #6d28d9;">${trackingNumber}</a></p>
          </div>

          <p>We hope you cherish this piece forever. If you love it, please tag us on social media!</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
          <p style="font-size: 12px; color: #666;">Eterna Portrait Concierge</p>
        </div>
      `,
    });
    console.log(`Shipping update sent to ${to}`);
  } catch (error) {
    console.error('Failed to send shipping update:', error);
  }
}

export async function sendWelcomeEmail(email: string, code: string = 'WELCOME10') {
  if (!process.env.RESEND_API_KEY) return;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: 'Welcome to the Eterna Family! 🎨 (Gift Inside)',
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6d28d9;">Welcome to Eterna Portrait!</h1>
          <p>We are so happy you're here. We believe every pet deserves to be immortalized as a masterpiece.</p>
          
          <div style="background-color: #f3e8ff; padding: 20px; border-radius: 12px; text-align: center; margin: 30px 0;">
            <p style="margin: 0; font-size: 18px;">Your Welcome Gift</p>
            <h2 style="color: #6d28d9; font-size: 32px; margin: 10px 0; letter-spacing: 2px;">${code}</h2>
            <p style="margin: 0;">Use this code at checkout for <strong>10% OFF</strong> your first order.</p>
          </div>

          <p>Ready to start? <a href="https://eternaportrait.com" style="color: #6d28d9; font-weight: bold;">Create your portrait now.</a></p>
          
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
          <p style="font-size: 12px; color: #666;">P.S. Need help choosing a photo? Reply to this email!</p>
        </div>
      `,
    });
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}

export async function sendAbandonedCartEmail(email: string, recoveryLink: string) {
  if (!process.env.RESEND_API_KEY) return;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: 'Did you forget something? 🐾',
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6d28d9;">Your masterpiece is waiting...</h1>
          <p>We noticed you started creating a portrait but didn't finish. Don't worry, we saved your progress!</p>
          
          <p>Your pet's spot on our artist's easel is reserved for a limited time.</p>

          <div style="text-align: center; margin: 30px 0;">
             <a href="${recoveryLink}" style="background-color: #6d28d9; color: white; padding: 15px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block;">Resume Your Order</a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
          <p style="font-size: 12px; color: #666;">Eterna Portrait Concierge</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send abandoned cart email:', error);
  }
}
