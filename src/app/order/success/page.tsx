'use client';

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Script from "next/script";

// Extend Window interface for Google API
declare global {
    interface Window {
        gapi?: any;
        renderOptIn?: () => void;
    }
}

interface OrderDetails {
    orderId: string;
    email: string;
    deliveryCountry: string;
    estimatedDeliveryDate: string;
}

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const customerName = searchParams.get('name') || 'Customer';
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [googleApiLoaded, setGoogleApiLoaded] = useState(false);

    // Fetch order details for Google Customer Reviews
    useEffect(() => {
        if (orderId) {
            fetch(`/api/orders/${orderId}`)
                .then(res => res.json())
                .then(data => {
                    if (!data.error) {
                        setOrderDetails(data);
                    }
                })
                .catch(err => console.error('Failed to fetch order details:', err));
        }
    }, [orderId]);

    // Render Google Customer Reviews opt-in widget
    useEffect(() => {
        if (googleApiLoaded && orderDetails && window.gapi) {
            window.gapi.load('surveyoptin', function () {
                window.gapi.surveyoptin.render({
                    // REQUIRED FIELDS
                    "merchant_id": 5699327185,
                    "order_id": orderDetails.orderId,
                    "email": orderDetails.email,
                    "delivery_country": orderDetails.deliveryCountry,
                    "estimated_delivery_date": orderDetails.estimatedDeliveryDate,
                });
            });
        }
    }, [googleApiLoaded, orderDetails]);

    return (
        <>
            {/* Google Platform API Script */}
            <Script
                src="https://apis.google.com/js/platform.js"
                onLoad={() => setGoogleApiLoaded(true)}
                strategy="afterInteractive"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="glass-card text-center p-12 md:p-16 rounded-3xl flex flex-col items-center max-w-2xl mx-auto"
            >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <h2 className="font-headline text-4xl md:text-5xl text-foreground mb-4">Commission Confirmed</h2>
                <p className="text-secondary max-w-md text-lg leading-relaxed">
                    Thank you, {customerName}. We are thrilled to begin crafting your bespoke portrait.
                </p>
                <div className="mt-8 p-6 bg-white/50 rounded-xl border border-white/60 w-full max-w-md">
                    <p className="text-sm text-muted-foreground mb-2">Order Reference</p>
                    <p className="font-mono text-xl text-foreground tracking-widest">
                        #{orderId ? orderId.slice(0, 8) : Date.now().toString().slice(-8)}
                    </p>
                </div>

                {/* Referral Section - Viral Loop */}
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left">
                    <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                        <h3 className="font-headline text-xl mb-2">🎁 Give $10, Get $10</h3>
                        <p className="text-sm text-secondary mb-4">
                            Share your love for Eterna! Refer a friend and you both get $10 off your next masterpiece.
                        </p>
                        <Button variant="outline" className="w-full bg-white/50 border-primary/20 text-primary hover:bg-primary hover:text-white transition-colors" onClick={() => navigator.clipboard.writeText('ETERNA-FRIEND-10')}>
                            Copy Code: ETERNA-FRIEND-10
                        </Button>
                    </div>

                    <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                        <h3 className="font-headline text-xl mb-2 text-orange-800">📸 Join the Gallery</h3>
                        <p className="text-sm text-orange-700/80 mb-4">
                            We feature our favorite portraits on Instagram. Tag us to be featured!
                        </p>
                        <Button variant="outline" asChild className="w-full bg-white/50 border-orange-200 text-orange-700 hover:bg-orange-500 hover:text-white transition-colors">
                            <Link href="https://instagram.com/eter.naportrait" target="_blank">@eter.naportrait</Link>
                        </Button>
                    </div>
                </div>

                <Button asChild className="mt-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg shadow-lg shadow-primary/20">
                    <Link href="/">Return to Gallery</Link>
                </Button>
            </motion.div>
        </>
    );
}

export default function OrderSuccessPage() {
    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <Header />
            <main className="flex-1 py-24 md:py-32">
                <div className="container mx-auto px-4 md:px-6 max-w-6xl">
                    <Suspense fallback={<div className="text-center p-12">Loading...</div>}>
                        <SuccessContent />
                    </Suspense>
                </div>
            </main>
            <Footer />
        </div>
    );
}

