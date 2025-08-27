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

  // Animate text opacity along with its corresponding image
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
                src="/portfolio/portrait_006.jpg"
                alt="Pet Photo"
                layout="fill"
                objectFit="cover"
                data-ai-hint="pet photo"
            />
          </motion.div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={textAnimation(photoOpacity)}
          >
            <p
              className="text-foreground font-headline text-xl max-w-md bg-background/70 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md"
            >
              It starts with your favorite memory.
            </p>
          </motion.div>
        </motion.div>

        {/* Stage 2: Painting In Progress */}
        <motion.div className="absolute w-full h-full" style={{ opacity: paintingOpacity }}>
          <motion.div style={{ scale }} className="relative w-full h-full">
            <Image
                src="/portfolio/portrait_007.png"
                alt="Painting in Progress"
                layout="fill"
                objectFit="cover"
                data-ai-hint="painting process"
            />
          </motion.div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={textAnimation(paintingOpacity)}
          >
            <p
              className="text-foreground font-headline text-xl max-w-md bg-background/70 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md"
            >
              Hand-painted with care by our artists.
            </p>
          </motion.div>
        </motion.div>

        {/* Stage 3: Final Portrait */}
        <motion.div className="absolute w-full h-full" style={{ opacity: portraitOpacity }}>
          <motion.div style={{ scale }} className="relative w-full h-full">
            <Image
                src="/portfolio/portrait_004.jpg"
                alt="Final Portrait"
                layout="fill"
                objectFit="cover"
                className="border-8 border-primary"
                data-ai-hint="pet portrait"
            />
          </motion.div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={textAnimation(portraitOpacity)}
          >
            <p
              className="text-foreground font-headline text-xl max-w-md bg-background/70 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md"
            >
              A timeless masterpiece.
            </p>
          </motion.div>
        </motion.div>

        {/* Stage 4: Interior Showcase */}
        <motion.div className="absolute w-full h-full" style={{ opacity: roomOpacity }}>
            <motion.div style={{ scale }} className="relative w-full h-full">
              <Image
                  src="/portfolio/portrait_005.jpg"
                  alt="Portrait in Room"
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint="art gallery"
              />
            </motion.div>
             <motion.div
                className="absolute inset-0 flex items-center justify-center"
                style={textAnimation(roomOpacity)}
            >
              <p
                className="text-foreground font-headline text-xl max-w-md bg-background/70 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md"
              >
                Ready to elevate your space.
              </p>
            </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
