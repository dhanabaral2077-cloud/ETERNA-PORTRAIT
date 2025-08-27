
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { productOptions } from '@/app/order/page';


export function Pricing() {
  
  const getTierBasePrice = (planId: 'classic' | 'signature' | 'masterpiece') => {
    const defaultProduct = productOptions.types.find(p => p.plan === planId);
    const defaultSize = productOptions.sizes.find(s => s.id === '12x16'); // Base size
    if (defaultProduct && defaultSize) {
      return (defaultProduct.price * defaultSize.priceModifier) / 100;
    }
    return 0;
  }

  const tiers = [
    {
      id: 'classic',
      name: 'Fine Art Poster',
      price: `$${getTierBasePrice('classic')}+`,
      description: 'A beautiful, high-quality poster print of your pet.',
      features: [
        'High-resolution digital file',
        'One pet included',
        'Vibrant, museum-quality poster',
        'Multiple size options',
      ],
      highlight: false,
    },
    {
      id: 'signature',
      name: 'Premium Canvas',
      price: `$${getTierBasePrice('signature')}+`,
      description: 'Our most popular commission — premium and refined.',
      features: [
        'Everything in Classic, plus:',
        'Hand-stretched canvas',
        'Hand-finished brush details',
        'Option for elegant framing',
      ],
      highlight: true,
    },
    {
      id: 'masterpiece',
      name: 'Luxury Print',
      price: `$${getTierBasePrice('masterpiece')}+`,
      description: 'For collectors who demand the grandest expression.',
      features: [
        'Everything in Signature, plus:',
        'Luxury print materials (Metal, Acrylic)',
        'Up to three pets included',
        'Priority commission queue',
      ],
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="bg-background py-24 px-6 md:px-16">
      {/* Section Heading */}
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="font-headline text-4xl md:text-5xl text-foreground"
        >
          Commission Your Portrait
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="h-1 w-24 bg-accent mx-auto mt-4 rounded-full origin-left"
        />
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-4 text-secondary max-w-2xl mx-auto"
        >
          Begin by selecting a tier. You will customize the specific print type, size, and orientation on the next page.
        </motion.p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {tiers.map((tier, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2, duration: 0.7, type: 'spring' }}
            viewport={{ once: true }}
            className={`relative flex flex-col rounded-2xl bg-card p-10 shadow-lg border transition-transform hover:-translate-y-2 ${
              tier.highlight
                ? 'border-accent scale-105'
                : 'border-muted/20 hover:border-accent'
            }`}
          >
            {tier.highlight && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-sm font-semibold px-4 py-1 rounded-full shadow-md">
                Most Popular
              </div>
            )}

            <div className="flex-grow">
              <h3 className="font-headline text-2xl text-foreground mb-4">{tier.name}</h3>
              <p className="text-4xl font-serif text-foreground mb-2">{tier.price}</p>
              <p className="text-secondary mb-6 h-12">{tier.description}</p>

              <ul className="text-secondary space-y-3 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="text-accent mr-2 h-4 w-4 mt-1 shrink-0" /> {feature}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              asChild
              size="lg"
              variant={tier.highlight ? 'default' : 'outline'}
              className="rounded-full w-full py-4 text-lg shadow-md transition-all mt-auto"
            >
              <Link href={`/order?plan=${tier.id}`}>Start Commission</Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
