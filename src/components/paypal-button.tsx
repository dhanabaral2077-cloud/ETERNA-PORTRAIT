
'use client';

import { useEffect } from "react";

// This is a workaround for the paypal object not being available on the window object
// in TypeScript. We declare it here so we can use it without getting errors.
declare global {
  interface Window {
    paypal: any;
  }
}

type PayPalButtonProps = {
  orderId: string;
  priceCents: number;
};

export default function PayPalButton({ orderId, priceCents }: PayPalButtonProps) {
  useEffect(() => {
    // PayPal SDK may not be loaded yet.
    if (!window.paypal) return;

    // The PayPal Buttons are rendered async, so we need to clear the container
    // on re-renders to avoid duplicate buttons.
    const container = document.getElementById("paypal-button");
    if (container) {
      container.innerHTML = "";
    }

    window.paypal.Buttons({
      // Call your server to set up the transaction
      createOrder: async () => {
        try {
          const res = await fetch("/api/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // The amount is in cents, so we divide by 100 to get dollars.
            body: JSON.stringify({ orderId, amount: priceCents / 100 }),
          });
          const data = await res.json();
          // The response from the server includes the PayPal order ID.
          return data.id;
        } catch (error) {
          console.error("Failed to create PayPal order:", error);
          // You can show an error message to the user here.
          alert("Could not initiate PayPal Checkout.");
        }
      },
      // Call your server to finalize the transaction
      onApprove: async (data: { orderID: string }) => {
        try {
           await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, paypalOrderId: data.orderID }),
          });
          // Redirect to a success page upon successful payment.
          window.location.href = `/success?order=${orderId}`;
        } catch (error) {
          console.error("Failed to capture PayPal order:", error);
          // You can show an error message to the user here.
          alert("There was an issue processing your payment.");
        }
      },
       onError: (err: any) => {
        console.error("PayPal button error:", err);
        // You can show an error message to the user here.
        alert("An error occurred with the PayPal payment process.");
      },
    }).render("#paypal-button");
  }, [orderId, priceCents]);

  return <div id="paypal-button" />;
}
