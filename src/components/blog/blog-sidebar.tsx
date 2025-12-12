"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";

export function BlogSidebar() {
    return (
        <div className="hidden lg:block sticky top-32 space-y-8 w-80">
            {/* Main Product Card */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
                <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden mb-4">
                    <Image
                        src="https://i.pinimg.com/1200x/38/b9/21/38b92132530a0bea91d48138380b624d.jpg"
                        alt="Custom Pet Portrait Example"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                        <Star size={12} className="fill-current mr-1" /> Best Seller
                    </div>
                </div>

                <h3 className="font-headline text-xl font-bold mb-2 text-center">
                    Turn Your Pet Into <br />
                    <span className="text-primary italic">Royalty</span>
                </h3>

                <p className="text-sm text-center text-muted-foreground mb-6">
                    Join 10,000+ happy pet parents. Handcrafted digital oil paintings from your photos.
                </p>

                <Button asChild className="w-full rounded-full shadow-md bg-primary hover:bg-primary/90">
                    <Link href="/order">
                        Create My Portrait
                    </Link>
                </Button>
            </div>

            {/* Trust Signal */}
            <div className="bg-secondary/30 rounded-2xl p-6 text-center">
                <div className="flex justify-center -space-x-1 mb-3">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[8px] text-yellow-900 font-bold">★</div>
                    ))}
                </div>
                <p className="text-xs font-bold text-foreground">"Best gift I've ever given!"</p>
                <p className="text-xs text-muted-foreground mt-1">- Sarah J., Verified Buyer</p>
                <Link href="/reviews" className="text-xs text-primary underline mt-2 block">
                    Read more reviews
                </Link>
            </div>
        </div>
    );
}
