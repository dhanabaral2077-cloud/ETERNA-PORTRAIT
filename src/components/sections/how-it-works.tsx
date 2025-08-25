'use client';

import { motion, useScroll, useTransform } from "framer-motion";
import { Upload, Brush, Frame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import Link from "next/link";

export function HowItWorks() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const steps = [
    {
      title: "Upload Your Pet's Photo",
      desc: "Simply share your favorite photo.",
      icon: <Upload size={32} />,
    },
    {
      title: "Select Your Style & Size",
      desc: "Choose from Classic, Signature, or Masterpiece.",
      icon: <Brush size={32} />,
    },
    {
      title: "We Create & Deliver",
      desc: "Receive your hand-finished artwork, ready to display.",
      icon: <Frame size={32} />,
    },
  ];

  return (
    <section ref={ref} id="how-it-works" className="relative py-24 px-6 md:px-16 bg-card">
      {/* Section Heading */}
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="font-serif text-4xl md:text-5xl text-gray-900"
        >
          How It Works
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="h-1 w-24 bg-primary mx-auto mt-4 rounded-full origin-left"
        />
      </div>

      {/* Steps */}
      <div className="relative flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto gap-20">
        {/* Connecting Line */}
        <div className="absolute top-10 md:top-1/2 left-1/2 md:left-0 -translate-x-1/2 md:-translate-x-0 w-[2px] md:w-full md:h-[2px] h-full bg-primary/30" />
        <motion.div
          className="absolute top-10 md:top-1/2 left-1/2 md:left-0 -translate-x-1/2 md:-translate-x-0 w-[2px] md:w-full md:h-[2px] h-full bg-primary origin-top md:origin-left"
          style={{ scaleY: lineScale, scaleX: lineScale }}
        />

        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            className="flex flex-col items-center text-center relative z-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Numbered Circle */}
            <motion.div
              className="w-24 h-24 rounded-full bg-background border border-border flex items-center justify-center mb-4 shadow-md relative"
              whileHover={{ scale: 1.1, boxShadow: "0px 10px 20px rgba(201,162,39,0.2)" }}
            >
              <div className="absolute inset-0 bg-primary/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
              <div className="relative text-primary">
                {step.icon}
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm border-2 border-background">
                {idx + 1}
              </div>
            </motion.div>
            <h3 className="font-serif text-xl text-gray-900 mb-2">{step.title}</h3>
            <p className="font-sans text-gray-600 max-w-xs">{step.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        viewport={{ once: true }}
        className="text-center mt-20"
      >
        <Button asChild className="rounded-full bg-primary text-primary-foreground px-10 py-4 text-lg shadow-md hover:shadow-lg transition">
          <Link href="#contact">Start Your Portrait</Link>
        </Button>
      </motion.div>
    </section>
  );
}
