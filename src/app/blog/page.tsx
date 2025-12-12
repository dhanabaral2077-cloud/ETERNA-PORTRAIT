import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';

export const metadata: Metadata = {
    title: 'Pet Portrait Blog | Tips, Ideas & Inspiration | Eterna Portrait',
    description: 'Read our latest articles on pet photography, gift ideas, and the art of pet portraits. Join our community of pet lovers.',
};

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string | null;
    tags: string[] | null;
    created_at: string;
    published: boolean;
}

async function getPosts(): Promise<BlogPost[]> {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

    return (data as BlogPost[]) || [];
}

interface BlogPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
    const allPosts = await getPosts();

    // Extract unique tags
    const allTags = Array.from(new Set(allPosts.flatMap(post => post.tags || []))).sort();

    // Filter posts based on tag
    const selectedTag = typeof searchParams.tag === 'string' ? searchParams.tag : 'all';

    const displayedPosts = selectedTag === 'all'
        ? allPosts
        : allPosts.filter(post => post.tags?.includes(selectedTag));

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-background py-24 px-6 md:px-16">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="font-headline text-4xl md:text-5xl text-foreground mb-4">
                            The Eterna Blog
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Tips, inspiration, and stories for pet lovers.
                        </p>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-2 mb-12">
                        <Link
                            href="/blog"
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedTag === 'all'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            All
                        </Link>
                        {allTags.map(tag => (
                            <Link
                                key={tag}
                                href={`/blog?tag=${encodeURIComponent(tag)}`}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedTag === tag
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                {tag}
                            </Link>
                        ))}
                    </div>

                    {displayedPosts.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">
                            <p>No articles found for "{selectedTag}".</p>
                            <Link href="/blog" className="text-primary hover:underline mt-4 inline-block">
                                View all posts
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {displayedPosts.map((post) => (
                                <Link href={`/blog/${post.slug}`} key={post.id} className="group">
                                    <article className="bg-card rounded-2xl overflow-hidden border border-muted/20 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                                        <div className="relative h-64 overflow-hidden">
                                            {post.image ? (
                                                <Image
                                                    src={post.image}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-center text-xs text-muted-foreground mb-3 space-x-2">
                                                <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
                                                <span>•</span>
                                                <span>{Math.ceil(post.content?.split(' ').length / 200) || 5} min read</span>
                                            </div>
                                            <h2 className="font-headline text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                                                {post.title}
                                            </h2>
                                            <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                                                {post.excerpt}
                                            </p>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {post.tags?.slice(0, 3).map(tag => (
                                                    <span key={tag} className="text-xs px-2 py-1 bg-secondary rounded-md text-secondary-foreground opacity-80">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <span className="text-primary font-medium text-sm group-hover:underline mt-auto">
                                                Read Article →
                                            </span>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
