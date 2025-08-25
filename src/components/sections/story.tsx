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

  // Scale subtle zoom in/out for luxury feel
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1]);

  return (
    <section ref={ref} id="story" className="relative h-[400vh] bg-background">
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Stage 1: Pet Photo */}
        <motion.div
            className="absolute w-full h-full"
            style={{ opacity: photoOpacity, scale }}
        >
            <Image
                src="https://placehold.co/800x1200.png"
                alt="Pet Photo"
                layout="fill"
                objectFit="contain"
                className="rounded-xl shadow-lg"
                data-ai-hint="pet photo"
            />
        </motion.div>


        {/* Stage 2: Painting In Progress */}
        <motion.div
            className="absolute w-full h-full"
            style={{ opacity: paintingOpacity, scale }}
        >
            <Image
                src="https://placehold.co/800x1200.png"
                alt="Painting in Progress"
                layout="fill"
                objectFit="contain"
                className="rounded-xl shadow-lg"
                data-ai-hint="painting process"
            />
        </motion.div>


        {/* Stage 3: Final Portrait */}
        <motion.div
            className="absolute w-full h-full p-20"
            style={{ opacity: portraitOpacity, scale }}
        >
            <Image
                src="https://placehold.co/800x1200.png"
                alt="Final Portrait"
                layout="fill"
                objectFit="contain"
                className="rounded-xl shadow-lg border-8 border-primary"
                data-ai-hint="pet portrait"
            />
        </motion.div>


        {/* Stage 4: Interior Showcase */}
        <motion.div
            className="absolute w-full h-full"
            style={{ opacity: roomOpacity, scale }}
        >
            <Image
                src="https://placehold.co/1200x800.png"
                alt="Portrait in Room"
                layout="fill"
                objectFit="cover"
                data-ai-hint="art gallery"
            />
        </motion.div>
      </div>
    </section>
  );
}
