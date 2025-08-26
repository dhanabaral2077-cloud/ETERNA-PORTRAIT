// /emails/OrderConfirmation.tsx
import * as React from 'react';

// NOTE: Remember to set NEXT_PUBLIC_BASE_URL in your Vercel environment variables.
// It should be the full URL of your deployed site. (e.g., https://your-site.vercel.app)

type OrderConfirmationProps = {
  name: string;
  orderId: string;
  style: string;
  format: string;
  size: string;
  petName?: string;
};

export default function OrderConfirmation({ name, orderId, style, format, size, petName }: OrderConfirmationProps) {
  const previewText = `Your Eterna Portraits commission for ${petName || 'your pet'} has begun!`;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your Commission Has Begun</title>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap');
          body {
            margin: 0;
            background-color: #FAF9F7;
          }
          .container {
            padding: 24px;
            font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
            background-color: #FAF9F7;
          }
          .heading {
            font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
            color: #111;
            margin: 0;
            font-size: 28px;
          }
          .accent-line {
            height: 3px;
            width: 56px;
            background-color: #C9A227;
            border-radius: 9999px;
            margin: 12px 0 24px;
          }
          .paragraph {
            color: #555;
            line-height: 1.6;
            font-size: 16px;
          }
          .details {
            color: #555;
            line-height: 1.6;
            font-size: 16px;
            background-color: #FFFFFF;
            border: 1px solid #EAE8E4;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .button {
            display: inline-block;
            margin-top: 16px;
            padding: 12px 24px;
            border-radius: 9999px;
            background-color: #C9A227;
            color: #fff;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            border: 1px solid #b38f1e;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.2);
            transition: all 0.2s ease-in-out;
          }
          .button:hover {
            background-color: #b38f1e;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.2);
          }
          .footer {
            color: #999;
            margin-top: 24px;
            font-size: 14px;
            text-align: center;
          }
        `}</style>
      </head>
      <body>
        <div role="article" aria-roledescription="email" lang="en">
          <div style={{ display: 'none' }}>{previewText}</div>
          <div className="container">
            <h1 className="heading">
              Your Commission Has Begun
            </h1>
            <div className="accent-line" />
            <p className="paragraph">
              Hi {name || "there"},
            </p>
            <p className="paragraph">
              We are honored to begin the journey of immortalizing {petName ? `the wonderful ${petName}` : "your cherished pet"}. Our artists are already filled with inspiration. Please complete your payment to move your commission into the studio queue.
            </p>
            <div className="details">
              <strong>Order Details:</strong><br />
              <span style={{ textTransform: 'capitalize' }}>{style} · {format} {size ? `· ${size}` : ""}</span><br/>
              <strong>Order ID:</strong> {orderId}
            </div>
            <a
              href={`${baseUrl}/order`}
              className="button"
            >
              Complete Your Payment
            </a>
            <p className="footer">
              Eterna Portraits • Hand-Finished Artworks
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}