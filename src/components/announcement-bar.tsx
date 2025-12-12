'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Campaign {
    top_bar_active: boolean;
    top_bar_text: string;
    top_bar_link?: string;
}

export function AnnouncementBar() {
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const res = await fetch('/api/marketing/campaign');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.top_bar_active) {
                        setCampaign(data);
                        setIsVisible(true);
                    }
                }
            } catch (error) {
                console.error("Failed to load announcement bar", error);
            }
        };

        fetchCampaign();
    }, []);

    if (!isVisible || !campaign) return null;

    const Content = () => (
        <div className="flex items-center justify-center gap-2 text-sm font-medium tracking-wide">
            <span>{campaign.top_bar_text}</span>
            {campaign.top_bar_link && <ArrowRight size={14} className="animate-pulse" />}
        </div>
    );

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-primary text-primary-foreground relative z-50"
                >
                    <div className="bg-primary px-4 py-3 text-white">
                        <p className="text-center text-xs font-medium md:text-sm">
                            🎄 <strong>Under the Tree Guarantee:</strong> Order by Dec 15 for Christmas Delivery! <Link href="/order" className="underline hover:text-white/90 ml-2">Order Now</Link>
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
