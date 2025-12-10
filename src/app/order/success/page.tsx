'use client';

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const customerName = searchParams.get('name') || 'Customer';

    useEffect(() => {
        // Here you can insert tracking codes if needed in the future
        // e.g., gtag('event', 'conversion', ...)
    }, []);

    return (
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
            <Button asChild className="mt-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg">
                <Link href="/">Return to Gallery</Link>
            </Button>
        </motion.div>
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
