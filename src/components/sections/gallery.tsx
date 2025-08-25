
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function Gallery() {
  const portraits = [
    { src: "https://placehold.co/600x800.png", title: "Bella in Renaissance Style", aiHint: "dog renaissance" },
    { src: "https://placehold.co/600x800.png", title: "Max in Classic Oil", aiHint: "cat oil" },
    { src: "https://placehold.co/600x800.png", title: "Luna in Modern Minimalist", aiHint: "pet minimalist" },
    { src: "https://placehold.co/600x800.png", title: "Charlie in Regal Style", aiHint: "dog regal" },
    { src: "https://placehold.co/600x800.png", title: "Daisy in Soft Pastel", aiHint: "pet pastel" },
    { src: "https://placehold.co/600x800.png", title: "Rocky in Contemporary Ink", aiHint: "pet ink" },
  ];

  return (
    <section id="gallery" className="bg-[#FAF9F7] py-24 px-6 md:px-16">
      {/* Section Heading */}
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="font-serif text-4xl md:text-5xl text-gray-800"
        >
          Our Portrait Gallery
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="h-1 w-24 bg-[#C9A227] mx-auto mt-4 rounded-full origin-left"
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
            className="relative group rounded-2xl overflow-hidden bg-white shadow-lg border border-border hover:border-primary transition"
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
              <p className="font-serif italic text-lg">{portrait.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <Button asChild className="rounded-full bg-[#C9A227] text-white px-10 py-4 text-lg shadow-md hover:shadow-lg hover:bg-[#b8921d] transition">
          <Link href="#contact">Commission Your Portrait</Link>
        </Button>
      </div>
    </section>
  );
}
