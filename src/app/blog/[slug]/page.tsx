import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { blogPosts } from '@/lib/blog-data';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        return {
            title: 'Article Not Found',
        };
    }

    return {
        title: `${post.title} | Eterna Portrait Blog`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [post.image],
            type: 'article',
        },
    };
}

export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);

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
                            <span>{post.date}</span>
                            <span>•</span>
                            <span>{post.readTime}</span>
                        </div>
                        <h1 className="font-headline text-4xl md:text-5xl text-foreground mb-6 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex items-center justify-center space-x-2">
                            <span className="text-sm font-medium text-foreground">By {post.author}</span>
                        </div>
                    </div>

                    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-12 shadow-lg">
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <div
                        className="prose prose-lg prose-stone mx-auto dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>
            </main>
            <Footer />
        </div>
    );
}
