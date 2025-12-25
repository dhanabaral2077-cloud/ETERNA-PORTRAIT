import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Fetch all published posts
    const { data: posts } = await supabase
        .from('posts')
        .select('slug, updated_at')
        .eq('published', true);

    const blogEntries: MetadataRoute.Sitemap = (posts || []).map((post) => ({
        url: `https://eternaportrait.com/blog/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: 'https://eternaportrait.com',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: 'https://eternaportrait.com/gallery',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: 'https://eternaportrait.com/guide/photos',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: 'https://eternaportrait.com/reviews',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: 'https://eternaportrait.com/blog',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: 'https://eternaportrait.com/shop/digital',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: 'https://eternaportrait.com/materials',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: 'https://eternaportrait.com/gift',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
    ];

    return [...staticPages, ...blogEntries];
}
