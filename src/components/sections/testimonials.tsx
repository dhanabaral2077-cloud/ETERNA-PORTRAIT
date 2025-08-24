
"use client";

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { Star } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

const testimonialsData = [
    {
        id: '1',
        name: 'Emily R.',
        quote: "When I saw Luna’s portrait, I cried. It was like seeing her soul captured forever.",
        image: 'https://placehold.co/100x100.png',
        aiHint: 'woman smiling',
    },
    {
        id: '2',
        name: 'David W.',
        quote: "The quality exceeded my expectations. The canvas looks like a luxury gallery piece.",
        image: 'https://placehold.co/100x100.png',
        aiHint: 'man portrait',
    },
    {
        id: '3',
        name: 'Jessica P.',
        quote: "I commissioned this as a gift for my husband, and he was moved to tears. You've created a masterpiece that we will cherish forever.",
        image: 'https://placehold.co/100x100.png',
        aiHint: 'woman portrait',
    },
    {
        id: '4',
        name: 'Sarah L.',
        quote: "I'm absolutely speechless. The portrait of Max captures his soul, not just his likeness. It's the most beautiful piece of art in our home.",
        image: 'https://placehold.co/100x100.png',
        aiHint: 'smiling person',
    },
];

export function Testimonials() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on("select", onSelect)
    
    // Set initial state
    onSelect();

    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-card overflow-hidden">
      <div className="container max-w-5xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-bold font-headline text-foreground">Loved by Pet Parents Everywhere</h2>
           <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            We're honored to have created so many cherished memories.
          </p>
        </div>
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full max-w-md mx-auto"
        >
          <CarouselContent className="-ml-4">
            {testimonialsData.map((testimonial, index) => (
              <CarouselItem key={testimonial.id} className="pl-4">
                <div className="p-4 h-full">
                  <Card className="h-full flex flex-col justify-between p-6 bg-background rounded-lg shadow-sm transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                    <CardContent className="p-0 flex-grow flex flex-col items-center text-center">
                        <div className="relative w-24 h-24 mb-4">
                             <Image 
                                src={testimonial.image}
                                alt={`Photo of ${testimonial.name}`} 
                                width={100}
                                height={100}
                                className={cn(
                                    "rounded-full object-cover transition-all duration-500 ease-out",
                                    current === index ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                                )}
                                data-ai-hint={testimonial.aiHint}
                             />
                        </div>
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                           <Star 
                            key={i} 
                            className={cn(
                                "h-5 w-5 text-primary fill-primary transition-all duration-300 ease-in-out",
                                current === index ? 'animate-star-animation' : 'opacity-0 scale-0'
                            )}
                            style={{ animationDelay: `${(current === index ? i * 100 : 0)}ms` }}
                           />
                        ))}
                      </div>
                      <div className={cn("transition-opacity duration-500 ease-in-out", current === index ? 'opacity-100 delay-300' : 'opacity-0')}>
                        <p className="text-lg italic text-foreground/80 mb-4 flex-grow">"{testimonial.quote}"</p>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
