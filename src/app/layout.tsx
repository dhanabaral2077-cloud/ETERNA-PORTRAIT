
import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import { Playfair_Display, Montserrat } from 'next/font/google';
import './globals.css';

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
      <body className={`${playfairDisplay.variable} ${montserrat.variable} font-body bg-background text-foreground antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
