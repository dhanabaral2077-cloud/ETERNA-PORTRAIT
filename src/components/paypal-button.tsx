// =============================================
// File: /components/paypal/PayPalButton.tsx
// Desc: Drop‑in PayPal checkout button for your order flow
// Usage: <PayPalButton orderId={orderId} amount={199.00} onSuccess={() => ...}/>
// =============================================
"use client";
import { useEffect, useRef, useState } from "react";
import Script from 'next/script';

interface PayPalButtonProps {
  orderId: string;
  amount: number; // The amount in major units (e.g. 199.00)
  currency?: string;
  className?: string;
  onSuccess?: () => void;
  onError?: (err: any) => void;
}

export default function PayPalButton({ orderId, amount, currency = "USD", className, onSuccess, onError }: PayPalButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    // @ts-ignore
    if (!sdkReady || !window.paypal || !containerRef.current) {
      return;
    }

    // Clear the container to avoid re-rendering issues
    containerRef.current.innerHTML = '';

    // @ts-ignore
    const buttons = window.paypal.Buttons({
      style: { layout: "vertical", shape: "pill", color: "gold", label: "pay" },
      createOrder: async () => {
        try {
          const res = await fetch("/api/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, amount, currency }),
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || "Failed to create PayPal order.");
          }
          return data.id; // This is the PayPal order ID
        } catch (error) {
          console.error("PayPal createOrder error:", error);
          if (onError) onError(error);
          return Promise.reject(error);
        }
      },
      onApprove: async (data: { orderID: string }) => {
        try {
          const res = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, paypalOrderId: data.orderID }),
          });
          const json = await res.json();
          if (!res.ok || !json.success) {
            throw new Error(json.error || "Failed to capture payment.");
          }
          if (onSuccess) onSuccess();
        } catch (error) {
          console.error("PayPal onApprove error:", error);
          if (onError) onError(error);
        }
      },
      onError: (err: any) => {
        console.error("PayPal SDK Error:", err);
        if (onError) onError(err);
      },
    });

    buttons.render(containerRef.current).catch((err: any) => {
      console.error("Failed to render PayPal Buttons:", err);
      if (onError) onError(err);
    });

  }, [sdkReady, orderId, amount, currency, onSuccess, onError]);

  return (
    <>
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=${currency}`}
        onLoad={() => setSdkReady(true)}
        strategy="afterInteractive"
      />
      <div ref={containerRef} className={className} />
    </>
  );
}
