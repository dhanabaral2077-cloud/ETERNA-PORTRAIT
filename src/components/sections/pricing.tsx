import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const pricingTiers = [
  {
    name: 'Classic Digital',
    price: '$250',
    description: 'A beautiful, high-resolution digital portrait.',
    features: [
      '8" x 10" Digital File',
      'Head & Shoulders',
      'Simple Color Background',
      '2 Week Turnaround'
    ],
    cta: 'Order Now'
  },
  {
    name: 'Premium Canvas',
    price: '$450',
    description: 'A stunning physical portrait on gallery-quality canvas.',
    features: [
      '12" x 16" Stretched Canvas',
      'Full Body Portrait',
      'Detailed Scenery Background',
      '4 Week Turnaround'
    ],
    isFeatured: true,
    cta: 'Choose Premium'
  },
  {
    name: 'Luxe Oil Painting',
    price: '$800',
    description: 'An exquisite, timeless oil painting on linen.',
    features: [
      '16" x 20" Fine Linen Canvas',
      'Full Custom Composition',
      'Artist Signature & Varnish',
      '8 Week Turnaround'
    ],
    cta: 'Select Luxe'
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 lg:py-28 bg-card">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-headline text-primary">Pricing & Options</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Choose the perfect package to honor your pet. Custom sizes and add-ons are available upon request.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {pricingTiers.map((tier) => (
            <Card key={tier.name} className={`flex flex-col h-full ${tier.isFeatured ? 'border-primary border-2 shadow-2xl scale-105' : ''}`}>
              <CardHeader className="items-center">
                {tier.isFeatured && <div className="text-sm font-bold text-primary-foreground bg-primary px-3 py-1 rounded-full mb-4 -mt-8">Most Popular</div>}
                <CardTitle className="text-3xl font-headline">{tier.name}</CardTitle>
                <p className="text-4xl font-bold text-primary mt-4">{tier.price}</p>
                <CardDescription className="mt-2 h-12">{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-accent mr-3" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full text-lg" size="lg" variant={tier.isFeatured ? 'default' : 'outline'}>
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
