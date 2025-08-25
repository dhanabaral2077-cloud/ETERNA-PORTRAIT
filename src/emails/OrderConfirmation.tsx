// src/emails/OrderConfirmation.tsx
import * as React from 'react';

type OrderConfirmationProps = {
  name: string;
  orderId: string;
  style: string;
  format: string;
  size: string;
  petName?: string;
};

export const OrderConfirmation: React.FC<Readonly<OrderConfirmationProps>> = ({
  name,
  orderId,
  style,
  format,
  size,
  petName,
}) => (
  <div style={container}>
    <h1 style={heading}>Your Commission Has Begun, {name}!</h1>
    <p style={paragraph}>
      Thank you for your order. We are thrilled to begin crafting a timeless portrait for you{petName && ` and ${petName}`}. Below are the details of your commission.
    </p>
    <div style={card}>
      <p><strong>Order ID:</strong> {orderId}</p>
      <p><strong>Style:</strong> {style}</p>
      <p><strong>Format:</strong> {format}</p>
      <p><strong>Size:</strong> {size}</p>
      {petName && <p><strong>Pet's Name:</strong> {petName}</p>}
    </div>
    <p style={paragraph}>
      You will receive another email once your payment is successfully processed. In the meantime, our artists are reviewing your submission.
    </p>
    <p style={footer}>
      Eterna Portraits
    </p>
  </div>
);

export default OrderConfirmation;


// Styles
const container: React.CSSProperties = {
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  padding: '40px',
  backgroundColor: '#f9f9f9',
  color: '#333',
};

const heading: React.CSSProperties = {
  fontSize: '24px',
  color: '#0B0B0C',
};

const paragraph: React.CSSProperties = {
  fontSize: '16px',
  lineHeight: '1.5',
};

const card: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
  textTransform: 'capitalize',
};

const footer: React.CSSProperties = {
  marginTop: '30px',
  fontSize: '14px',
  color: '#888',
};
