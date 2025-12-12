import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
    title: "The Ultimate Custom Pet Art Gift Guide | Eterna Portrait",
    description: "Looking for the perfect gift for a dog mom or cat dad? Discover why a custom heirloom portrait is the most cherished present they'll ever receive.",
    keywords: ["pet portrait gift", "unique dog lover gifts", "custom cat art", "heirloom pet portrait", "luxury pet gifts"],
};

export default function GiftGuidePage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#FDFCF8]">
            <Header />
            <main className="flex-1 pt-24 pb-20">
                <article className="max-w-3xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <span className="text-secondary text-sm tracking-widest uppercase mb-4 block">Gift Guide 2025</span>
                        <h1 className="font-headline text-4xl md:text-6xl text-foreground mb-6 leading-tight">
                            The Ultimate Gift for the <br /><span className="text-primary italic">Obsessed Pet Parent</span>
                        </h1>
                        <p className="text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
                            Why a generic toy lasts a month, but a handcrafted portrait lasts a lifetime. Here’s how to choose the perfect heirloom piece.
                        </p>
                    </div>

                    {/* Hero Image */}
                    <div className="relative aspect-video w-full rounded-3xl overflow-hidden mb-16 shadow-2xl border border-white/20">
                        <Image
                            src="https://i.pinimg.com/1200x/c1/81/29/c18129df49969f592d5641776510619a.jpg"
                            alt="Happy owner holding a custom pet portrait"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg prose-stone max-w-none prose-headings:font-headline prose-headings:text-foreground prose-p:text-secondary">
                        <p>
                            We all know that one person. Their camera roll is 99% dog photos. They cancel plans because "Snickers gets lonely." They are the devoted pet parent, and finding a gift for them can be... ruff.
                        </p>
                        <p>
                            You could buy another squeaky toy (destroyed in minutes) or a treat bag (gone in seconds). But if you want to give a gift that brings happy tears, you need something <strong>timeless</strong>.
                        </p>

                        <h2>Why Custom Art is the "Gold Standard" of Gifts</h2>
                        <ul className="list-none pl-0 space-y-4">
                            <li className="flex gap-4">
                                <span className="text-2xl">⏳</span>
                                <span><strong>It Lasts Forever:</strong> Unlike gadgets or gear, a portrait is an heirloom that stays on the wall for generations.</span>
                            </li>
                            <li className="flex gap-4">
                                <span className="text-2xl">🥹</span>
                                <span><strong>The Emotional Impact:</strong> Watching someone unwrap a portrait of their soulmate is a moment you never forget.</span>
                            </li>
                            <li className="flex gap-4">
                                <span className="text-2xl">🎨</span>
                                <span><strong>One of a Kind:</strong> No two pets are alike, and no two Eterna portraits are either. It's as unique as their bond.</span>
                            </li>
                        </ul>

                        <h2>Choosing the Right Style</h2>
                        <p>
                            Not sure which artistic direction to go? Here is our cheat sheet:
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 my-8 not-prose">
                            <div className="bg-white p-6 rounded-2xl border shadow-sm">
                                <h3 className="font-headline text-2xl mb-2">The Royal General</h3>
                                <p className="text-secondary text-sm mb-4">Perfect for the distinguished pet with a big personality.</p>
                                <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                                    <Image src="https://i.pinimg.com/736x/87/15/84/871584288015f9393630f9d997f8c09a.jpg" alt="Royal Pet Portrait" fill className="object-cover" />
                                </div>
                                <Button variant="outline" size="sm" asChild className="w-full"><Link href="/order?style=royal">Shop Royal</Link></Button>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border shadow-sm">
                                <h3 className="font-headline text-2xl mb-2">The Modern Minimalist</h3>
                                <p className="text-secondary text-sm mb-4">Clean, timeless, and fits any home decor.</p>
                                <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                                    <Image src="https://i.pinimg.com/736x/47/33/1b/47331b672807fa823db8b64e0d4a99dc.jpg" alt="Modern Pet Portrait" fill className="object-cover" />
                                </div>
                                <Button variant="outline" size="sm" asChild className="w-full"><Link href="/order?style=modern">Shop Modern</Link></Button>
                            </div>
                        </div>

                        <h2>Need it Fast? Go Digital.</h2>
                        <p>
                            Running behind on your shopping? Our <strong>Digital Download</strong> option is ready in just 24-48 hours. You can print it locally or send it via email. It's the ultimate last-minute lifesaver that still looks thoughtful.
                        </p>

                        <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10 my-12 text-center not-prose">
                            <h3 className="font-headline text-2xl mb-4">Ready to Win "Best Gift Giver"?</h3>
                            <p className="text-secondary mb-6">
                                Upload a photo, pick a style, and let our artists do the magic. Use code <strong>GIFTGUIDE</strong> for 5% off.
                            </p>
                            <Button asChild size="lg" className="rounded-full px-10 py-6 text-lg">
                                <Link href="/order">Start Your Commission</Link>
                            </Button>
                        </div>
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    );
}
