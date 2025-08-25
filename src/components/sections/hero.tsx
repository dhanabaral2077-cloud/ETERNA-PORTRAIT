
'use client';

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Scroll-driven transforms
  const photoOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const paintingOpacity = useTransform(scrollYProgress, [0.2, 0.7], [0, 1]);
  const roomOpacity = useTransform(scrollYProgress, [0.6, 1], [0, 1]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative h-[200vh] w-full bg-[#FAF9F7]"
    >
      <div className="sticky top-0 h-screen w-full grid grid-cols-1 md:grid-cols-2">
        {/* Left Column - Text */}
        <div className="flex flex-col justify-center items-start px-8 md:px-16 z-10">
          <motion.h1
            className="font-serif text-5xl md:text-6xl text-gray-800 leading-tight"
            style={{ y: textY }}
          >
            Transform Your Pet’s Photo Into Timeless Art.
          </motion.h1>

          <motion.p
            className="mt-6 text-lg text-gray-700 max-w-lg"
            style={{ y: textY }}
          >
            Commission a handcrafted portrait, created with museum-grade materials
            and designed to last for generations.
          </motion.p>

          <motion.div
            className="mt-8 flex gap-4"
            style={{ y: textY }}
          >
            <Button asChild size="lg" className="rounded-full bg-[#C9A227] text-white px-10 py-4 text-lg shadow-md hover:shadow-lg hover:bg-[#b8921d] transition">
              <Link href="#contact">Order Your Portrait</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-gray-800 text-gray-800 px-8 py-3 text-lg hover:border-[#C9A227] hover:text-[#C9A227] transition">
              <Link href="#gallery">View Gallery</Link>
            </Button>
          </motion.div>
        </div>

        {/* Right Column - Scroll Animation */}
        <div className="relative flex items-center justify-center overflow-hidden">
          {/* Stage 1: Dog Photo */}
          <motion.div
            className="absolute inset-0"
            style={{ opacity: photoOpacity }}
          >
            <Image
              src="https://placehold.co/800x1200.png"
              alt="Dog Photo"
              width={800}
              height={1200}
              className="object-cover w-full h-full"
              data-ai-hint="dog photo"
            />
          </motion.div>

          {/* Stage 2: Dog Painting */}
          <motion.div
            className="absolute inset-0"
            style={{ opacity: paintingOpacity }}
          >
            <Image
              src="https://placehold.co/800x1200.png"
              alt="Dog Painting"
              width={800}
              height={1200}
              className="object-cover w-full h-full"
              data-ai-hint="dog painting"
            />
          </motion.div>

          {/* Stage 3: Painting in Room */}
          <motion.div
            className="absolute inset-0"
            style={{ opacity: roomOpacity }}
          >
            <Image
              src="https://placehold.co/800x1200.png"
              alt="Dog Painting in Room"
              width={800}
              height={1200}
              className="object-cover w-full h-full"
              data-ai-hint="art gallery"
            />
          </motion.div>
        </div>

        {/* Scroll Cue */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-700 text-sm"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          style={{ opacity: photoOpacity }}
        >
          ↓ Scroll
        </motion.div>
      </div>
    </section>
  );
}
