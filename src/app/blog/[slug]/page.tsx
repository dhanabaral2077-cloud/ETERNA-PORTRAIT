import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';
import { Reactions } from '@/components/blog/reactions';
import { Comments } from '@/components/blog/comments';
import { RelatedPosts } from '@/components/blog/related-posts';
import { Badge } from '@/components/ui/badge';

interface Props {
    params: Promise<{ slug: string }>;
}

// Revalidate every 60 seconds
export const revalidate = 60;

async function getPost(slug: string) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: post } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

    return post;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        return {
            title: 'Article Not Found',
        };
    }

    return {
        title: `${post.title} | Eterna Portrait Blog`,
        description: post.search_description || post.excerpt,
        openGraph: {
            title: post.title,
            description: post.search_description || post.excerpt,
            images: post.image ? [post.image] : [],
            type: 'article',
        },
    };
}

export async function generateStaticParams() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: posts } = await supabase
        .from('posts')
        .select('slug')
        .eq('published', true);

    return (posts || []).map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-background py-24 px-6 md:px-16">
                <article className="max-w-3xl mx-auto">
                    <div className="mb-8 text-center">
                        <div className="flex items-center justify-center text-sm text-muted-foreground mb-4 space-x-2">
                            <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
                            <span>•</span>
                            <span>{Math.ceil(post.content?.split(' ').length / 200) || 5} min read</span>
                        </div>
                        <h1 className="font-headline text-4xl md:text-5xl text-foreground mb-6 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex items-center justify-center space-x-2">
                            <span className="text-sm font-medium text-foreground">By {post.author}</span>
                        </div>
                    </div>

                    {post.image && (
                        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-12 shadow-lg">
                            <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    <div
                        className="prose prose-lg prose-stone mx-auto dark:prose-invert mb-12"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-12">
                            {post.tags.map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Reactions */}
                    <Reactions postId={post.id} />

                    {/* Related Posts */}
                    <RelatedPosts currentSlug={post.slug} tags={post.tags} />

                    {/* Comments */}
                    <Comments postId={post.id} />
                </article>
            </main>
            <Footer />
        </div>
    );
}
