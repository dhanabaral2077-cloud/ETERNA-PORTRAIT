import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { blogPosts } from '@/lib/blog-data';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Pet Portrait Blog | Tips, Ideas & Inspiration | Eterna Portrait',
    description: 'Read our latest articles on pet photography, gift ideas, and the art of pet portraits. Join our community of pet lovers.',
};

export default function BlogPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-background py-24 px-6 md:px-16">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="font-headline text-4xl md:text-5xl text-foreground mb-4">
                            The Eterna Blog
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Tips, inspiration, and stories for pet lovers.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {blogPosts.map((post) => (
                            <Link href={`/blog/${post.slug}`} key={post.slug} className="group">
                                <article className="bg-card rounded-2xl overflow-hidden border border-muted/20 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                                    <div className="relative h-64 overflow-hidden">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center text-xs text-muted-foreground mb-3 space-x-2">
                                            <span>{post.date}</span>
                                            <span>•</span>
                                            <span>{post.readTime}</span>
                                        </div>
                                        <h2 className="font-headline text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                                            {post.excerpt}
                                        </p>
                                        <span className="text-primary font-medium text-sm group-hover:underline">
                                            Read Article →
                                        </span>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
