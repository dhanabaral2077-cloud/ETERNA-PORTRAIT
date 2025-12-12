import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { OrderForm } from "@/components/order/order-form";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Commission Your Custom Pet Portrait | Eterna Portrait',
    description: 'Start your custom pet portrait order. Choose from Renaissance, Oil, or Modern styles. Museum-quality prints on canvas or fine art paper. 100% Satisfaction Guarantee.',
    alternates: {
        canonical: '/order',
    },
};

export default function OrderPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Custom Pet Portrait',
        description: 'Handcrafted custom pet portrait from your photo. Available in Renaissance, Classic Oil, Watercolor, and Modern styles.',
        image: 'https://eternaportrait.com/og-image.jpg',
        brand: {
            '@type': 'Brand',
            name: 'Eterna Portrait',
        },
        offers: {
            '@type': 'AggregateOffer',
            lowPrice: '59.00',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '1240',
        },
    };

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Header />
            <main className="flex-1 py-24 md:py-32">
                <div className="container mx-auto px-4 md:px-6 max-w-6xl">
                    <Suspense fallback={<div className="flex justify-center items-center h-96"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>}>
                        <OrderForm />
                    </Suspense>
                </div>
            </main>
            <Footer />
        </div>
    );
}
