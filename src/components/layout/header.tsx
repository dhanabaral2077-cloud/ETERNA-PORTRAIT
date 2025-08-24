
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    { href: '#gallery', label: 'Gallery' },
    { href: '#process', label: 'Our Process' },
    { href: '#story', label: 'Our Story' },
    { href: '#testimonials', 'label': 'Testimonials' },
    { href: '#pricing', label: 'Pricing' },
  ];

  return (
    <>
      {/* Desktop / Tablet Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`fixed top-0 w-full z-50 flex items-center justify-between px-8 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-xl bg-background/80 shadow-md h-16"
            : "bg-transparent h-20"
        }`}
      >
        {/* Logo */}
        <motion.div
          className="font-headline text-xl tracking-[0.2em] text-foreground uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/">Pet Masterpiece</Link>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 font-headline text-sm uppercase" style={{ letterSpacing: '2px' }}>
          {navItems.map((item, idx) => (
            <motion.a
              key={idx}
              href={item.href}
              className="relative text-foreground transition-colors hover:text-primary group"
              whileHover="hover"
            >
              <span>{item.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
            </motion.a>
          ))}
        </div>

        {/* CTA Button */}
        <Button 
            asChild 
            className="hidden md:flex rounded-full bg-primary text-primary-foreground px-6 py-2 text-sm uppercase tracking-wider shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 transform transition-all"
        >
          <Link href="#contact">Order Now</Link>
        </Button>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <motion.button 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
            className="z-50 relative"
          >
            <AnimatePresence initial={false}>
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-0 bg-background flex flex-col items-center justify-center z-40"
          >
            <div className="flex flex-col gap-8 text-center">
              {navItems.map((item, idx) => (
                <motion.a
                  key={idx}
                  href={item.href}
                  className="font-headline text-2xl uppercase text-foreground transition-colors hover:text-primary"
                  style={{ letterSpacing: '2px' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx + 0.2, ease: 'easeInOut' }}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>

            <div className="absolute bottom-10 w-full px-8">
              <Button 
                asChild 
                className="w-full rounded-full bg-primary text-primary-foreground px-8 py-6 text-lg uppercase tracking-wider shadow-lg hover:shadow-primary/40"
              >
                <Link href="#contact" onClick={() => setMenuOpen(false)}>Order Now</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
