"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";

interface ProductCardProps {
    title: string;
    description: string;
    price: string;
    image: string;
    link: string;
    badge?: string;
}

export function ProductCard({ title, description, price, image, link, badge }: ProductCardProps) {
    return (
        <div className="group relative my-12 rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md overflow-hidden">
            <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="relative w-full md:w-2/5 aspect-[4/3] md:aspect-auto">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {badge && (
                        <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            {badge}
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-3">
                        <ShoppingBag size={16} />
                        <span>Featured Product</span>
                    </div>

                    <h4 className="font-headline text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {title}
                    </h4>

                    <p className="text-muted-foreground mb-6 line-clamp-2">
                        {description}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                        <span className="text-xl font-bold text-foreground">{price}</span>
                        <Button asChild className="rounded-full group-hover:translate-x-1 transition-transform">
                            <Link href={link}>
                                Shop Now <ArrowRight size={16} className="ml-2" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
