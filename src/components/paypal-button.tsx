
"use client";
import React from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  type ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";
import { useToast } from "@/hooks/use-toast";

interface PayPalButtonProps {
  orderId: string;
  amount: number; // The amount in major units (e.g. 199.00)
  currency?: string;
  onSuccess?: () => void;
  onError?: (err: any) => void;
}

export default function PayPalButton({
  orderId,
  amount,
  currency = "USD",
  onSuccess,
  onError,
}: PayPalButtonProps) {
  const { toast } = useToast();

  // Use the public client id environment variable (may be undefined in dev if not set)
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  // Basic client-side validations
  if (!paypalClientId || paypalClientId === "YOUR_PAYPAL_CLIENT_ID") {
    const errorMsg =
      "PayPal Client ID is not configured. Please set NEXT_PUBLIC_PAYPAL_CLIENT_ID and restart the server.";
    console.error(errorMsg);
    return (
      <p className="text-destructive text-center font-medium">{errorMsg}</p>
    );
  }

  if (!orderId) {
    const errorMsg = "Missing orderId for PayPal payment.";
    console.error(errorMsg);
    return (
      <p className="text-destructive text-center font-medium">{errorMsg}</p>
    );
  }

  if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
    const errorMsg = "Invalid payment amount for PayPal.";
    console.error(errorMsg, amount);
    return (
      <p className="text-destructive text-center font-medium">{errorMsg}</p>
    );
  }

  const normalizedCurrency =
    typeof currency === "string" && currency.length === 3
      ? currency.toUpperCase()
      : "USD";

  const initialOptions: ReactPayPalScriptOptions = {
    clientId: paypalClientId,
    currency: normalizedCurrency,
    intent: "capture",
    // components: "buttons", // react-paypal-js will load buttons by default; leave commented for clarity
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={{ layout: "vertical", shape: "pill", color: "gold", label: "pay" }}
        createOrder={async () => {
          try {
            const res = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId,
                amount,
                currency: normalizedCurrency,
              }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
              const errMsg = data?.error || "Failed to create PayPal order.";
              throw new Error(errMsg);
            }

            if (!data?.id) {
              throw new Error("PayPal create-order returned unexpected response.");
            }

            return data.id; // PayPal order ID
          } catch (error) {
            console.error("PayPal createOrder error:", error);
            toast({
              variant: "destructive",
              title: "PayPal Error",
              description: "Could not initiate payment. Please try again.",
            });
            if (onError) onError(error);
            // Return a rejected promise so PayPal buttons know createOrder failed
            return Promise.reject(error);
          }
        }}
        onApprove={async (data) => {
          try {
            // data.orderID is expected from the PayPal SDK
            const paypalOrderId = (data as any)?.orderID;
            if (!paypalOrderId) {
              throw new Error("Missing PayPal order ID on approval.");
            }

            const res = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId, paypalOrderId }),
            });

            const json = await res.json().catch(() => ({}));

            if (!res.ok || !json?.success) {
              const errMsg = json?.error || "Payment capture failed.";
              throw new Error(errMsg);
            }

            if (onSuccess) onSuccess();
          } catch (error) {
            console.error("PayPal onApprove error:", error);
            toast({
              variant: "destructive",
              title: "Payment Failed",
              description: "Your payment could not be processed. Please contact support.",
            });
            if (onError) onError(error);
          }
        }}
        onError={(err) => {
          console.error("PayPal SDK Error:", err);
          toast({
            variant: "destructive",
            title: "PayPal Error",
            description: "An unexpected error occurred with PayPal.",
          });
          if (onError) onError(err);
        }}
      />
    </PayPalScriptProvider>
  );
}
