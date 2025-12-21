import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import { Playfair_Display, Montserrat } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { MarketingPopup } from '@/components/marketing-popup';
import { AnnouncementBar } from '@/components/announcement-bar';
import { StickyCTA } from '@/components/layout/sticky-cta';
import { JsonLd } from '@/components/seo/json-ld';
import { Snowfall } from '@/components/effects/snowfall';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair-display',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://eternaportrait.com'),
  alternates: {
    canonical: '/',
  },
  title: 'Custom Pet Portraits | Handcrafted Dog & Cat Art | Eterna Portrait',
  description: 'Transform your pet\'s photo into a timeless masterpiece. Commission handcrafted digital art and museum-quality prints that celebrate your companion for a lifetime.',
  keywords: ['pet portrait', 'dog portrait', 'cat portrait', 'custom pet art', 'digital oil painting', 'pet memorial', 'gift for pet lovers'],
  openGraph: {
    title: 'Custom Pet Portraits | Handcrafted Dog & Cat Art | Eterna Portrait',
    description: 'Transform your pet\'s photo into a timeless masterpiece. Commission handcrafted digital art and museum-quality prints.',
    url: 'https://eternaportrait.com',
    siteName: 'Eterna Portrait',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg', // Ensure this image exists in public folder
        width: 1200,
        height: 630,
        alt: 'Eterna Portrait Custom Pet Art',
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Pet Portraits | Handcrafted Dog & Cat Art | Eterna Portrait',
    description: 'Transform your pet\'s photo into a timeless masterpiece.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-H0T84MYGN3`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-H0T84MYGN3');
          `}
        </Script>
        {/* End Google Analytics */}
      </head>
      <body className={`${playfairDisplay.variable} ${montserrat.variable} font-body bg-background text-foreground antialiased`}>
        <JsonLd />
        <AnnouncementBar />
        {children}
        <StickyCTA />
        <MarketingPopup />
        <Snowfall />
        <Toaster />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
