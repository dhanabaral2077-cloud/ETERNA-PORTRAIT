import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, MessageSquare, Palette, Truck } from 'lucide-react';

const processSteps = [
  {
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
    title: '1. Consultation & Order',
    description: 'Start by filling out our contact form. We’ll discuss your vision, preferred style, and review your pet’s photos together to ensure we capture their essence perfectly.',
  },
  {
    icon: <Camera className="h-10 w-10 text-primary" />,
    title: '2. Photo Submission',
    description: 'Provide us with your favorite high-quality photos of your pet. Good lighting and clear details help our artist create a more accurate and lively portrait.',
  },
  {
    icon: <Palette className="h-10 w-10 text-primary" />,
    title: '3. Artistic Creation',
    description: 'Our artist begins the magic, translating your pet’s photo into a beautiful work of art. We use only the finest materials to ensure a lasting masterpiece.',
  },
  {
    icon: <Truck className="h-10 w-10 text-primary" />,
    title: '4. Review & Delivery',
    description: 'We’ll send you a digital proof for your approval. Once you are 100% happy, we’ll securely package and ship the final portrait directly to your home.',
  },
];

export function Process() {
  return (
    <section id="process" className="py-20 lg:py-28 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-headline text-primary">Our Simple Commission Process</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            From a simple photo to a timeless treasure, our process is designed to be easy, collaborative, and enjoyable.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, index) => (
            <Card key={index} className="text-center border-2 border-transparent hover:border-primary hover:shadow-xl transition-all duration-300">
              <CardHeader className="items-center">
                <div className="bg-primary/10 p-4 rounded-full">
                  {step.icon}
                </div>
                <CardTitle className="mt-4 text-xl font-headline">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-foreground/70">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
