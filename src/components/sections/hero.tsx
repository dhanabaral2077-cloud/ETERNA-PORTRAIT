import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Hero() {
  return (
    <section id="hero" className="relative w-full h-screen min-h-[700px] flex items-center justify-center bg-background overflow-hidden">
        <div className="absolute inset-0 z-0">
            <Image
                src="https://placehold.co/1920x1080.png"
                alt="Elegant portrait of a pet in a frame"
                fill
                className="opacity-20 object-cover"
                data-ai-hint="elegant portrait"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
      <div className="container relative z-10 mx-auto px-4 md:px-6 text-center animate-fade-in-up">
        <div className="flex flex-col items-center space-y-6">
          <h1 className="font-headline font-bold tracking-tight text-foreground leading-tight">
            A Timeless Portrait of Your Beloved Pet.
          </h1>
          <p className="max-w-2xl md:text-xl text-muted-foreground animation-delay-300">
            Handcrafted digital art & museum-quality prints that celebrate your companion for a lifetime.
          </p>
          <div className="animation-delay-600">
            <Button asChild size="lg" className="text-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transform hover:scale-105 transition-transform rounded-full">
              <Link href="#contact">Commission Your Portrait</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
