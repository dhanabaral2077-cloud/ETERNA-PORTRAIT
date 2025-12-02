"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";

interface RelatedPostsProps {
    currentSlug: string;
    tags: string[];
}

export function RelatedPosts({ currentSlug, tags }: RelatedPostsProps) {
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        const fetchRelated = async () => {
            if (!tags || tags.length === 0) return;

            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            // Fetch posts that share at least one tag
            const { data } = await supabase
                .from("posts")
                .select("title, slug, image, created_at")
                .eq("published", true)
                .neq("slug", currentSlug)
                .overlaps("tags", tags)
                .limit(3);

            if (data) setPosts(data);
        };

        fetchRelated();
    }, [currentSlug, tags]);

    if (posts.length === 0) return null;

    return (
        <div className="py-12 border-t">
            <h3 className="text-2xl font-headline font-bold mb-8">Related Articles You'll Love</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                        <div className="bg-card rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all h-full">
                            <div className="relative h-48 overflow-hidden">
                                {post.image ? (
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100" />
                                )}
                            </div>
                            <div className="p-4">
                                <h4 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                                    {post.title}
                                </h4>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
