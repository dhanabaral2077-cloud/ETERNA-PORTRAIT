import { Metadata } from 'next';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Gift, Clock, Truck, Heart } from 'lucide-react';

export const metadata: Metadata = {
    title: 'The Ultimate Custom Pet Gift | Pet Portrait Gift Cards & Art',
    description: 'Looking for the perfect gift for a dog or cat lover? Give the gift of a custom pet portrait. Available as physical prints or instant digital gift cards for last-minute shoppers.',
    keywords: ['pet portrait gift', 'gift for dog lover', 'custom pet art gift', 'pet memorial gift', 'gift card for pet portrait'],
};

export default function GiftPage() {
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'Can I buy a gift card if I don\'t have a photo of the pet?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! Our Gift Cards are the perfect solution. You purchase the portrait size/style, and the recipient uploads their favorite photo later. It is instant and perfect for last-minute gifts.',
                },
            },
            {
                '@type': 'Question',
                name: 'How long does shipping take for a physical gift?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'We typically design the portrait in 1-2 days. Printing and shipping generally take another 3-6 business days depending on your location. For faster options, choose our Digital Download or Gift Card.',
                },
            },
            {
                '@type': 'Question',
                name: 'Is this a good gift for a grieving pet owner?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Absolutely. Many of our customers create memorial portraits to honor a passed companion. It is a deeply touching and personal gesture that is cherished forever.',
                },
            },
        ],
    };

    return (
        <div className="flex flex-col min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Header />
            <main className="flex-1 bg-background">
                {/* Hero */}
                <section className="relative py-20 md:py-32 overflow-hidden bg-primary/5">
                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="flex-1 text-center md:text-left">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-wider uppercase mb-6">
                                    The #1 Gift for Pet Lovers
                                </span>
                                <h1 className="font-headline text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                                    Give the Gift of a <span className="text-primary">Forever Memory</span>
                                </h1>
                                <p className="text-xl text-muted-foreground mb-8">
                                    Whether it's for a birthday, holiday, or memorial, a custom pet portrait is the most personal and touching gift you can give.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                    <Button asChild size="lg" className="rounded-full text-lg px-8 py-6 shadow-lg">
                                        <Link href="/order?type=gift">
                                            Order a Gift Portrait
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" size="lg" className="rounded-full text-lg px-8 py-6">
                                        <Link href="/#pricing">
                                            View Pricing
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                            <div className="flex-1 relative w-full aspect-square max-w-[500px]">
                                {/* Placeholder for Gift Hero Image */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full animate-pulse blur-3xl opacity-50" />
                                <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 border-4 border-white">
                                    <Image
                                        src="/portfolio/emotional_reaction.png"
                                        alt="Woman joyfully hugging her dog"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why it works */}
                <section className="py-20">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">Why They Will Cry (Happy Tears)</h2>
                            <p className="text-muted-foreground">It's not just a picture. It's their baby, immortalized as art. Here is why it works every time.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-8 rounded-2xl bg-card border border-border shadow-sm text-center hover:shadow-md transition-all">
                                <div className="mx-auto w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
                                    <Heart size={32} fill="currentColor" />
                                </div>
                                <h3 className="font-headline text-xl font-bold mb-3">Deeply Emotional</h3>
                                <p className="text-muted-foreground">It shows you truly know and appreciate the bond they share with their pet.</p>
                            </div>
                            <div className="p-8 rounded-2xl bg-card border border-border shadow-sm text-center hover:shadow-md transition-all">
                                <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-6">
                                    <Clock size={32} />
                                </div>
                                <h3 className="font-headline text-xl font-bold mb-3">Last Minute Friendly</h3>
                                <p className="text-muted-foreground">Don't have a photo? Order a Gift Card instantly. Need it fast? Digital files are ready in 24-48 hours.</p>
                            </div>
                            <div className="p-8 rounded-2xl bg-card border border-border shadow-sm text-center hover:shadow-md transition-all">
                                <div className="mx-auto w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
                                    <Gift size={32} />
                                </div>
                                <h3 className="font-headline text-xl font-bold mb-3">Unique & Personal</h3>
                                <p className="text-muted-foreground">Unlike generic store-bought items, this is one-of-a-kind art made just for them.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ for SEO */}
                <section className="py-20 bg-secondary/5">
                    <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                        <h2 className="font-headline text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            <div className="bg-background p-6 rounded-xl shadow-sm">
                                <h3 className="font-bold text-lg mb-2">Can I buy a gift card if I don't have a photo of the pet?</h3>
                                <p className="text-muted-foreground">Yes! Our Gift Cards are the perfect solution. You purchase the portrait size/style, and the recipient uploads their favorite photo later. It is instant and perfect for last-minute gifts.</p>
                            </div>
                            <div className="bg-background p-6 rounded-xl shadow-sm">
                                <h3 className="font-bold text-lg mb-2">How long does shipping take for a physical gift?</h3>
                                <p className="text-muted-foreground">We typically design the portrait in 1-2 days. Printing and shipping generally take another 3-6 business days depending on your location. For faster options, choose our Digital Download or Gift Card.</p>
                            </div>
                            <div className="bg-background p-6 rounded-xl shadow-sm">
                                <h3 className="font-bold text-lg mb-2">Is this a good gift for a grieving pet owner?</h3>
                                <p className="text-muted-foreground">Absolutely. Many of our customers create memorial portraits to honor a passed companion. It is a deeply touching and personal gesture that is cherished forever.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-20 container mx-auto px-4 md:px-6 text-center">
                    <h2 className="font-headline text-3xl md:text-5xl font-bold mb-8">Make Their Day Unforgettable</h2>
                    <Button asChild size="lg" className="rounded-full text-xl px-10 py-8 shadow-xl hover:scale-105 transition-transform bg-primary text-primary-foreground">
                        <Link href="/#pricing">Start Your Gift Order</Link>
                    </Button>
                    <p className="mt-4 text-muted-foreground text-sm flex items-center justify-center gap-2">
                        <Truck size={14} /> Free global shipping on all canvas orders
                    </p>
                </section>
            </main>
            <Footer />
        </div>
    );
}
