"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Testimonials() {
  const testimonials = [
    {
      src: "/portfolio/collector1.png",
      quote:
        "The portrait of Bella is the centerpiece of our home. It feels like museum art.",
      name: "Sophia L.",
      location: "New York, USA",
      aiHint: "woman portrait",
    },
    {
      src: "/portfolio/collector2.png",
      quote:
        "Max’s portrait captures his soul. It’s more than art—it’s a family heirloom.",
      name: "Jonathan M.",
      location: "London, UK",
      aiHint: "man portrait",
    },
    {
      src: "/portfolio/collector3.png",
      quote:
        "When guests visit, they always ask about Luna’s painting. It has elevated our home.",
      name: "Elena R.",
      location: "Milan, Italy",
      aiHint: "woman smiling",
    },
  ];

  return (
    <section id="testimonials" className="bg-background py-24 px-6 md:px-16">
      {/* Section Heading */}
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="font-headline text-4xl md:text-5xl text-foreground"
        >
          What Our Collectors Say
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="h-1 w-24 mx-auto mt-4 rounded-full origin-left 
                     bg-gradient-to-r from-accent via-primary to-accent
                     shadow-[0_0_15px_rgba(250,204,21,0.3)]"
        />
      </div>

      {/* Reviews Summary */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center space-x-2 bg-card border border-muted/20 px-6 py-3 rounded-full shadow-sm">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
            ))}
          </div>
          <span className="font-medium text-foreground">4.9/5 Stars</span>
          <span className="text-muted-foreground text-sm">(500+ Verified Reviews)</span>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {testimonials.map((t, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
            className="relative rounded-2xl bg-card p-8 flex flex-col items-center text-center 
                       border border-muted/20 shadow-lg 
                       hover:shadow-xl transition-all duration-300"
          >
            {/* Verified Badge */}
            <div className="absolute top-4 right-4 flex items-center space-x-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              <span>Verified Buyer</span>
            </div>

            {/* Collector Image */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <Image
                src={t.src}
                width={80}
                height={80}
                alt={t.name}
                className="w-20 h-20 object-cover rounded-full border-2 border-accent shadow-md"
                data-ai-hint={t.aiHint}
              />
              <div className="absolute inset-0 rounded-full bg-accent/30 blur-lg opacity-70 animate-pulse" />
            </motion.div>

            {/* Quote */}
            <p className="font-headline italic text-lg text-secondary leading-relaxed my-6">
              “{t.quote}”
            </p>

            {/* Name + Location */}
            <p className="font-body text-sm uppercase tracking-wide text-muted-foreground">
              {t.name} — {t.location}
            </p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        viewport={{ once: true }}
        className="text-center mt-20"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          whileHover={{ scale: 1.08 }}
        >
          <Button asChild className="rounded-full bg-primary text-primary-foreground px-12 py-5 text-xl shadow-md hover:shadow-lg hover:bg-primary/90 transition-all">
            <Link href="/#pricing">Commission Your Portrait</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
