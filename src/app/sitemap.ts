import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://eternaportrait.com',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        // Add other pages here if you have them, e.g., /gallery, /pricing
    ]
}
