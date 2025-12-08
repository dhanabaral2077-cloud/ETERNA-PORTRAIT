import React from 'react';

export function JsonLd() {
    const schema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': 'https://eternaportrait.com/#organization',
                name: 'Eterna Portrait',
                url: 'https://eternaportrait.com',
                logo: {
                    '@type': 'ImageObject',
                    url: 'https://eternaportrait.com/logo.png',
                    width: 112,
                    height: 112,
                },
                sameAs: [
                    'https://www.instagram.com/eternaportrait',
                    'https://www.facebook.com/eternaportrait',
                ],
            },
            {
                '@type': 'WebSite',
                '@id': 'https://eternaportrait.com/#website',
                url: 'https://eternaportrait.com',
                name: 'Eterna Portrait',
                publisher: {
                    '@id': 'https://eternaportrait.com/#organization',
                },
                description: 'Custom Pet Portraits & Handcrafted Digital Art',
                inLanguage: 'en-US',
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
