import { Metadata } from 'next';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Download, Clock, Printer, Sparkles, Check } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Instant Custom Pet Art | Digital Download Portraits | Eterna Portrait',
    description: 'Need a thoughtful gift fast? Get a custom hand-illustrated pet portrait delivered digitally in 24-48 hours. Print at home or share online.',
    keywords: ['digital pet portrait', 'last minute pet gift', 'custom pet art download', 'printable pet portrait'],
};

export default function DigitalProductPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-background">
                {/* Hero */}
                <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-primary/5 to-background">
                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="flex-1 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-red-600 font-bold text-sm tracking-wider uppercase mb-6 animate-pulse">
                                    <Clock size={16} /> 24-48 Hour Delivery
                                </div>
                                <h1 className="font-headline text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                                    Too Late to Ship? <br />
                                    <span className="text-primary">Print it Yourself.</span>
                                </h1>
                                <p className="text-xl text-muted-foreground mb-8 text-balance">
                                    Get a museum-quality custom portrait delivered to your inbox. Print it locally, frame it, and be the hero of the holiday.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                    <Button asChild size="lg" className="rounded-full text-lg px-8 py-6 shadow-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
                                        <Link href="/order?style=digital">
                                            Start Digital Order
                                        </Link>
                                    </Button>
                                    <p className="text-sm text-muted-foreground self-center">
                                        Use code <strong>INSTANT20</strong> for 20% off
                                    </p>
                                </div>
                            </div>
                            <div className="flex-1 relative w-full aspect-square max-w-[500px]">
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl opacity-30" />
                                <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50 transform md:rotate-2 hover:rotate-0 transition-transform duration-500">
                                    <Image
                                        src="/portfolio/Brenden Dog3.png"
                                        alt="Digital Pet Portrait Example on Tablet"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    {/* Overlay Badge */}
                                    <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-border">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-green-100 p-2 rounded-full text-green-600">
                                                <Download size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">High-Res File</p>
                                                <p className="text-xs text-muted-foreground">300 DPI • Print Ready</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits Grid */}
                <section className="py-20 bg-card">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="font-headline text-3xl font-bold mb-4">The "Saved the Day" Solution</h2>
                            <p className="text-muted-foreground">Why digital portraits are the smart choice for late shoppers.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-8 rounded-2xl bg-background border border-border shadow-sm hover:shadow-md transition-all">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                                    <Clock size={24} />
                                </div>
                                <h3 className="font-bold text-xl mb-3">Instant Turnaround</h3>
                                <p className="text-muted-foreground">Skip the shipping times. We illustrate and email your file within 48 hours (often sooner).</p>
                            </div>
                            <div className="p-8 rounded-2xl bg-background border border-border shadow-sm hover:shadow-md transition-all">
                                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-6">
                                    <Printer size={24} />
                                </div>
                                <h3 className="font-bold text-xl mb-3">Print Anywhere</h3>
                                <p className="text-muted-foreground">You own the high-resolution file. Print it on canvas, a mug, a card, or just keep it as a phone wallpaper.</p>
                            </div>
                            <div className="p-8 rounded-2xl bg-background border border-border shadow-sm hover:shadow-md transition-all">
                                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-6">
                                    <Sparkles size={24} />
                                </div>
                                <h3 className="font-bold text-xl mb-3">Same Premium Quality</h3>
                                <p className="text-muted-foreground">It's the exact same hand-drawn art we use for our physical canvases, just delivered faster.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What's Included */}
                <section className="py-20">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex flex-col md:flex-row items-center gap-16 bg-secondary/5 rounded-3xl p-8 md:p-12 border border-border">
                            <div className="flex-1 space-y-8">
                                <h2 className="font-headline text-3xl md:text-4xl font-bold">What You Receive</h2>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-3 text-lg">
                                        <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                        <span><strong>High-Resolution JPG & PNG</strong> (4000x5000px+)</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-lg">
                                        <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                        <span><strong>Print Release</strong> (Print unlimited copies)</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-lg">
                                        <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                        <span><strong>Unlimited Revisions</strong> until you love it</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-lg">
                                        <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                        <span><strong>Social Media optimized version</strong> included</span>
                                    </li>
                                </ul>
                                <Button asChild size="lg" className="w-full md:w-auto rounded-full text-lg px-8">
                                    <Link href="/order?style=digital">
                                        Get Yours Now
                                    </Link>
                                </Button>
                            </div>
                            <div className="flex-1 w-full relative h-[400px] md:h-[500px]">
                                <Image
                                    src="/portfolio/The_Craftsman_Hero.png"
                                    alt="Digital Art Usage Examples"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-primary text-primary-foreground text-center">
                    <div className="container mx-auto px-4">
                        <h2 className="font-headline text-3xl md:text-5xl font-bold mb-6">Ready in time for the Holidays?</h2>
                        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                            Yes! Order today and receive your digital proof within 48 hours. It's the perfect last-minute save.
                        </p>
                        <Button asChild size="lg" variant="secondary" className="rounded-full text-xl px-12 py-8 bg-background text-foreground hover:bg-white/90">
                            <Link href="/order?style=digital">
                                Order Digital Portrait
                            </Link>
                        </Button>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
