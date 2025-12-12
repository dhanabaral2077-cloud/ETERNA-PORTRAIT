import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Image from 'next/image';
import { Star, Quote, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Customer Reviews | Eterna Portrait',
    description: 'See why 10,000+ pet parents love their Eterna Portraits. Real photos, real tears of joy, and 5-star reviews from across the globe.',
};

export default function ReviewsPage() {
    const reviews = [
        {
            id: 1,
            name: "Sarah & Cooper",
            text: "I literally cried when I opened the package. They captured Cooper's goofy smile perfectly. It's the centerpiece of my living room now!",
            stars: 5,
            image: "https://i.pinimg.com/736x/f2/c5/e7/f2c5e7faef71372a364cec114b950d49.jpg",
            date: "2 days ago"
        },
        {
            id: 2,
            name: "Michael T.",
            text: "Better than I expected. The canvas quality is museum-grade, heavy and textured. Worth every penny.",
            stars: 5,
            image: "https://i.pinimg.com/736x/9f/23/cb/9f23cb991c51c130f83ad8169a75388b.jpg",
            date: "1 week ago"
        },
        {
            id: 3,
            name: "Jessica P.",
            text: "Got this for my husband after our dog passed. It was the most emotional, beautiful gift. Thank you Eterna for this memory.",
            stars: 5,
            image: "https://i.pinimg.com/1200x/cd/5a/ca/cd5acac70dd4da1454ef66b95543676b.jpg",
            date: "2 weeks ago"
        },
        {
            id: 4,
            name: "Emily & Luna",
            text: "The 'Queen' renaissance style fits Luna's cattitude perfectly. Everyone who visits asks where I got it!",
            stars: 5,
            image: "https://i.pinimg.com/1200x/1f/38/b7/1f38b71214e5233cd9ad8c4fb9d1d947.jpg",
            date: "3 weeks ago"
        },
        {
            id: 5,
            name: "David W.",
            text: "Fast shipping and they actually checked my photo first to make sure it would work. Great customer service.",
            stars: 5,
            image: "https://i.pinimg.com/1200x/33/63/2d/33632d69759732a62a1204666c250b0e.jpg",
            date: "1 month ago"
        },
        {
            id: 6,
            name: "Amanda L.",
            text: "I've ordered 3 times now for different friends. It's my go-to gift. The unboxing experience is so premium.",
            stars: 5,
            image: "https://i.pinimg.com/1200x/53/b9/73/53b973489c2b94f4cadcc19c6bc49aca.jpg",
            date: "1 month ago"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-background pt-24 pb-16">

                {/* Header */}
                <section className="px-6 md:px-16 mb-20 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <h1 className="font-headline text-4xl md:text-6xl text-foreground mb-6">
                            The <span className="italic text-primary">Wall of Love</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Join thousands of happy pet parents who have immortalized their best friends.
                        </p>
                    </div>
                </section>

                {/* Metrics */}
                <section className="bg-secondary/20 py-12 mb-20">
                    <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold font-headline mb-2">10k+</div>
                            <div className="text-muted-foreground">Portraits Created</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold font-headline mb-2">4.9/5</div>
                            <div className="text-muted-foreground">Average Rating</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold font-headline mb-2">100%</div>
                            <div className="text-muted-foreground">Smile Guarantee</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold font-headline mb-2">24h</div>
                            <div className="text-muted-foreground">Support Response</div>
                        </div>
                    </div>
                </section>

                {/* Reviews Grid */}
                <section className="px-6 md:px-16 mb-24">
                    <div className="container mx-auto">
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                            {reviews.map((review) => (
                                <div key={review.id} className="break-inside-avoid bg-card rounded-3xl overflow-hidden shadow-md border border-muted/50 hover:shadow-xl transition-all duration-300">
                                    <div className="relative aspect-square">
                                        <Image
                                            src={review.image}
                                            alt={`Portrait for ${review.name}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                                            <Heart className="w-3 h-3 fill-red-500 text-red-500" /> Verified
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex text-yellow-400 mb-4">
                                            {[...Array(review.stars)].map((_, i) => (
                                                <Star key={i} size={16} fill="currentColor" />
                                            ))}
                                        </div>
                                        <div className="relative">
                                            <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/10 rotate-180" />
                                            <p className="text-foreground italic relative z-10 pl-4 mb-6">
                                                "{review.text}"
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-border pt-4">
                                            <span className="font-headline font-bold">{review.name}</span>
                                            <span className="text-xs text-muted-foreground">{review.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="text-center">
                    <Button asChild size="lg" className="rounded-full px-12 py-8 text-xl shadow-2xl shadow-primary/30 animate-pulse-slow">
                        <Link href="/order">
                            Join the Family - Create Yours
                        </Link>
                    </Button>
                </section>

            </main>
            <Footer />
        </div>
    );
}
