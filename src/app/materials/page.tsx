import { Metadata } from 'next';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Museum Quality Pet Portraits | Archival Canvas & Fine Art Paper',
    description: 'Discover our heirloom-quality materials. We use sustainable, FSC-certified wood, museum-grade canvas, and archival fine art paper to ensure your pet portrait lasts a lifetime.',
    keywords: ['museum quality canvas', 'archival pet portrait', 'fine art paper', 'giclee print', 'sustainable art'],
};

export default function MaterialsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-background">
                {/* Hero Section */}
                <section className="relative py-20 md:py-32 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        {/* Abstract Background */}
                        <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10" />
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent" />
                    </div>

                    <div className="container relative z-10 mx-auto px-4 md:px-6">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="font-headline text-4xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
                                Heirloom Quality that Lasts a Lifetime
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                                We believe your pet's portrait should be as timeless as your love for them. That’s why we use only museum-grade materials, sustainable wood, and archival inks.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Canvas Section */}
                <section className="py-16 md:py-24 bg-white/50 dark:bg-zinc-900/50">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
                            <div className="flex-1 relative aspect-[4/3] w-full shadow-2xl rounded-2xl overflow-hidden">
                                {/* Placeholder for Canvas Texture Shot - Replace with actual asset if available */}
                                <div className="absolute inset-0 bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-muted-foreground">
                                    <span className="sr-only">Canvas Texture Detail</span>
                                    <Image
                                        src="/portfolio/Detailed_Oil_Paint_Texture.jpg" // Assuming this exists or using a generic filler
                                        alt="Museum Quality Canvas Texture Detail"
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                    // Fallback image handling could be added here
                                    />
                                </div>
                            </div>
                            <div className="flex-1 space-y-6">
                                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-2">
                                    The Canvas
                                </div>
                                <h2 className="font-headline text-3xl md:text-4xl font-bold">Museum Quality Canvas</h2>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    Our canvas prints are designed to look and feel like a traditional oil painting. We use a heavyweight, coated fabric blend of cotton (30-50%) and polyester for the perfect balance of texture and durability.
                                </p>
                                <ul className="space-y-4 pt-4">
                                    <li className="flex items-start gap-3">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                                        <span><strong>Heavyweight Texture:</strong> 300-350gsm (110-130lb cover) fabric that adds depth and dimension to every brushstroke.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                                        <span><strong>Sustainable Wood:</strong> Stretched over responsible, FSC-certified pine or poplar wood frames.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                                        <span><strong>Built to Last:</strong> 350-400 micron thickness ensures your portrait remains taut and warp-free.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Paper Section */}
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-24">
                            <div className="flex-1 relative aspect-[4/3] w-full shadow-2xl rounded-2xl overflow-hidden order-1 md:order-none">
                                {/* Placeholder for Paper Texture - Replace with actual asset */}
                                <div className="absolute inset-0 bg-stone-100 dark:bg-stone-900 flex items-center justify-center text-muted-foreground">
                                    <span className="sr-only">Fine Art Paper Detail</span>
                                    <Image
                                        src="/portfolio/Watercolor_Paper_Texture.jpg"
                                        alt="Fine Art Matte Paper Texture Detail"
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 space-y-6">
                                <div className="inline-block px-3 py-1 rounded-full bg-secondary/30 text-secondary-foreground text-sm font-semibold mb-2">
                                    The Paper
                                </div>
                                <h2 className="font-headline text-3xl md:text-4xl font-bold">Fine Art Matte Paper</h2>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    For a modern, gallery-style finish, our lighter-weight Fine Art Paper is the perfect choice. It puts the focus purely on the art with a smooth, glare-free finish.
                                </p>
                                <ul className="space-y-4 pt-4">
                                    <li className="flex items-start gap-3">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-secondary shrink-0" />
                                        <span><strong>Museum Grade:</strong> Premium 200gsm enhanced matte paper that feels substantial to the touch.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-secondary shrink-0" />
                                        <span><strong>Archival Quality:</strong> Acid-free and free from optical brighteners (OBAs) to prevent yellowing over decades.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-secondary shrink-0" />
                                        <span><strong>Vibrant Color:</strong> A smooth, uncoated finish that allows colors to pop without distracting reflections.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sustainability & Inks */}
                <section className="py-20 bg-primary/5 md:py-32">
                    <div className="container mx-auto px-4 md:px-6 text-center">
                        <h2 className="font-headline text-3xl md:text-4xl font-bold mb-12">Sustainable & Ethical</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                            {/* Card 1 */}
                            <div className="bg-background p-8 rounded-2xl shadow-sm border border-border/50">
                                <div className="h-12 w-12 mx-auto bg-green-100 p-3 rounded-full text-green-700 mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                                    </svg>
                                </div>
                                <h3 className="font-headline text-xl font-bold mb-3">Global & Local</h3>
                                <p className="text-muted-foreground">
                                    We produce your order in one of 30+ countries closest to you. This reduces shipping distances, slashing carbon emissions by up to 67%.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-background p-8 rounded-2xl shadow-sm border border-border/50">
                                <div className="h-12 w-12 mx-auto bg-blue-100 p-3 rounded-full text-blue-700 mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.048 4.025a3 3 0 01-5.931-1.342m5.931 1.342a2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128m0 0a15.998 15.998 0 003.388-1.62m-5.048 4.025a3 3 0 01-5.931-1.342" />
                                    </svg>
                                </div>
                                <h3 className="font-headline text-xl font-bold mb-3">Archival Inks</h3>
                                <p className="text-muted-foreground">
                                    Our 12-color Giclée printing process uses archival pigment inks that are fade-resistant for 100+ years, ensuring your pet's portrait remains vibrant forever.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-background p-8 rounded-2xl shadow-sm border border-border/50">
                                <div className="h-12 w-12 mx-auto bg-amber-100 p-3 rounded-full text-amber-700 mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-headline text-xl font-bold mb-3">Responsibly Sourced</h3>
                                <p className="text-muted-foreground">
                                    We use FSC-certified wood and paper from sustainably managed forests, ensuring that your art supports the health of our planet.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 md:py-32 container mx-auto px-4 md:px-6">
                    <div className="bg-primary text-primary-foreground rounded-3xl p-12 md:p-24 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="font-headline text-3xl md:text-5xl font-bold mb-6">
                                Ready to Create Your Masterpiece?
                            </h2>
                            <p className="text-primary-foreground/90 text-xl mb-10">
                                Upload your pet's photo today and let is craft a timeless work of art using the world's finest materials.
                            </p>
                            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                                <Link href="/#pricing">Start Your Portrait</Link>
                            </Button>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}
