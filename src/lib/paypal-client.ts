// /src/lib/paypal-client.ts
import paypal from '@paypal/checkout-server-sdk';

const configureEnvironment = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret || clientId === 'YOUR_PAYPAL_CLIENT_ID' || clientSecret === 'YOUR_PAYPAL_CLIENT_SECRET') {
    throw new Error("PayPal client ID or secret is missing or a placeholder. Check environment variables.");
  }
  
  const environment = process.env.NODE_ENV === 'production'
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);

  return environment;
};

const client = new paypal.core.PayPalHttpClient(configureEnvironment());

export default client;
