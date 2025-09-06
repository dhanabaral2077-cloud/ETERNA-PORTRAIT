'use client';

import { motion, useScroll, useTransform } from "framer-motion";
import { Upload, Brush, Frame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

// Step type
interface Step {
  title: string;
  desc: string;
  icon: LucideIcon;
}

// StepCard props
interface StepCardProps {
  step: Step;
  idx: number;
}

const StepCard = ({ step, idx }: StepCardProps) => {
  const Icon = step.icon;
  return (
    <motion.div
      className="flex flex-col items-center text-center relative z-10"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.3, duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Icon Circle */}
      <motion.div
        className="relative w-20 h-20 rounded-full bg-accent text-accent-foreground flex items-center justify-center mb-4 shadow-md"
        whileHover={{ scale: 1.1, rotate: 10 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {/* Glowing ring */}
        <div className="absolute inset-0 rounded-full bg-accent/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="absolute top-1 text-xs font-headline opacity-70" aria-hidden="true">
          0{idx + 1}
        </span>
        <Icon
          size={26}
          aria-label={`${step.title} icon`}
          className="transition-transform group-hover:rotate-12"
        />
      </motion.div>

      {/* Title + Desc */}
      <h3 className="font-headline text-xl text-foreground mb-2">{step.title}</h3>
      <p className="font-body text-secondary max-w-xs transition-colors hover:text-primary">
        {step.desc}
      </p>
    </motion.div>
  );
};

export function HowItWorks() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const steps: Step[] = [
    {
      title: "Upload Your Pet's Photo",
      desc: "Simply share your favorite photo.",
      icon: Upload,
    },
    {
      title: "Select Your Style & Size",
      desc: "Choose from Fine Art Poster, Premium Canvas, or Luxury Print.",
      icon: Brush,
    },
    {
      title: "We Create & Deliver",
      desc: "Receive your hand-finished artwork, ready to display.",
      icon: Frame,
    },
  ];

  return (
    <section
      ref={ref}
      id="how-it-works"
      role="region"
      aria-labelledby="how-it-works-heading"
      className="relative py-20 px-4 md:px-8 overflow-hidden"
    >
      {/* Animated background gradient */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-10 rounded-lg"
        style={{
          background: "linear-gradient(120deg, hsl(var(--background)), hsl(var(--primary)/0.15), hsl(var(--background)))",
          backgroundSize: "200% 200%",
        }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
      />

      {/* Section Heading */}
      <div className="text-center mb-14">
        <motion.h2
          id="how-it-works-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="font-headline text-4xl md:text-5xl text-foreground"
        >
          How It Works
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="h-1 w-24 bg-gradient-to-r from-accent via-primary to-accent mx-auto mt-4 rounded-full origin-left shadow-[0_0_20px_rgba(250,204,21,0.4)]"
        />
      </div>

      {/* Steps with animated line */}
      <div className="relative flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto gap-16">
        {/* Connecting Line */}
        <motion.div
          className="absolute top-16 md:top-1/2 left-1/2 md:left-0 w-[2px] md:w-full md:h-[2px] h-[calc(100%-8rem)] origin-top md:origin-left -translate-x-1/2 md:translate-x-0"
          style={{
            scaleY: lineScale,
            scaleX: lineScale,
            background: "linear-gradient(90deg, transparent, hsl(var(--accent)), hsl(var(--primary)), hsl(var(--accent)), transparent)",
            backgroundSize: "200% 200%",
          }}
          animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
          transition={{ duration: 6, ease: "linear", repeat: Infinity }}
        />

        {steps.map((step, idx) => (
          <StepCard key={idx} step={step} idx={idx} />
        ))}
      </div>

      {/* CTA Button with breathing pulse */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        viewport={{ once: true }}
        className="text-center mt-14"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          whileHover={{ scale: 1.08 }}
        >
          <Button asChild className="rounded-full bg-primary text-primary-foreground px-10 py-4 text-lg shadow-md hover:shadow-lg hover:bg-primary/90 transition-all">
            <Link href="/#pricing">Start Your Portrait</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
