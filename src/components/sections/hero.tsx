'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full bg-background min-h-[90vh] flex flex-col justify-center"
    >
      <div className="w-full h-full container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-20 flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-center">

        {/* Left Column - Text */}
        <div className="flex flex-col justify-center z-10 order-2 md:order-1">
          <div className="max-w-xl">
            <motion.h1
              className="font-headline text-4xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] tracking-tight text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Transform Your Pet’s Photo Into <span className="italic text-primary">Timeless Art.</span>
            </motion.h1>

            {/* Trust Badge Social Proof */}
            <motion.div
              className="flex items-center justify-center md:justify-start gap-2 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex -space-x-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] text-yellow-900 font-bold">★</div>
                ))}
              </div>
              <span className="text-sm font-medium text-foreground/80">Trusted by 10,000+ Happy Pet Parents</span>
            </motion.div>

            <motion.p
              className="mt-6 text-lg md:text-xl text-secondary font-light leading-relaxed max-w-lg text-center md:text-left mx-auto md:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Commission a handcrafted portrait, created with museum-grade
              materials and designed to last for generations.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-row justify-center md:justify-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                asChild
                size="lg"
                className="rounded-full bg-primary text-primary-foreground px-8 py-6 text-lg shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-300"
              >
                <Link href="/order">Order Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-foreground/20 text-foreground px-8 py-6 text-lg hover:bg-foreground hover:text-background transition-all duration-300"
              >
                <Link href="/#gallery">View Gallery</Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Image */}
        <motion.div
          className="flex items-center justify-center order-1 md:order-2 w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.1 }}
        >
          <div className="relative w-full max-w-md md:max-w-full aspect-[4/5] md:aspect-square lg:aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl border border-white/10 rotate-2 hover:rotate-0 transition-transform duration-700">
            {/* Show the final "Room" shot as it's the most compelling */}
            <Image
              src="https://i.pinimg.com/1200x/38/b9/21/38b92132530a0bea91d48138380b624d.jpg"
              alt="Custom Pet Portrait on Wall"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        </motion.div>

      </div>

      {/* Schema for LocalBusiness/Organization Validation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Eterna Portrait",
            "url": "https://eternaportrait.com",
            "logo": "https://eternaportrait.com/logo.png",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "10432"
            },
            "sameAs": [
              "https://instagram.com/eter.naportrait"
            ]
          })
        }}
      />
    </section>
  );
}
