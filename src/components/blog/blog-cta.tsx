"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

import { useState, useEffect } from "react";

export function BlogCTA() {
    const portraits = [
        {
            src: "https://i.pinimg.com/736x/f2/c5/e7/f2c5e7faef71372a364cec114b950d49.jpg",
            title: "Bella in Renaissance Style",
        },
        {
            src: "https://i.pinimg.com/736x/9f/23/cb/9f23cb991c51c130f83ad8169a75388b.jpg",
            title: "Max in Classic Oil",
        },
        {
            src: "https://i.pinimg.com/1200x/cd/5a/ca/cd5acac70dd4da1454ef66b95543676b.jpg",
            title: "Luna in Modern Minimalist",
        },
        {
            src: "https://i.pinimg.com/1200x/1f/38/b7/1f38b71214e5233cd9ad8c4fb9d1d947.jpg",
            title: "Charlie in Regal Style",
        },
        {
            src: "https://i.pinimg.com/1200x/33/63/2d/33632d69759732a62a1204666c250b0e.jpg",
            title: "Daisy in Soft Pastel",
        },
        {
            src: "https://i.pinimg.com/1200x/53/b9/73/53b973489c2b94f4cadcc19c6bc49aca.jpg",
            title: "Rocky in Contemporary Ink",
        },
    ];

    const [randomPortrait, setRandomPortrait] = useState(portraits[0]);

    useEffect(() => {
        // Randomly select a portrait on client-side mount
        const randomIndex = Math.floor(Math.random() * portraits.length);
        setRandomPortrait(portraits[randomIndex]);
    }, []);

    return (
        <div className="my-12 relative overflow-hidden rounded-3xl bg-primary/5 border border-primary/10 p-8 md:p-12">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-secondary/10 rounded-full blur-2xl opacity-50" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                {/* Text Content */}
                <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm border border-primary/20 text-xs font-semibold text-primary mb-4">
                        <Sparkles size={14} />
                        <span>Turn this photo into art</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-headline font-bold mb-4 text-foreground">
                        Love your pet? Immortalize them forever.
                    </h3>

                    <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                        Transform your favorite photo of your furry friend into a museum-quality masterpiece.
                        Handcrafted digital oil paintings that capture their unique soul.
                    </p>

                    <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 group">
                        <Link href="/#pricing">
                            Get Your Portrait
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>

                {/* Visual Element */}
                <div className="w-full md:w-1/3 relative aspect-square max-w-[300px]">
                    {/* We can use a specific high-converting example image here */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl rotate-3 transform scale-95" />
                    <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white rotate-0 hover:rotate-2 transition-transform duration-500">
                        <Image
                            src={randomPortrait.src}
                            alt={randomPortrait.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
