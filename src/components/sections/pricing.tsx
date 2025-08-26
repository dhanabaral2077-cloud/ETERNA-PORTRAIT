
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Link from 'next/link';

export function Pricing() {
  const tiers = [
    {
      id: 'classic',
      name: 'Classic',
      price: '$450',
      description: 'For those seeking timeless elegance in a smaller format.',
      features: [
        'High-resolution digital file',
        'One pet included',
        'Fine art canvas print (12x16)',
      ],
      highlight: false,
    },
    {
      id: 'signature',
      name: 'Signature',
      price: '$950',
      description: 'Our most popular commission — premium and refined.',
      features: [
        'High-resolution digital file',
        'Up to two pets',
        'Premium canvas print (18x24)',
        'Hand-finished brush details',
      ],
      highlight: true,
    },
    {
      id: 'masterpiece',
      name: 'Masterpiece',
      price: '$1800',
      description: 'For collectors who demand the grandest expression.',
      features: [
        'High-resolution digital file',
        'Up to three pets',
        'Large-format canvas (24x36)',
        'Luxury gilded frame',
        'Priority commission',
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
          className="font-serif text-4xl md:text-5xl text-foreground"
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
            className={`relative rounded-2xl bg-card p-10 shadow-lg border transition-transform hover:-translate-y-2 ${
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

            <h3 className="font-serif text-2xl text-foreground mb-4">{tier.name}</h3>
            <p className="text-4xl font-serif text-foreground mb-2">{tier.price}</p>
            <p className="text-secondary mb-6 h-12">{tier.description}</p>

            <ul className="text-secondary space-y-3 mb-8">
              {tier.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <Check className="text-accent mr-2 h-5 w-5" /> {feature}
                </li>
              ))}
            </ul>

            <Button
              asChild
              size="lg"
              variant={tier.highlight ? 'default' : 'outline'}
              className="rounded-full w-full py-4 text-lg shadow-md transition-all"
            >
              <Link href={`/order?pkg=${tier.id}`}>Commission Now</Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
