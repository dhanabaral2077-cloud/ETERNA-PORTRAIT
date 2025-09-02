
import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import { Playfair_Display, Montserrat } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

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
  title: 'Eterna Portrait',
  description: 'Handcrafted digital art & museum-quality prints that celebrate your companion for a lifetime.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TQDDF4W9');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className={`${playfairDisplay.variable} ${montserrat.variable} font-body bg-background text-foreground antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TQDDF4W9"
        height="0" width="0" style={{display:"none",visibility:"hidden"}}></iframe></noscript>
        {/* End Google Tag Manager (noscript) */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
