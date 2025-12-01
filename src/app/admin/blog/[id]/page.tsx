"use client";

import { BlogEditor } from "@/components/admin/blog-editor";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EditPostPage() {
    const params = useParams();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/blog/${params.id}`);
                const data = await res.json();
                setPost(data);
            } catch (error) {
                console.error("Failed to fetch post", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchPost();
        }
    }, [params.id]);

    if (isLoading) {
        return <div>Loading editor...</div>;
    }

    if (!post) {
        return <div>Post not found</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/blog">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Edit Post</h1>
            </div>

            <BlogEditor post={post} />
        </div>
    );
}
