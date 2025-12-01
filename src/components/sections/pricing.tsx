'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { PRODUCT_PRICES } from '@/lib/pricing';

export function Pricing() {
  const getTierBasePrice = (planId: 'classic' | 'signature' | 'masterpiece') => {
    const productsInPlan = Object.values(PRODUCT_PRICES).filter(p => p.plan === planId);
    if (productsInPlan.length === 0) return 0;
    // Find the lowest base price in the plan
    return Math.min(...productsInPlan.map(p => p.basePrice));
  };

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
    <section id="pricing" className="bg-background py-24 px-6 md:px-16 relative overflow-hidden">
      {/* Background spotlight for middle card */}
      <div className="absolute inset-0 flex justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-accent/20 rounded-full blur-3xl -mt-20" />
      </div>

      {/* Section Heading */}
      <div className="text-center mb-16 relative z-10">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto relative z-10">
        {tiers.map((tier, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: idx * 0.2, duration: 0.7, type: 'spring' }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.07, rotate: tier.highlight ? 0.5 : 0 }}
            className={`relative flex flex-col rounded-2xl p-10 shadow-xl border backdrop-blur-sm transition-all
              ${tier.highlight
                ? 'z-20 scale-105 shadow-2xl border-accent/60 -mt-4'
                : 'z-10 border-muted/20 hover:border-accent/40'}
            `}
          >
            {/* Badge floats above card */}
            {tier.highlight && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute -top-7 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-sm font-semibold px-6 py-1.5 rounded-full shadow-lg z-30"
              >
                Most Popular
              </motion.div>
            )}

            {/* Highlight background (luxury glass gradient) */}
            {tier.highlight && (
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/40 via-primary/30 to-background/10 backdrop-blur-xl border border-accent/40 -z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.6, 0.8, 0.6] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            )}

            <div className="flex-grow relative z-10">
              <h3 className="font-headline text-2xl mb-4">{tier.name}</h3>
              <p className="text-4xl font-serif mb-2">{tier.price}</p>
              <p className="text-secondary mb-6 h-12">{tier.description}</p>

              <ul className="space-y-3 mb-8">
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
              className={`rounded-full w-full py-4 text-lg shadow-md transition-all relative overflow-hidden ${tier.highlight ? 'bg-accent text-accent-foreground hover:shadow-2xl' : ''
                }`}
            >
              <Link href={`/order?plan=${tier.id}`}>
                <span className="relative z-10">Start Commission</span>
                {tier.highlight && (
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                )}
              </Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
