import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Image from 'next/image';
import { Check, X, Camera, Sun, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'How to Take the Perfect Pet Photo | Photo Guide | Eterna Portrait',
    description: 'Learn how to choose or capture the best photo for your custom pet portrait. Good lighting, eye level, and clarity make all the difference.',
};

export default function PhotoGuidePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-background pt-24 pb-16">
                {/* Hero Section */}
                <section className="px-6 md:px-16 mb-20 text-center">
                    <div className="max-w-4xl mx-auto">
                        <span className="text-primary font-medium tracking-wide uppercase text-sm mb-4 block">The First Step</span>
                        <h1 className="font-headline text-4xl md:text-6xl text-foreground mb-6">
                            Capture the Perfect <span className="italic text-primary">Paw-trait</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Great art starts with a great photo. Don't worry, you don't need a professional camera—just your phone and these simple tips.
                        </p>
                    </div>
                </section>

                {/* The Golden Rules */}
                <section className="px-6 md:px-16 mb-24">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="bg-card p-8 rounded-3xl border border-muted/50 shadow-sm flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                                <Sun size={32} />
                            </div>
                            <h3 className="font-headline text-2xl mb-4">1. Natural Lighting</h3>
                            <p className="text-muted-foreground">
                                Always use soft, natural daylight. Avoid flash (which causes "red-eye") and harsh shadows. Outside on an overcast day is perfect!
                            </p>
                        </div>
                        <div className="bg-card p-8 rounded-3xl border border-muted/50 shadow-sm flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                <Camera size={32} />
                            </div>
                            <h3 className="font-headline text-2xl mb-4">2. Eye Level</h3>
                            <p className="text-muted-foreground">
                                Get down on their level! Photos taken from above can distort proportions. We want to see those soulful eyes directly.
                            </p>
                        </div>
                        <div className="bg-card p-8 rounded-3xl border border-muted/50 shadow-sm flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6">
                                <Info size={32} />
                            </div>
                            <h3 className="font-headline text-2xl mb-4">3. Sharp Focus</h3>
                            <p className="text-muted-foreground">
                                Ensure the fur texture and eyes are sharp. Blurry photos make it hard for our artists to capture the fine details.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Do's and Don'ts */}
                <section className="bg-secondary/20 py-20 px-6 md:px-16 mb-20">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="font-headline text-3xl md:text-4xl text-center mb-16">Examples: The Good & The Bad</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                            {/* The Good */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-green-100 p-2 rounded-full"><Check className="text-green-600" /></div>
                                    <h3 className="text-2xl font-bold text-green-700">Perfect Photos</h3>
                                </div>
                                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-green-500/20">
                                    {/* Placeholder for Good Photo - Using a reliable external placeholder if local not avail, or colored div */}
                                    <div className="w-full h-full bg-gray-200 relative">
                                        <Image
                                            src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=2069&auto=format&fit=crop"
                                            alt="Good example: Clear dog face in natural light"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                <ul className="space-y-3">
                                    <li className="flex gap-3 text-muted-foreground"><Check size={20} className="text-green-600 flex-shrink-0" /> Taken in natural daylight</li>
                                    <li className="flex gap-3 text-muted-foreground"><Check size={20} className="text-green-600 flex-shrink-0" /> Eye-level perspective</li>
                                    <li className="flex gap-3 text-muted-foreground"><Check size={20} className="text-green-600 flex-shrink-0" /> Sharp details (whiskers visible)</li>
                                </ul>
                            </div>

                            {/* The Bad */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-red-100 p-2 rounded-full"><X className="text-red-600" /></div>
                                    <h3 className="text-2xl font-bold text-red-700">Avoid These</h3>
                                </div>
                                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-red-500/20">
                                    <div className="w-full h-full bg-gray-800 relative opacity-70">
                                        <Image
                                            src="https://images.unsplash.com/photo-1535930749574-1399327ce78f?q=80&w=2072&auto=format&fit=crop"
                                            alt="Bad example: blurry or dark"
                                            fill
                                            className="object-cover blur-sm brightness-50"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">Too Dark / Blurry</div>
                                    </div>
                                </div>
                                <ul className="space-y-3">
                                    <li className="flex gap-3 text-muted-foreground"><X size={20} className="text-red-600 flex-shrink-0" /> Flash causing red-eye or harsh shadows</li>
                                    <li className="flex gap-3 text-muted-foreground"><X size={20} className="text-red-600 flex-shrink-0" /> Taken from high above (distorted head)</li>
                                    <li className="flex gap-3 text-muted-foreground"><X size={20} className="text-red-600 flex-shrink-0" /> Blurry or filtered photos (Snapchat filters)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ / Still Unsure */}
                <section className="px-6 md:px-16 text-center max-w-3xl mx-auto">
                    <h2 className="font-headline text-3xl mb-6">Still not sure?</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Our artists are nimble wizards! If we think your photo won't result in a perfect portrait, we'll email you before we start painting to ask for a new one. Your satisfaction is 100% guaranteed.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button asChild size="lg" className="rounded-full text-lg px-8 py-6 shadow-xl shadow-primary/20">
                            <Link href="/order">I Have a Great Photo!</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="rounded-full text-lg px-8 py-6">
                            <Link href="/contact">Email Us a Photo to Check</Link>
                        </Button>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
