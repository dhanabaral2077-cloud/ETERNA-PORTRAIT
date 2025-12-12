import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Metadata } from 'next';
import { Palette, Crown, Brush, Zap, Droplets } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Choose Your Perfect Portrait Style | Eterna Portrait',
    description: 'Compare our distinct art styles: from the Royal Renaissance to the Modern Minimalist. Find the perfect match for your pet\'s personality.',
};

export default function StyleGuidePage() {
    const styles = [
        {
            id: 'artist',
            title: 'Artist Choice',
            icon: Palette,
            desc: "Our signature balanced style. The perfect blend of realism and artistic flair.",
            bestFor: "Owners who want a classic, timeless look that fits any decor.",
            color: "text-blue-500",
            bg: "bg-blue-50",
            img: "https://i.pinimg.com/736x/9f/23/cb/9f23cb991c51c130f83ad8169a75388b.jpg"
        },
        {
            id: 'renaissance',
            title: 'The Renaissance',
            icon: Crown,
            desc: "Majestic, royal, and hilarious. We dress your pet in period aristocrat attire.",
            bestFor: "Pets with a 'King of the House' attitude or for a funny conversation starter.",
            color: "text-yellow-600",
            bg: "bg-yellow-50",
            img: "https://i.pinimg.com/736x/f2/c5/e7/f2c5e7faef71372a364cec114b950d49.jpg"
        },
        {
            id: 'classic_oil',
            title: 'Classic Oil',
            icon: Brush,
            desc: "Deep, rich textures reminiscent of old-world masters. Dramatic lighting and bold strokes.",
            bestFor: "Immortalizing a beloved senior pet or for traditional home interiors.",
            color: "text-amber-700",
            bg: "bg-amber-50",
            img: "https://i.pinimg.com/1200x/1f/38/b7/1f38b71214e5233cd9ad8c4fb9d1d947.jpg"
        },
        {
            id: 'watercolor',
            title: 'Dreamy Watercolor',
            icon: Droplets,
            desc: "Soft, flowing, and ethereal. Gentle splashes of color on a clean background.",
            bestFor: "Sweet, gentle pets and light, airy modern spaces.",
            color: "text-pink-500",
            bg: "bg-pink-50",
            img: "https://i.pinimg.com/1200x/33/63/2d/33632d69759732a62a1204666c250b0e.jpg"
        },
        {
            id: 'modern',
            title: 'Modern Minimalist',
            icon: Zap,
            desc: "Clean lines, solid colors, and bold contrast. Pop-art inspired energy.",
            bestFor: "High-energy pets and contemporary, colorful apartments.",
            color: "text-purple-600",
            bg: "bg-purple-50",
            img: "https://i.pinimg.com/1200x/cd/5a/ca/cd5acac70dd4da1454ef66b95543676b.jpg"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-background pt-24 pb-16">
                <section className="px-6 md:px-16 mb-20 text-center">
                    <div className="max-w-4xl mx-auto">
                        <span className="text-primary font-medium tracking-wide uppercase text-sm mb-4 block">Art Direction</span>
                        <h1 className="font-headline text-4xl md:text-6xl text-foreground mb-6">
                            Find Their <span className="italic text-primary">True Colors</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Every pet has a unique personality. Choose the art style that captures their spirit perfectly.
                        </p>
                    </div>
                </section>

                <section className="px-6 md:px-16 mb-24">
                    <div className="max-w-7xl mx-auto grid gap-16">
                        {styles.map((style, idx) => (
                            <div key={style.id} className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 group`}>
                                {/* Image Side */}
                                <div className="flex-1 w-full">
                                    <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                                        <Image
                                            src={style.img}
                                            alt={`${style.title} Example`}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                    </div>
                                </div>

                                {/* Text Side */}
                                <div className="flex-1 space-y-6">
                                    <div className={`w-16 h-16 ${style.bg} ${style.color} rounded-2xl flex items-center justify-center`}>
                                        <style.icon size={32} />
                                    </div>
                                    <h2 className="font-headline text-4xl md:text-5xl">{style.title}</h2>
                                    <p className="text-xl text-muted-foreground leading-relaxed">
                                        {style.desc}
                                    </p>
                                    <div className="bg-secondary/30 p-6 rounded-2xl border-l-4 border-primary">
                                        <p className="font-medium text-foreground">Perfect for:</p>
                                        <p className="text-muted-foreground italic">{style.bestFor}</p>
                                    </div>
                                    <div className="pt-4">
                                        <Button asChild size="lg" className="rounded-full px-8">
                                            <Link href={`/order?style=${style.id}`}>
                                                Choose {style.title}
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-primary/5 py-24 px-6 md:px-16 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="font-headline text-4xl mb-6">Can't Decide?</h2>
                        <p className="text-xl text-muted-foreground mb-10">
                            Select "Artist Choice" at checkout, and we'll pick the style that best suits your photo and pet's features.
                        </p>
                        <Button asChild size="lg" className="rounded-full text-lg px-10 py-6">
                            <Link href="/order">Start Customizing</Link>
                        </Button>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
