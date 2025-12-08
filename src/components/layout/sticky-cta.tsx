"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Gift, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
    id: string;
    title: string;
    discount_code: string;
    discount_percent: number;
    is_active: boolean;
}

export function StickyCTA() {
    const [isVisible, setIsVisible] = useState(false);
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        // Check if previously dismissed
        const dismissed = localStorage.getItem("sticky_cta_dismissed");
        if (dismissed) {
            const dismissedTime = new Date(dismissed).getTime();
            const now = new Date().getTime();
            // Show again after 24 hours
            if (now - dismissedTime < 24 * 60 * 60 * 1000) {
                return;
            }
        }

        // Fetch campaign
        const fetchCampaign = async () => {
            try {
                const res = await fetch("/api/marketing/campaign");
                const data = await res.json();
                if (data) {
                    setCampaign(data);
                    // Small delay before showing
                    setTimeout(() => setIsVisible(true), 2000);
                }
            } catch (error) {
                console.error("Failed to fetch campaign for StickyCTA", error);
            }
        };

        fetchCampaign();
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem("sticky_cta_dismissed", new Date().toISOString());
    };

    const handleCopy = () => {
        if (campaign?.discount_code) {
            navigator.clipboard.writeText(campaign.discount_code);
            setCopied(true);
            toast({
                title: "Code Copied!",
                description: "Use it at checkout.",
            });
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!campaign) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl z-40"
                >
                    <div className="bg-foreground text-background rounded-full shadow-2xl p-2 pr-4 flex items-center justify-between border border-white/10 backdrop-blur-md bg-opacity-95">
                        <div className="flex items-center gap-4 pl-2">
                            <div className="bg-primary/20 p-2 rounded-full text-primary">
                                <Gift size={20} />
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                <span className="font-bold text-sm md:text-base">
                                    {campaign.title}
                                </span>
                                <span className="hidden md:inline text-muted-foreground">•</span>
                                <span className="text-xs md:text-sm text-primary font-medium">
                                    Use code <span className="font-mono tracking-wider">{campaign.discount_code}</span> for {campaign.discount_percent}% off
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={handleCopy}
                                className="rounded-full h-9 px-4 text-xs font-bold uppercase tracking-wider"
                            >
                                {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                                {copied ? "Copied" : "Copy"}
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={handleDismiss}
                                className="text-muted-foreground hover:text-white rounded-full h-8 w-8"
                            >
                                <X size={16} />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
