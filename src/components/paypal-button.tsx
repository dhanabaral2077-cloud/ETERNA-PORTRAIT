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
    console.log("PayPalButton useEffect triggered", { sdkReady, orderId, amount, currency });
    console.log("Container ref:", containerRef.current);
    // @ts-ignore
    console.log("window.paypal:", window.paypal);
    console.log("Client ID:", process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);

    // @ts-ignore
    if (!sdkReady || !window.paypal || !containerRef.current) {
      console.log("Skipping button render: SDK not ready or container missing");
      return;
    }

    containerRef.current.innerHTML = '';
    console.log("Rendering PayPal button...");

    // @ts-ignore
    const buttons = window.paypal.Buttons({
      style: { layout: "vertical", shape: "pill", color: "gold", label: "pay" },
      createOrder: async () => {
        console.log("Creating PayPal order...");
        try {
          const res = await fetch("/api/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, amount, currency }),
          });
          const data = await res.json();
          console.log("Create order response:", data);
          if (!res.ok) {
            throw new Error(data.error || "Failed to create PayPal order.");
          }
          return data.id;
        } catch (error) {
          console.error("PayPal createOrder error:", error);
          if (onError) onError(error);
          return Promise.reject(error);
        }
      },
      onApprove: async (data: { orderID: string }) => {
        console.log("Capturing PayPal order:", data.orderID);
        try {
          const res = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, paypalOrderId: data.orderID }),
          });
          const json = await res.json();
          console.log("Capture order response:", json);
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
        onLoad={() => {
          console.log("PayPal SDK loaded successfully");
          setSdkReady(true);
        }}
        strategy="afterInteractive"
      />
      <div ref={containerRef} className={className} />
    </>
  );
}