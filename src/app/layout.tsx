import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair-display',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Pet Masterpiece',
  description: 'Handcrafted digital art & museum-quality prints that celebrate your companion for a lifetime.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body className={`${playfairDisplay.variable} ${inter.variable} font-body bg-background text-foreground antialiased`}>
        {children}
        <Toaster />
      </body>
      <Script src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`}></Script>
    </html>
  );
}
