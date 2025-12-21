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
    image_url?: string;
    delay_seconds?: number;
}

export function MarketingPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [copied, setCopied] = useState(false);
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasSubscribed, setHasSubscribed] = useState(false);
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
                const res = await fetch('/api/marketing/campaign', { cache: 'no-store' });
                if (!res.ok) return;

                const data = await res.json();

                if (data && data.is_active) {
                    setCampaign(data);
                    // Use dynamic delay or default to 3 seconds
                    const delay = (data.delay_seconds || 3) * 1000;
                    setTimeout(() => setIsOpen(true), delay);
                }
            } catch (error) {
                console.error("Failed to load marketing campaign", error);
            }
        };

        checkCampaign();
    }, []);

    useEffect(() => {
        // Exit Intent: Show if mouse leaves window (Desktop only)
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && campaign && campaign.is_active && !isOpen) {
                // Check dismissal again to be safe
                const dismissedAt = localStorage.getItem('marketing_popup_dismissed');
                if (dismissedAt) {
                    const dismissedTime = new Date(dismissedAt).getTime();
                    const now = new Date().getTime();
                    if ((now - dismissedTime) / (1000 * 60 * 60) < 24) return;
                }
                setIsOpen(true);
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, [campaign, isOpen]);

    const handleDismiss = () => {
        setIsOpen(false);
        localStorage.setItem('marketing_popup_dismissed', new Date().toISOString());
    };

    const handleSubscribe = async () => {
        if (!email || !email.includes('@')) {
            toast({ title: "Please enter a valid email", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                body: JSON.stringify({ email }),
            });
            // Even if it fails (e.g. duplicate), we show success to not block the user
            setHasSubscribed(true);
            toast({ title: "Thanks for subscribing!", description: "Here is your discount code." });
        } catch (error) {
            console.error(error);
            setHasSubscribed(true); // Fallback
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopyCode = () => {
        if (!campaign?.discount_code) return;
        navigator.clipboard.writeText(campaign.discount_code);
        setCopied(true);
        toast({
            title: "Code Copied! 📋",
            description: "We also emailed this to you! Keep an eye on your inbox for future VIP gifts. 🎁",
        });
        setTimeout(() => setCopied(false), 2000);
    };

    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

    if (!campaign || pathname.startsWith('/admin')) return null;

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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
                    />

                    {/* Popup Container - Flexbox Centering */}
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-4xl pointer-events-auto"
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
                                        src={campaign.image_url || "/popup-pet.png"}
                                        alt="Campaign visual"
                                        fill={true}
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

                                        {!hasSubscribed ? (
                                            <div className="space-y-4">
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    Enter your email to unlock your {campaign.discount_percent}% discount code.
                                                </p>
                                                <div className="space-y-2">
                                                    <input
                                                        type="email"
                                                        placeholder="your@email.com"
                                                        className="w-full px-4 py-3 rounded-lg border border-input focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                    <Button
                                                        onClick={handleSubscribe}
                                                        disabled={isSubmitting}
                                                        className="w-full py-6 text-lg rounded-full"
                                                    >
                                                        {isSubmitting ? "Unlocking..." : "Unlock Discount"}
                                                    </Button>
                                                </div>
                                                <p className="text-xs text-center text-muted-foreground pt-2">
                                                    We respect your inbox. No spam.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                {/* Discount Code Box */}
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
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
                                                </motion.div>

                                                <Button
                                                    onClick={handleDismiss}
                                                    className="w-full rounded-full py-7 text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all bg-primary text-primary-foreground"
                                                >
                                                    Start Shopping
                                                </Button>

                                                <p className="text-xs text-center text-muted-foreground">
                                                    We've also sent this code to <span className="font-medium text-foreground">{email}</span> so you don't lose it!
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
