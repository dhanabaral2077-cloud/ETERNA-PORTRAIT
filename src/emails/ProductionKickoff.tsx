// /emails/ProductionKickoff.tsx
import * as React from 'react';

type ProductionKickoffProps = {
  name: string;
  orderId: string;
};

export default function ProductionKickoff({ name, orderId }: ProductionKickoffProps) {
  const previewText = `Let the artistry begin! We're starting on your pet's portrait.`;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your Artwork is Beginning!</title>
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
              We’re Starting Your Artwork
            </h1>
            <div className="accent-line" />
            <p className="paragraph">
              Dear {name || "there"},
            </p>
            <p className="paragraph">
              Wonderful news! Your payment has been confirmed, and your commission is now moving into the studio queue. Our artists are excited to begin.
            </p>
             <p className="paragraph">
              We’ll send another update as it progresses through sketch → painting → finishing.
            </p>
            <div className="details">
              <strong>Order ID:</strong> {orderId}
            </div>
            <p className="footer">
              Eterna Portraits • Where Memories Become Masterpieces
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}