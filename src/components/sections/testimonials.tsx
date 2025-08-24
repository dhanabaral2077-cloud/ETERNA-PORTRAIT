"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Testimonials() {
  const testimonials = [
    {
      src: "/client1.jpg",
      quote:
        "The portrait of Bella is the centerpiece of our home. It feels like museum art.",
      name: "Sophia L.",
      location: "New York, USA",
      aiHint: "woman portrait",
    },
    {
      src: "/client2.jpg",
      quote:
        "Max’s portrait captures his soul. It’s more than art—it’s a family heirloom.",
      name: "Jonathan M.",
      location: "London, UK",
      aiHint: "man portrait",
    },
    {
      src: "/client3.jpg",
      quote:
        "When guests visit, they always ask about Luna’s painting. It has elevated our home.",
      name: "Elena R.",
      location: "Milan, Italy",
      aiHint: "woman smiling",
    },
  ];

  return (
    <section id="testimonials" className="bg-[#F5F2EB] py-24 px-6 md:px-16">
      {/* Section Heading */}
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="font-serif text-4xl md:text-5xl text-gray-900"
        >
          What Our Collectors Say
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="h-1 w-24 bg-[#C9A227] mx-auto mt-4 rounded-full origin-left"
        />
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {testimonials.map((t, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-white shadow-lg p-8 flex flex-col items-center text-center border border-[#e5e1d8] hover:border-[#C9A227] transition"
          >
            <img
              src="https://placehold.co/80x80.png"
              alt={t.name}
              className="w-20 h-20 object-cover rounded-full mb-6 border-2 border-[#C9A227]"
              data-ai-hint={t.aiHint}
            />
            <p className="font-serif italic text-lg text-gray-700 leading-relaxed mb-6">
              “{t.quote}”
            </p>
            <p className="font-sans text-sm uppercase tracking-wide text-gray-500">
              {t.name} — {t.location}
            </p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <Button asChild className="rounded-full bg-[#C9A227] text-white px-10 py-4 text-lg shadow-md hover:shadow-lg transition">
          <Link href="#contact">Commission Your Portrait</Link>
        </Button>
      </div>
    </section>
  );
}
