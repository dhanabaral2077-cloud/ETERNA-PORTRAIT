
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: '/#gallery', label: 'Gallery' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/#testimonials', 'label': 'Testimonials' },
    { href: '/#pricing', label: 'Pricing' },
  ];

  return (
    <>
      {/* Desktop / Tablet Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 w-full z-50 flex items-center justify-between px-4 md:px-8 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-md bg-background/80 shadow-md h-20"
            : "bg-transparent h-24"
        }`}
      >
        {/* Logo */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/" className="relative block h-16 w-48 md:h-20 md:w-64">
            <Image
                src="/Eterna_Portrait_Logo.png"
                alt="Eterna Portrait Logo"
                fill
                className="object-contain"
                priority
              />
          </Link>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 font-headline text-sm uppercase tracking-widest">
          {navItems.map((item, idx) => (
            <motion.a
              key={idx}
              href={item.href}
              className="relative text-foreground hover:text-primary transition-colors"
              whileHover="hover"
            >
              {item.label}
              <motion.span
                className="absolute left-0 -bottom-1 w-full h-[1px] bg-primary"
                initial={{ scaleX: 0 }}
                variants={{ hover: { scaleX: 1 } }}
                transition={{ duration: 0.3 }}
                style={{ originX: 0.5 }}
              />
            </motion.a>
          ))}
        </div>

        {/* CTA Button */}
        <Button asChild className="hidden md:block rounded-full bg-primary text-primary-foreground px-6 py-2 text-base shadow-sm hover:shadow-md hover:bg-primary/90 transition-all">
          <Link href="/#pricing">Order Now</Link>
        </Button>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background flex flex-col items-center justify-center z-40"
          >
            <div className="flex flex-col gap-8 font-headline text-2xl uppercase tracking-widest">
              {navItems.map((item, idx) => (
                <motion.a
                  key={idx}
                  href={item.href}
                  className="text-foreground hover:text-primary"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>

            <Button asChild className="mt-12 rounded-full bg-primary text-primary-foreground px-8 py-3 text-lg shadow-md hover:shadow-lg transition hover:bg-primary/90">
              <Link href="/#pricing" onClick={() => setMenuOpen(false)}>Order Now</Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
