"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function Gallery() {
  const portraits = [
    { 
      src: "https://i.pinimg.com/736x/f2/c5/e7/f2c5e7faef71372a364cec114b950d49.jpg", 
      title: "Bella in Renaissance Style", 
      aiHint: "dog renaissance" 
    },
    { 
      src: "https://i.pinimg.com/736x/9f/23/cb/9f23cb991c51c130f83ad8169a75388b.jpg", 
      title: "Max in Classic Oil", 
      aiHint: "cat oil" 
    },
    { 
      src: "https://i.pinimg.com/1200x/cd/5a/ca/cd5acac70dd4da1454ef66b95543676b.jpg", 
      title: "Luna in Modern Minimalist", 
      aiHint: "pet minimalist" 
    },
    { 
      src: "https://i.pinimg.com/1200x/1f/38/b7/1f38b71214e5233cd9ad8c4fb9d1d947.jpg", 
      title: "Charlie in Regal Style", 
      aiHint: "dog regal" 
    },
    { 
      src: "https://i.pinimg.com/1200x/33/63/2d/33632d69759732a62a1204666c250b0e.jpg", 
      title: "Daisy in Soft Pastel", 
      aiHint: "pet pastel" 
    },
    { 
      src: "https://i.pinimg.com/1200x/53/b9/73/53b973489c2b94f4cadcc19c6bc49aca.jpg", 
      title: "Rocky in Contemporary Ink", 
      aiHint: "pet ink" 
    },
  ];

  // Parent animation for stagger effect
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  // Each card animation
  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 20 } },
  };

  return (
    <section id="gallery" className="bg-background py-24 px-6 md:px-16 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-[800px] h-[800px] bg-accent/10 rounded-full blur-3xl mx-auto -mt-40" />
      </div>

      {/* Section Heading */}
      <div className="text-center mb-16 relative z-10">
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
          className="h-1 w-24 bg-gradient-to-r from-accent via-primary to-accent mx-auto mt-4 rounded-full origin-left shadow-[0_0_20px_rgba(250,204,21,0.4)]"
        />
      </div>

      {/* Gallery Grid with staggered animation */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10"
      >
        {portraits.map((portrait, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            whileHover={{ y: -8, rotateX: 4, rotateY: -4 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative group rounded-2xl overflow-hidden bg-card shadow-lg border border-border/20 hover:border-accent/50 transition-all perspective-1000"
          >
            {/* Image */}
            <motion.div
              className="relative w-full h-96"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <Image
                src={portrait.src}
                alt={portrait.title}
                fill
                className="object-cover"
                data-ai-hint={portrait.aiHint}
              />
            </motion.div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Title with glass effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg"
            >
              <p className="font-headline italic text-lg text-white drop-shadow-md">{portrait.title}</p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Button with hover + breathing pulse */}
      <div className="text-center mt-20 relative z-10">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          whileHover={{ scale: 1.08 }}
        >
          <Button
            asChild
            size="lg"
            className="rounded-full bg-primary text-primary-foreground px-12 py-5 text-xl shadow-md hover:shadow-lg hover:bg-primary/90 transition-all"
          >
            <Link href="/#pricing">Commission Your Portrait</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
