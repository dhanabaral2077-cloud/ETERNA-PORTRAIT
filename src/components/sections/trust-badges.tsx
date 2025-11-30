"use client";

import { motion } from "framer-motion";
import { ShieldCheck, RefreshCw, PenTool, Lock } from "lucide-react";

const badges = [
    {
        icon: ShieldCheck,
        title: "100% Satisfaction",
        description: "Love your art or we'll make it right.",
    },
    {
        icon: RefreshCw,
        title: "Unlimited Revisions",
        description: "We work until you are perfectly happy.",
    },
    {
        icon: PenTool,
        title: "Museum Quality",
        description: "Archival inks and premium materials.",
    },
    {
        icon: Lock,
        title: "Secure Checkout",
        description: "256-bit SSL encrypted payment.",
    },
];

export function TrustBadges() {
    return (
        <section className="bg-muted/30 py-12 border-y border-muted">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {badges.map((badge, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center text-center space-y-3"
                        >
                            <div className="p-3 bg-background rounded-full shadow-sm text-primary">
                                <badge.icon size={32} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="font-headline text-lg font-semibold text-foreground">
                                    {badge.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {badge.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
