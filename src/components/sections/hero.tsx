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

  // Ken Burns Scale Effect
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative h-[200vh] w-full bg-background"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col md:grid md:grid-cols-2 pt-20 md:pt-24 pb-4">
        {/* Left Column - Text */}
        <div className="flex flex-col justify-center px-6 md:px-12 lg:px-20 z-10 order-1 md:order-none flex-shrink-0 md:flex-shrink md:h-full py-4 md:py-0">
          <div className="max-w-xl 2xl:max-w-3xl">
            <motion.h1
              className="font-headline text-4xl md:text-7xl 2xl:text-8xl text-foreground leading-[1.1] tracking-tight text-center md:text-left"
              style={{ y: textY }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              Transform Your Pet’s Photo Into <span className="italic text-primary">Timeless Art.</span>
            </motion.h1>

            <motion.p
              className="mt-4 md:mt-8 text-base md:text-xl 2xl:text-2xl text-secondary font-light leading-relaxed max-w-lg text-center md:text-left mx-auto md:mx-0"
              style={{ y: textY }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              Commission a handcrafted portrait, created with museum-grade
              materials and designed to last for generations.
            </motion.p>

            <motion.div
              className="mt-6 md:mt-12 flex flex-row justify-center md:justify-start gap-4 md:gap-6"
              style={{ y: textY }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Button
                asChild
                size="lg"
                className="rounded-full bg-primary text-primary-foreground px-6 md:px-10 py-4 md:py-6 text-base md:text-lg shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-500"
              >
                <Link href="/order">Order Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-foreground/20 text-foreground px-6 md:px-10 py-4 md:py-6 text-base md:text-lg hover:bg-foreground hover:text-background transition-all duration-500"
              >
                <Link href="/#gallery">Gallery</Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Scroll Animation */}
        <div className="flex items-center justify-center p-4 md:p-12 order-2 md:order-none flex-grow md:h-full overflow-hidden">
          <div className="relative w-full h-full max-h-[45vh] md:max-h-[85vh] aspect-[3/4] md:aspect-[4/5] mx-auto overflow-hidden rounded-[1.5rem] md:rounded-[2rem] shadow-2xl border border-white/10">
            {/* Stage 1: Dog Photo */}
            <motion.div className="absolute inset-0" style={{ opacity: photoOpacity, scale }}>
              <Image
                src="https://i.pinimg.com/1200x/93/34/60/933460815012f2e0f481bde5c69204c8.jpg"
                alt="Dog Photo"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>

            {/* Stage 2: Dog Painting */}
            <motion.div className="absolute inset-0" style={{ opacity: paintingOpacity, scale }}>
              <Image
                src="https://i.pinimg.com/1200x/0d/b9/14/0db9141569c4224ad829e91ccfacc9b5.jpg"
                alt="Dog Painting"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>

            {/* Stage 3: Painting in Room */}
            <motion.div className="absolute inset-0" style={{ opacity: roomOpacity, scale }}>
              <Image
                src="https://i.pinimg.com/1200x/38/b9/21/38b92132530a0bea91d48138380b624d.jpg"
                alt="Dog Painting in Room"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>

            {/* Overlay Gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Scroll Cue */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground text-sm tracking-widest uppercase"
          animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          style={{ opacity: photoOpacity }}
        >
          Scroll to Explore
        </motion.div>
      </div>
    </section>
  );
}
