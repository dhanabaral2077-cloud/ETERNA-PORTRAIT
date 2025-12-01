'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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
                    setTimeout(() => setIsOpen(true), 2000);
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
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    />

                    {/* Popup Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-4"
                    >
                        <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl p-8 text-center">

                            {/* Close Button */}
                            <button
                                onClick={handleDismiss}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors text-muted-foreground"
                            >
                                <X size={20} />
                            </button>

                            {/* Decorative Background Gradient */}
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/20 to-transparent -z-10" />

                            {/* Content */}
                            <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                                    <span className="text-2xl font-bold">{campaign.discount_percent}%</span>
                                </div>

                                <h2 className="font-headline text-3xl mb-3 text-foreground">
                                    {campaign.title}
                                </h2>

                                <p className="text-secondary mb-8 leading-relaxed">
                                    {campaign.description}
                                </p>

                                {/* Discount Code Box */}
                                <div
                                    onClick={handleCopyCode}
                                    className="group relative flex items-center justify-between bg-white border-2 border-dashed border-primary/30 rounded-xl p-4 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all mb-6"
                                >
                                    <div className="text-left">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Discount Code</p>
                                        <p className="text-xl font-mono font-bold text-primary">{campaign.discount_code}</p>
                                    </div>
                                    <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                                        {copied ? <Check size={20} /> : <Copy size={20} />}
                                    </div>
                                </div>

                                <Button
                                    onClick={handleDismiss}
                                    className="w-full rounded-full py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                                >
                                    Got it, thanks!
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
