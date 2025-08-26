// =============================================
// File: /components/paypal/PayPalButton.tsx
// Desc: Drop‑in PayPal checkout button for your order flow
// Usage: <PayPalButton orderId={orderId} priceCents={19900} onSuccess={() => ...}/>
// =============================================
"use client";
import { useEffect, useRef } from "react";
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
  const { toast } = useToast();
  const amount = (priceCents / 100).toFixed(2);

  // Render buttons after SDK loads
  useEffect(() => {
    // @ts-ignore
    if (typeof window.paypal === 'undefined' || !containerRef.current) {
        // SDK might not be loaded yet, or container isn't rendered.
        // The script tag in the root layout will trigger a re-render when it loads.
        return;
    };

    // Clear the container to avoid duplicate buttons
    try {
        if(containerRef.current) containerRef.current.innerHTML = "";
    } catch (e) {
        console.warn("Error clearing PayPal button container", e);
    }


    // @ts-ignore
    window.paypal.Buttons({
      style: { layout: "vertical", shape: "pill", color: "gold", label: "pay" },
      createOrder: async () => {
        try {
            const res = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, amount: parseFloat(amount), currency }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to create PayPal order");
            return data.id; // PayPal order id
        } catch (error: any) {
             console.error("PayPal createOrder error:", error);
             toast({ variant: "destructive", title: "Payment Error", description: error.message });
             if (onError) onError(error);
             return Promise.reject(error);
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
                if (onError) onError(json);
                return Promise.reject(json);
            }
            if (onSuccess) onSuccess();
        } catch (error: any) {
            console.error("PayPal onApprove error:", error);
            toast({ variant: "destructive", title: "Payment Failed", description: error.message });
            if (onError) onError(error);
            return Promise.reject(error);
        }
      },
      onError: (err: any) => {
          console.error("PayPal SDK Error:", err);
          toast({ variant: "destructive", title: "PayPal Error", description: "An unexpected error occurred during payment." });
          if (onError) onError(err)
      },
    }).render(containerRef.current).catch((err: any) => {
        console.error("Failed to render PayPal buttons", err);
        toast({ variant: "destructive", title: "PayPal Render Error", description: "Could not display PayPal buttons." });
    });


  }, [orderId, amount, currency, onSuccess, onError, toast]);

  return (
      <div ref={containerRef} className={className} />
  );
}
