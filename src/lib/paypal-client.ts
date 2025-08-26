
// /src/lib/paypal-client.ts
import paypal from "@paypal/checkout-server-sdk";

const configureEnvironment = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    // Clear, actionable error if env vars are missing
    throw new Error(
      "PayPal server credentials are missing. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in the environment."
    );
  }

  const environment =
    process.env.NODE_ENV === "production"
      ? new paypal.core.LiveEnvironment(clientId, clientSecret)
      : new paypal.core.SandboxEnvironment(clientId, clientSecret);

  return environment;
};

const client = new paypal.core.PayPalHttpClient(configureEnvironment());

export default client;
