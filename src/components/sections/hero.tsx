
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
  const photoOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const paintingOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const roomOpacity = useTransform(scrollYProgress, [0.45, 0.75], [0, 1]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative h-[200vh] w-full bg-background"
    >
      <div className="sticky top-0 h-screen w-full grid grid-cols-1 md:grid-cols-2">
        {/* Left Column - Text */}
        <div className="flex flex-col justify-center items-start px-8 md:px-16 z-10">
          <motion.h1
            className="font-serif text-5xl md:text-6xl text-foreground leading-tight"
            style={{ y: textY }}
          >
            Transform Your Pet’s Photo Into Timeless Art.
          </motion.h1>

          <motion.p
            className="mt-6 text-lg text-secondary max-w-lg"
            style={{ y: textY }}
          >
            Commission a handcrafted portrait, created with museum-grade materials
            and designed to last for generations.
          </motion.p>

          <motion.div
            className="mt-8 flex gap-4"
            style={{ y: textY }}
          >
            <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground px-10 py-4 text-lg shadow-md hover:shadow-lg hover:bg-primary/90 transition-all">
              <Link href="#contact">Order Your Portrait</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full border-foreground text-foreground px-10 py-4 text-lg hover:bg-foreground hover:text-background transition-colors">
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
              src="/portfolio/portrait_001.jpg"
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
              src="/portfolio/portrait_002.jpg"
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
              src="/portfolio/portrait_003.jpg"
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
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-secondary text-sm"
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
