import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import { Alegreya, Inter } from 'next/font/google';
import './globals.css';

const alegreya = Alegreya({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-alegreya',
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
      <body className={`${alegreya.variable} ${inter.variable} font-body bg-background text-foreground antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
