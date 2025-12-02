import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import { Playfair_Display, Montserrat } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { MarketingPopup } from '@/components/marketing-popup';
import { AnnouncementBar } from '@/components/announcement-bar';

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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Pet Portraits | Handcrafted Dog & Cat Art | Eterna Portrait',
    description: 'Transform your pet\'s photo into a timeless masterpiece.',
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
        <AnnouncementBar />
        {children}
        <MarketingPopup />
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  );
}
