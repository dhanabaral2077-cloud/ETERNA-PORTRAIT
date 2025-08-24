import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const pricingTiers = [
  {
    name: 'Digital Portrait',
    price: '$39',
    description: 'High-resolution file, ready in 48h.',
    features: [
      'High-resolution digital file',
      'Perfect for social media',
      'Print it yourself',
      'Delivered in 48 hours'
    ],
    cta: 'Start with Digital'
  },
  {
    name: 'Canvas Portrait 12x16"',
    price: '$79',
    description: 'Premium canvas, ready to hang.',
    features: [
      'Gallery-quality canvas',
      'Vibrant, fade-resistant ink',
      'Ready to hang',
      'Includes digital version'
    ],
    isFeatured: true,
    cta: 'Choose Canvas'
  },
  {
    name: 'Canvas Portrait 18x24"',
    price: '$119',
    description: 'Gallery size, museum-quality print.',
    features: [
      'Large museum-quality canvas',
      'Statement piece for your home',
      'Hand-stretched on a wooden frame',
      'Includes digital version'
    ],
    cta: 'Go for Gallery'
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 lg:py-28 bg-background">
      <div className="container max-w-5xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-headline text-foreground">Choose Your Portrait Format</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Each artwork is carefully crafted by a professional artist and delivered with love.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {pricingTiers.map((tier) => (
            <Card key={tier.name} className={`flex flex-col h-full bg-card/50 rounded-lg shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-105 ${tier.isFeatured ? 'border-primary border-2' : 'border'}`}>
              <CardHeader className="items-center text-center">
                <CardTitle className="text-2xl font-headline">{tier.name}</CardTitle>
                <CardDescription className="mt-1 h-12">{tier.description}</CardDescription>
                <p className="text-5xl font-bold text-primary mt-4">{tier.price}</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3 text-sm">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full text-lg py-6" size="lg" variant={tier.isFeatured ? 'default' : 'outline'}>
                    <Link href="#contact">{tier.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
