
"use client";
import React from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  type ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";
import { useToast } from "@/hooks/use-toast";

interface PayPalButtonProps {
  amount: number;
  currency?: string;
  onSuccess?: (paypalOrderId: string) => void;
  onError?: (err: any) => void;
  disabled?: boolean;
}

export default function PayPalButton({
  amount,
  currency = "USD",
  onSuccess,
  onError,
  disabled = false,
}: PayPalButtonProps) {
  const { toast } = useToast();
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!paypalClientId || paypalClientId === "YOUR_PAYPAL_CLIENT_ID") {
    const errorMsg = "PayPal Client ID is not configured.";
    console.error(errorMsg);
    return <p className="text-destructive text-center font-medium">{errorMsg}</p>;
  }

  const initialOptions: ReactPayPalScriptOptions = {
    clientId: paypalClientId,
    currency: currency.toUpperCase(),
    intent: "capture",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={{ layout: "vertical", shape: "pill", color: "gold", label: "pay" }}
        disabled={disabled}
        forceReRender={[amount, currency, disabled]}
        createOrder={async (data, actions) => {
          try {
            const orderId = await actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount.toFixed(2),
                    currency_code: currency.toUpperCase(),
                  },
                },
              ],
              intent: "CAPTURE"
            });
            return orderId;
          } catch (error) {
            console.error("PayPal createOrder error:", error);
            toast({
              variant: "destructive",
              title: "PayPal Error",
              description: "Could not initiate payment. Please try again.",
            });
            if (onError) onError(error);
            return Promise.reject(error);
          }
        }}
        onApprove={async (data, actions) => {
          try {
            if (!actions.order) {
              throw new Error("PayPal actions.order is not available.");
            }
            const details = await actions.order.capture();
            if (onSuccess) {
              onSuccess(details.id); // Pass PayPal order ID on success
            }
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
