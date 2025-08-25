'use client';

import { motion, useScroll, useTransform, useAnimation } from "framer-motion";
import { Upload, Brush, Frame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useEffect } from "react";
import Link from "next/link";

export function HowItWorks() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // shimmer animation controller
  const shimmerControls = useAnimation();
  useEffect(() => {
    shimmerControls.start({
      opacity: [0.6, 1, 0.6],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    });
  }, [shimmerControls]);

  const steps = [
    {
      title: "Upload Your Pet's Photo",
      desc: "Simply share your favorite photo.",
      icon: Upload,
    },
    {
      title: "Select Your Style & Size",
      desc: "Choose from Classic, Signature, or Masterpiece.",
      icon: Brush,
    },
    {
      title: "We Create & Deliver",
      desc: "Receive your hand-finished artwork, ready to display.",
      icon: Frame,
    },
  ];

  return (
    <motion.section
      ref={ref}
      id="how-it-works"
      initial={{ opacity: 0.8, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ once: true }}
      className="relative py-24 px-6 md:px-16 overflow-hidden"
    >
        <motion.div
            aria-hidden="true"
            className="absolute inset-0 -z-10 rounded-lg"
            style={{
                background: "linear-gradient(120deg, #FAF9F7, #F5E8C7, #FAF9F7)",
                backgroundSize: "300% 300%",
            }}
            animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
                duration: 60,
                ease: "linear",
                repeat: Infinity,
            }}
        />
      {/* Section Heading */}
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="font-serif text-4xl md:text-5xl text-gray-800"
        >
          How It Works
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="h-1 w-24 bg-[#C9A227] mx-auto mt-4 rounded-full origin-left"
        />
      </div>

      {/* Steps */}
      <div className="relative flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto gap-20">
        {/* Connecting Line with shimmer */}
        <motion.div
          animate={shimmerControls}
          className="absolute md:top-1/2 top-16 left-10 md:left-0 w-[2px] md:w-full md:h-[2px] h-full bg-[#C9A227] origin-top md:origin-left"
          style={{ scaleY: lineScale, scaleX: lineScale, opacity: 0.8 }}
        />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={idx}
              className="flex flex-col items-center text-center relative z-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Numbered Circle with pulse + icon animation */}
              <motion.div
                className="w-20 h-20 rounded-full bg-[#C9A227] text-white flex items-center justify-center mb-4 shadow-md relative"
                whileHover={{ scale: 1.1, boxShadow: "0px 10px 20px rgba(201,162,39,0.4)" }}
                whileInView={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                viewport={{ once: false }}
              >
                <span className="absolute top-1 text-xs font-serif opacity-80">0{idx + 1}</span>
                <motion.div
                  initial={{ opacity: 0, rotate: -20 }}
                  whileInView={{ opacity: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Icon size={24} />
                </motion.div>
              </motion.div>
              <h3 className="font-serif text-xl text-gray-800 mb-2">{step.title}</h3>
              <p className="font-sans text-gray-700 max-w-xs">{step.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        viewport={{ once: true }}
        className="text-center mt-16"
      >
        <Button asChild className="rounded-full bg-[#C9A227] text-white px-10 py-4 text-lg shadow-md hover:shadow-lg hover:bg-[#b8921d] transition">
          <Link href="#contact">Start Your Portrait</Link>
        </Button>
      </motion.div>
    </motion.section>
  );
}
