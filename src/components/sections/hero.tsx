import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Hero() {
  return (
    <section id="hero" className="relative w-full overflow-hidden bg-card">
      <div className="container grid lg:grid-cols-2 gap-10 items-center py-20 md:py-32">
        <div className="flex flex-col items-start space-y-6 text-left">
          <h1 className="text-4xl font-bold tracking-tight text-primary md:text-5xl lg:text-6xl font-headline">
            Immortalize Your Beloved Pet in a Timeless Portrait
          </h1>
          <p className="max-w-xl text-lg text-foreground/80 md:text-xl">
            Experience the joy of seeing your pet's unique personality captured in a stunning, hand-crafted masterpiece. Our artist pours heart and soul into every brushstroke to create a portrait you'll cherish forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="text-lg">
              <Link href="#contact">Commission a Portrait</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg">
              <Link href="#portfolio">View Gallery</Link>
            </Button>
          </div>
        </div>
        <div className="relative h-80 lg:h-full w-full rounded-lg overflow-hidden shadow-2xl group">
            <Image
                src="https://placehold.co/800x1000.png"
                alt="Artist painting a pet portrait"
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500 ease-in-out group-hover:scale-105"
                data-ai-hint="artist painting"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}
