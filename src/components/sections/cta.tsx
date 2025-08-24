import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export function CTA() {
  return (
    <section id="contact" className="py-20 lg:py-32 bg-card/50">
      <div className="container max-w-4xl mx-auto px-4 md:px-6">
        <div className="relative bg-background rounded-lg shadow-xl overflow-hidden p-8 md:p-12 text-center">
            <div className="absolute inset-0 z-0 opacity-10">
                <Image src="https://placehold.co/1200x600.png" alt="Framed pet portrait" layout="fill" objectFit="cover" data-ai-hint="framed art" />
            </div>
            <div className="relative z-10 flex flex-col items-center">
                <h2 className="text-4xl md:text-5xl font-bold font-headline text-foreground mb-4">Ready to Immortalize Your Pet?</h2>
                <p className="max-w-xl text-lg text-muted-foreground mb-8">
                    Let's create a beautiful, lasting memory of your furry, feathery, or scaly friend.
                </p>
                <Button asChild size="lg" className="text-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transform hover:scale-105 transition-transform">
                    <Link href="#">Start My Portrait</Link>
                </Button>
            </div>
        </div>
      </div>
    </section>
  );
}
