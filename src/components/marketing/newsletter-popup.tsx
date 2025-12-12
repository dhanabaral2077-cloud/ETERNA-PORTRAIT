'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export function NewsletterPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        // Check if user has already subscribed or dismissed
        const hasSeen = localStorage.getItem('eterna_newsletter_seen');
        if (hasSeen) return;

        // Timer: Show after 15 seconds
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 15000);

        // Exit Intent: Show if mouse leaves window (Desktop only)
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0) {
                setIsOpen(true);
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    const handleDismiss = () => {
        setIsOpen(false);
        // Don't show again for 7 days
        localStorage.setItem('eterna_newsletter_seen', new Date().toISOString());
    };

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) throw new Error("Subscription failed");

            toast({
                title: "Welcome to the Family! 🎨",
                description: "Your 10% discount code: WELCOME10",
            });

            localStorage.setItem('eterna_newsletter_subscribed', 'true');
            localStorage.setItem('eterna_newsletter_seen', 'true');
            setIsOpen(false);
        } catch (error) {
            toast({ variant: "destructive", title: "Uh oh!", description: "Something went wrong. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-white/20"
                    >
                        {/* Decorative Background */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent" />

                        <button
                            onClick={handleDismiss}
                            className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full transition-colors z-10"
                        >
                            <X size={18} className="text-muted-foreground" />
                        </button>

                        <div className="p-8 pt-10 text-center relative z-0">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                                <Sparkles size={32} />
                            </div>

                            <h2 className="font-headline text-3xl mb-3">Join the Eterna Club</h2>
                            <p className="text-secondary mb-8 leading-relaxed">
                                Get <span className="font-bold text-primary">10% OFF</span> your first custom portrait and receive exclusive art tips.
                            </p>

                            <form onSubmit={handleSubscribe} className="space-y-4">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="h-12 rounded-xl bg-muted/30 border-muted-foreground/20 text-center text-lg"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Button
                                    type="submit"
                                    className="w-full h-12 rounded-xl text-lg font-medium shadow-lg hover:shadow-primary/25 transition-all"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Unlocking...' : 'Unlock My 10% Off'}
                                </Button>
                            </form>

                            <p className="text-xs text-muted-foreground mt-4">
                                No spam. Unsubscribe anytime.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
