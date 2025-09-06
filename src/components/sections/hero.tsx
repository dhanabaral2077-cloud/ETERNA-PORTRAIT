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
    offset: ["start start", "end end"],
  });

  // Transitions
  const photoOpacity = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 1, 0]);
  const paintingOpacity = useTransform(scrollYProgress, [0.25, 0.4, 0.55], [0, 1, 0]);
  const roomOpacity = useTransform(scrollYProgress, [0.5, 0.7, 1], [0, 1, 1]);
  const textY = useTransform(scrollYProgress, [0, 0.6], [0, -50]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative h-[200vh] w-full bg-background"
    >
      <div className="sticky top-16 md:top-0 h-screen w-full grid grid-cols-1 md:grid-cols-2">
        {/* Left Column - Text */}
        <div className="flex flex-col justify-center h-full px-6 md:px-12 lg:px-20 z-10">
          <div className="max-w-xl 2xl:max-w-2xl">
            <motion.h1
              className="font-headline text-4xl md:text-6xl 2xl:text-7xl text-foreground leading-tight"
              style={{ y: textY }}
            >
              Transform Your Pet’s Photo Into Timeless Art.
            </motion.h1>

            <motion.p
              className="mt-6 text-base md:text-lg 2xl:text-xl text-secondary"
              style={{ y: textY }}
            >
              Commission a handcrafted portrait, created with museum-grade
              materials and designed to last for generations.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col sm:flex-row gap-4"
              style={{ y: textY }}
            >
              <Button
                asChild
                size="lg"
                className="rounded-full bg-primary text-primary-foreground px-8 md:px-10 2xl:px-12 py-4 md:py-5 text-base md:text-lg 2xl:text-xl shadow-md hover:shadow-lg hover:bg-primary/90 transition-all"
              >
                <Link href="/order">Order Your Portrait</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-foreground text-foreground px-8 md:px-10 2xl:px-12 py-4 md:py-5 text-base md:text-lg 2xl:text-xl hover:bg-foreground hover:text-background transition-colors"
              >
                <Link href="/#gallery">View Gallery</Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Scroll Animation */}
        <div className="flex items-center justify-center h-full">
          <div className="relative w-full h-full aspect-[3/4] md:aspect-[4/5] max-h-[90vh] mx-auto">
            {/* Stage 1: Dog Photo */}
            <motion.div className="absolute inset-0" style={{ opacity: photoOpacity }}>
              <Image
                src="/portfolio/Brenden Dog1.jpg"
                alt="Dog Photo"
                fill
                className="object-cover rounded-2xl shadow-md"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>

            {/* Stage 2: Dog Painting */}
            <motion.div className="absolute inset-0" style={{ opacity: paintingOpacity }}>
              <Image
                src="/portfolio/Brenden Dog2.jpg"
                alt="Dog Painting"
                fill
                className="object-cover rounded-2xl shadow-md"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>

            {/* Stage 3: Painting in Room */}
            <motion.div className="absolute inset-0" style={{ opacity: roomOpacity }}>
              <Image
                src="/portfolio/Brenden Dog3.png"
                alt="Dog Painting in Room"
                fill
                className="object-cover rounded-2xl shadow-md"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </div>

        {/* Scroll Cue */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-secondary text-sm md:text-base"
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
