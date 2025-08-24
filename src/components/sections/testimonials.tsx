import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { testimonialsData } from '@/lib/data';

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-headline text-primary">Words from Our Happy Clients</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            We're honored to have created so many cherished memories. Here's what our clients have to say.
          </p>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonialsData.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2">
                <div className="p-1">
                  <Card className="h-full flex flex-col justify-between p-6 bg-card shadow-lg">
                    <CardContent className="p-0 flex-grow">
                      <p className="text-lg italic text-foreground/90">"{testimonial.quote}"</p>
                    </CardContent>
                    <div className="flex items-center mt-6">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">{testimonial.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-lg">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.pet}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
