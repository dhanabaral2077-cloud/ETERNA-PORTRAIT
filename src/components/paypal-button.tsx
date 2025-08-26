
'use client';

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  useEffect(() => {
    // PayPal SDK may not be loaded yet.
    if (!window.paypal) {
        toast({ variant: "destructive", title: "PayPal Error", description: "PayPal SDK not loaded." });
        return;
    };

    // The PayPal Buttons are rendered async, so we need to clear the container
    // on re-renders to avoid duplicate buttons.
    const container = document.getElementById("paypal-button");
    if (container) {
      container.innerHTML = "";
    } else {
        console.error("PayPal button container not found.");
        return;
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
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to create PayPal order.");
          }
          const data = await res.json();
          // The response from the server includes the PayPal order ID.
          return data.id;
        } catch (error: any) {
          console.error("Failed to create PayPal order:", error);
          toast({ variant: "destructive", title: "Payment Error", description: error.message || "Could not initiate PayPal Checkout." });
        }
      },
      // Call your server to finalize the transaction
      onApprove: async (data: { orderID: string }) => {
        try {
           const res = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, paypalOrderId: data.orderID }),
          });
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to capture payment.");
          }
          // Redirect to a success page upon successful payment.
          // In a real app, you might want to show a confirmation step first.
          // For now, we'll assume the parent component handles the confirmation step.
          // router.push(`/order/success?orderId=${orderId}`);
          window.location.href = `/order?step=5`; 
        } catch (error: any) {
          console.error("Failed to capture PayPal order:", error);
          toast({ variant: "destructive", title: "Payment Failed", description: error.message || "There was an issue processing your payment." });
        }
      },
       onError: (err: any) => {
        console.error("PayPal button error:", err);
        toast({ variant: "destructive", title: "PayPal Error", description: "An error occurred with the PayPal payment process." });
      },
    }).render("#paypal-button");
  }, [orderId, priceCents, toast]);

  return <div id="paypal-button" />;
}
