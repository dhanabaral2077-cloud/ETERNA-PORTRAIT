'use client';

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export function Story() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Opacity transforms for each stage
  const photoOpacity = useTransform(scrollYProgress, [0.0, 0.25, 0.3], [1, 1, 0]);
  const paintingOpacity = useTransform(scrollYProgress, [0.25, 0.4, 0.55], [0, 1, 0]);
  const portraitOpacity = useTransform(scrollYProgress, [0.5, 0.65, 0.8], [0, 1, 0]);
  const roomOpacity = useTransform(scrollYProgress, [0.75, 0.9, 1], [0, 1, 1]);

  // Subtle zoom for luxury feel
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1]);

  // Animate text opacity + vertical movement
  const textAnimation = (opacity: any) => ({
    opacity,
    y: useTransform(opacity, [0, 1], [20, 0]),
  });

  return (
    <section ref={ref} className="relative h-[400vh] bg-background">
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        
        {/* Stage 1: Pet Photo */}
        <motion.div className="absolute w-full h-full" style={{ opacity: photoOpacity }}>
          <motion.div style={{ scale }} className="relative w-full h-full">
            <Image
              src="https://i.pinimg.com/1200x/21/f2/a1/21f2a107dcdbb48b1d942286d13ca2bc.jpg"
              alt="Pet Photo"
              fill
              className="object-cover"
              data-ai-hint="pet photo"
            />
          </motion.div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={textAnimation(photoOpacity)}
          >
            <p className="text-foreground font-headline text-xl md:text-2xl bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg shadow-md">
              It starts with your favorite memory.
            </p>
          </motion.div>
        </motion.div>

        {/* Stage 2: Painting In Progress */}
        <motion.div className="absolute w-full h-full" style={{ opacity: paintingOpacity }}>
          <motion.div style={{ scale }} className="relative w-full h-full">
            <Image
              src="https://i.pinimg.com/1200x/58/75/db/5875db632f386162b8b436c11152444e.jpg"
              alt="Painting in Progress"
              fill
              className="object-cover"
              data-ai-hint="painting process"
            />
          </motion.div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={textAnimation(paintingOpacity)}
          >
            <p className="text-foreground font-headline text-xl md:text-2xl bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg shadow-md">
              Hand-painted with care by our artists.
            </p>
          </motion.div>
        </motion.div>

        {/* Stage 3: Final Portrait */}
        <motion.div className="absolute w-full h-full" style={{ opacity: portraitOpacity }}>
          <motion.div style={{ scale }} className="relative w-full h-full">
            <Image
              src="https://i.pinimg.com/1200x/03/81/a2/0381a2ada56bf48e372ca9eb37a9b8be.jpg"
              alt="Final Portrait"
              fill
              className="object-cover border-8 border-primary"
              data-ai-hint="pet portrait"
            />
          </motion.div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={textAnimation(portraitOpacity)}
          >
            <p className="text-foreground font-headline text-xl md:text-2xl bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg shadow-md">
              A timeless masterpiece.
            </p>
          </motion.div>
        </motion.div>

        {/* Stage 4: Interior Showcase */}
        <motion.div className="absolute w-full h-full" style={{ opacity: roomOpacity }}>
          <motion.div style={{ scale }} className="relative w-full h-full">
            <Image
              src="https://i.pinimg.com/1200x/18/0f/4b/180f4b7aefadec786f3eba3e1c6c4f66.jpg"
              alt="Portrait in Room"
              fill
              className="object-cover"
              data-ai-hint="art gallery"
            />
          </motion.div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={textAnimation(roomOpacity)}
          >
            <div className="relative px-6 py-4 rounded-2xl backdrop-blur-xl bg-white/10 shadow-lg overflow-hidden">
              {/* Shimmer layer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" />
              <p className="relative font-headline text-3xl md:text-4xl 2xl:text-5xl text-transparent bg-clip-text bg-gradient-to-br from-white/90 to-white/40">
                Ready to elevate your space.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
