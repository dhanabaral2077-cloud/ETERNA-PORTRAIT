// /src/lib/paypal-client.ts
import paypal from '@paypal/checkout-server-sdk';

const configureEnvironment = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret || clientId === 'AfKhNNhb1354EtlPPaOXNYM4q4e9WRS3neGrhBRfsrK73pTYVA3TqfxG9UB9q7axpiWK30j-qejQWTlx' || clientSecret === 'EAkcAjM_D_L0x6tcb37nrMH4m2qp7TqqNb4-5FLr-NoAgtS61BHTD5opTiUrUj6aQXxPG7wHZYHDOqqs') {
    throw new Error("PayPal client ID or secret is missing or a placeholder. Check environment variables.");
  }
  
  const environment = process.env.NODE_ENV === 'production'
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);

  return environment;
};

const client = new paypal.core.PayPalHttpClient(configureEnvironment());

export default client;
