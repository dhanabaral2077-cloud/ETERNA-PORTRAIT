// =============================================
// File: /components/paypal-button.tsx
// Desc: Drop‑in PayPal checkout button for your order flow
// Usage: <PayPalButton orderId={orderId} amount={199.00} onSuccess={() => ...}/>
// =============================================
"use client";
import {
    PayPalScriptProvider,
    PayPalButtons,
    type ReactPayPalScriptOptions
} from "@paypal/react-paypal-js";
import { useToast } from "@/hooks/use-toast";

interface PayPalButtonProps {
    orderId: string;
    amount: number; // The amount in major units (e.g. 199.00)
    currency?: string;
    onSuccess?: () => void;
    onError?: (err: any) => void;
}

export default function PayPalButton({ orderId, amount, currency = "USD", onSuccess, onError }: PayPalButtonProps) {
    const { toast } = useToast();
    
    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    if (!paypalClientId || paypalClientId === 'YOUR_PAYPAL_CLIENT_ID') {
        const errorMsg = "PayPal Client ID is not configured. Please set NEXT_PUBLIC_PAYPAL_CLIENT_ID in your .env.local file and restart your server.";
        console.error(errorMsg);
        return <p className="text-destructive text-center font-medium">{errorMsg}</p>;
    }
    
    const initialOptions: ReactPayPalScriptOptions = {
        clientId: paypalClientId,
        currency: currency,
        intent: "capture",
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
                            body: JSON.stringify({ orderId, amount, currency }),
                        });
                        const data = await res.json();
                        if (!res.ok) {
                            throw new Error(data.error || "Failed to create PayPal order.");
                        }
                        return data.id; // This is the PayPal Order ID
                    } catch (error) {
                        console.error("PayPal createOrder error:", error);
                        toast({ variant: "destructive", title: "PayPal Error", description: "Could not initiate payment." });
                        if(onError) onError(error);
                        return Promise.reject(error);
                    }
                }}
                onApprove={async (data) => {
                    try {
                        const res = await fetch("/api/paypal/capture-order", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ orderId, paypalOrderId: data.orderID }),
                        });
                        const json = await res.json();
                        if (!res.ok || !json.success) {
                            throw new Error(json.error || "Payment capture failed.");
                        }
                        if(onSuccess) onSuccess();
                    } catch (error) {
                        console.error("PayPal onApprove error:", error);
                        toast({ variant: "destructive", title: "Payment Failed", description: "Your payment could not be processed." });
                         if(onError) onError(error);
                    }
                }}
                onError={(err) => {
                    console.error("PayPal SDK Error:", err);
                    toast({ variant: "destructive", title: "PayPal Error", description: "An unexpected error occurred with PayPal." });
                    if(onError) onError(err);
                }}
            />
        </PayPalScriptProvider>
    );
}
