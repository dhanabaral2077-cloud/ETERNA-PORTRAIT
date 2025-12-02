"use client";

import { Facebook, Twitter, Linkedin, Link as LinkIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ShareButtonsProps {
    title: string;
    slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const url = `https://eternaportrait.com/blog/${slug}`;
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-2 my-8 border-y py-4">
            <span className="text-sm font-medium mr-2">Share this article:</span>

            <Button variant="ghost" size="icon" asChild className="hover:text-[#1877F2] hover:bg-blue-50">
                <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Facebook"
                >
                    <Facebook className="h-4 w-4" />
                </a>
            </Button>

            <Button variant="ghost" size="icon" asChild className="hover:text-[#1DA1F2] hover:bg-sky-50">
                <a
                    href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Twitter"
                >
                    <Twitter className="h-4 w-4" />
                </a>
            </Button>

            <Button variant="ghost" size="icon" asChild className="hover:text-[#0A66C2] hover:bg-blue-50">
                <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on LinkedIn"
                >
                    <Linkedin className="h-4 w-4" />
                </a>
            </Button>

            <Button variant="ghost" size="icon" onClick={handleCopy} className="hover:text-primary hover:bg-primary/10">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4" />}
            </Button>
        </div>
    );
}
