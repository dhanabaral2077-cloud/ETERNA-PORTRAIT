'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface Campaign {
    is_active: boolean;
    title: string;
    description: string;
    discount_code: string;
    discount_percent: number;
}

export function MarketingPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const checkCampaign = async () => {
            try {
                // 1. Check if recently dismissed (e.g., within 24 hours)
                const dismissedAt = localStorage.getItem('marketing_popup_dismissed');
                if (dismissedAt) {
                    const dismissedTime = new Date(dismissedAt).getTime();
                    const now = new Date().getTime();
                    const hoursSinceDismissal = (now - dismissedTime) / (1000 * 60 * 60);

                    // If dismissed less than 24 hours ago, don't show
                    if (hoursSinceDismissal < 24) return;
                }

                // 2. Fetch active campaign
                const res = await fetch('/api/marketing/campaign');
                if (!res.ok) return;

                const data = await res.json();

                if (data && data.is_active) {
                    setCampaign(data);
                    // Small delay before showing to not overwhelm user immediately
                    setTimeout(() => setIsOpen(true), 3000);
                }
            } catch (error) {
                console.error("Failed to load marketing campaign", error);
            }
        };

        checkCampaign();
    }, []);

    const handleDismiss = () => {
        setIsOpen(false);
        localStorage.setItem('marketing_popup_dismissed', new Date().toISOString());
    };

    const handleCopyCode = () => {
        if (!campaign?.discount_code) return;
        navigator.clipboard.writeText(campaign.discount_code);
        setCopied(true);
        toast({
            title: "Code Copied!",
            description: "Use it at checkout for your discount.",
        });
        setTimeout(() => setCopied(false), 2000);
    };

    if (!campaign) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleDismiss}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Popup Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-4xl px-4"
                    >
                        <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col md:flex-row max-h-[85vh] md:max-h-[600px]">

                            {/* Close Button */}
                            <button
                                onClick={handleDismiss}
                                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-black/10 backdrop-blur-md transition-colors text-foreground"
                            >
                                <X size={20} />
                            </button>

                            {/* Left Side: Image */}
                            <div className="relative w-full md:w-1/2 h-48 md:h-auto bg-muted">
                                <Image
                                    src="/popup-pet.png"
                                    alt="Cute puppy portrait"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/10" />
                                <div className="absolute bottom-4 left-4 text-white md:hidden">
                                    <p className="font-headline text-2xl drop-shadow-md">{campaign.title}</p>
                                </div>
                            </div>

                            {/* Right Side: Content */}
                            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
                                {/* Decorative Elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10" />

                                <motion.div
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="hidden md:flex items-center gap-3 mb-6">
                                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase">
                                            Limited Time Offer
                                        </span>
                                    </div>

                                    <h2 className="hidden md:block font-headline text-4xl mb-4 text-foreground">
                                        {campaign.title}
                                    </h2>

                                    <p className="text-secondary text-lg mb-8 leading-relaxed">
                                        {campaign.description}
                                    </p>

                                    <div className="space-y-6">
                                        {/* Discount Code Box */}
                                        <div
                                            onClick={handleCopyCode}
                                            className="group relative flex items-center justify-between bg-secondary/5 border-2 border-dashed border-primary/30 rounded-xl p-5 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                                        >
                                            <div className="text-left">
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Use Code at Checkout</p>
                                                <p className="text-2xl font-mono font-bold text-primary tracking-wide">{campaign.discount_code}</p>
                                            </div>
                                            <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform text-primary">
                                                {copied ? <Check size={20} /> : <Copy size={20} />}
                                            </div>
                                        </div>

                                        <Button
                                            onClick={handleDismiss}
                                            className="w-full rounded-full py-7 text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all bg-primary text-primary-foreground"
                                        >
                                            Claim My {campaign.discount_percent}% Off
                                        </Button>

                                        <p className="text-center text-xs text-muted-foreground">
                                            *Valid for first-time customers only.
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
