// =============================================
// File: /components/paypal/PayPalButton.tsx
// Desc: Drop‑in PayPal checkout button for your order flow
// Usage: <PayPalButton orderId={orderId} amount={199} currency="USD" onSuccess={() => ...}/>
// =============================================
"use client";
import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useToast } from "@/hooks/use-toast";

interface PayPalButtonProps {
  orderId: string;         // your internal order id (from Supabase)
  priceCents: number;      // amount in cents
  currency?: string;       // default "USD"
  className?: string;
  onSuccess?: () => void;  // called after capture succeeds
  onError?: (err: any) => void;
}

export default function PayPalButton({ orderId, priceCents, currency = "USD", className, onSuccess, onError }: PayPalButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const { toast } = useToast();
  const amount = (priceCents / 100).toFixed(2);

  // Render buttons after SDK loads
  useEffect(() => {
    if (!sdkReady || !containerRef.current) return;
    
    // @ts-ignore
    if (typeof window.paypal === 'undefined') {
        console.error("PayPal SDK not loaded.");
        toast({ variant: "destructive", title: "PayPal Error", description: "Could not connect to PayPal." });
        return;
    };

    // Clear the container to avoid duplicate buttons
    containerRef.current.innerHTML = "";

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
            if (!res.ok) throw new Error(data.error || "Failed to create PayPal order");
            return data.id; // PayPal order id
        } catch (error: any) {
             toast({ variant: "destructive", title: "Payment Error", description: error.message });
             onError?.(error);
        }
      },
      onApprove: async (data: any) => {
        try {
            const res = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, paypalOrderId: data.orderID }),
            });
            const json = await res.json();
            if (!res.ok || !json.success) {
                const errorMessage = json.error || "Failed to finalize payment.";
                toast({ variant: "destructive", title: "Payment Failed", description: errorMessage });
                onError?.(json);
                return;
            }
            onSuccess?.();
        } catch (error: any) {
            toast({ variant: "destructive", title: "Payment Failed", description: error.message });
            onError?.(error);
        }
      },
      onError: (err: any) => {
          toast({ variant: "destructive", title: "PayPal Error", description: "An unexpected error occurred during payment." });
          onError?.(err)
      },
    });

    buttons.render(containerRef.current);

    return () => {
      try { 
        if(containerRef.current) containerRef.current.innerHTML = "";
      } catch(e) {
        console.error("Error clearing PayPal button container", e);
      }
    };
  }, [sdkReady, orderId, amount, currency, onSuccess, onError, toast]);

  return (
    <>
      {/* PayPal SDK */}
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=${currency}`}
        onLoad={() => setSdkReady(true)}
        strategy="afterInteractive"
      />
      <div ref={containerRef} className={className} />
    </>
  );
}