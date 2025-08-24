import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { portfolioData } from '@/lib/data';

export function Showcase() {
  return (
    <section id="gallery" className="py-20 lg:py-28 bg-background">
      <div className="container max-w-6xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-bold font-headline text-foreground">Crafted With Love, Framed With Elegance.</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Each portrait is uniquely created to capture your pet’s personality, expression, and soul.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {portfolioData.map((item, index) => (
            <Card
              key={item.id}
              className="overflow-hidden group transform transition-all duration-300 hover:scale-102 hover:shadow-xl border-0 rounded-lg animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms`, animationDuration: '700ms' }}
            >
              <CardContent className="p-0">
                <div className="relative aspect-[3/4]">
                  <Image
                    src={item.src}
                    alt={item.title}
                    width={600}
                    height={800}
                    className="transition-transform duration-300 group-hover:scale-110 object-cover w-full h-full"
                    data-ai-hint={item.aiHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                   <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-xl font-bold font-headline text-white">{item.title}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
