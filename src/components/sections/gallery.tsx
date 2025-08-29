
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function Gallery() {
  const portraits = [
    { src: "/portfolio/portrait_0001.jpg", title: "Bella in Renaissance Style", aiHint: "dog renaissance" },
    { src: "/portfolio/portrait_0002.jpg", title: "Max in Classic Oil", aiHint: "cat oil" },
    { src: "/portfolio/portrait3.jpg", title: "Luna in Modern Minimalist", aiHint: "pet minimalist" },
    { src: "/portfolio/portrait_0004.jpg", title: "Charlie in Regal Style", aiHint: "dog regal" },
    { src: "/portfolio/portrait_0005.jpg", title: "Daisy in Soft Pastel", aiHint: "pet pastel" },
    { src: "/portfolio/portrait_0006.jpg", title: "Rocky in Contemporary Ink", aiHint: "pet ink" },
  ];

  return (
    <section id="gallery" className="bg-background py-24 px-6 md:px-16">
      {/* Section Heading */}
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="font-headline text-4xl md:text-5xl text-foreground"
        >
          Our Portrait Gallery
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="h-1 w-24 bg-accent mx-auto mt-4 rounded-full origin-left"
        />
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {portraits.map((portrait, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15, duration: 0.6 }}
            viewport={{ once: true }}
            className="relative group rounded-2xl overflow-hidden bg-card shadow-lg border border-border/20 hover:border-accent transition"
          >
            <Image
              src={portrait.src}
              alt={portrait.title}
              width={600}
              height={960}
              className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              data-ai-hint={portrait.aiHint}
            />
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="font-headline italic text-lg">{portrait.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <Button asChild className="rounded-full bg-primary text-primary-foreground px-10 py-4 text-lg shadow-md hover:shadow-lg hover:bg-primary/90 transition-all">
          <Link href="/#pricing">Commission Your Portrait</Link>
        </Button>
      </div>
    </section>
  );
}
