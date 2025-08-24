
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
    { href: '#process', label: 'Process' },
    { href: '#story', label: 'Our Story' },
    { href: '#testimonials', 'label': 'Testimonials' },
    { href: '#pricing', label: 'Pricing' },
  ];

  return (
    <>
      {/* Desktop / Tablet Navbar */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 w-full z-50 flex items-center justify-between px-8 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-md bg-white/80 shadow-md h-16"
            : "bg-transparent h-20"
        }`}
      >
        {/* Logo */}
        <motion.div
          className="font-serif text-xl tracking-[0.15em] text-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/">Pet Masterpiece</Link>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 font-serif text-sm uppercase tracking-widest">
          {navItems.map((item, idx) => (
            <motion.a
              key={idx}
              href={item.href}
              className="relative text-gray-900 hover:text-[#C9A227] transition-colors"
              whileHover="hover"
            >
              {item.label}
              <motion.span
                className="absolute left-0 -bottom-1 w-full h-[1px] bg-[#C9A227]"
                initial={{ scaleX: 0 }}
                variants={{ hover: { scaleX: 1 } }}
                transition={{ duration: 0.3 }}
                style={{ originX: 0.5 }}
              />
            </motion.a>
          ))}
        </div>

        {/* CTA Button */}
        <Button asChild className="hidden md:block rounded-full bg-[#C9A227] text-white px-6 py-2 text-sm shadow-md hover:shadow-lg transition">
          <Link href="#contact">Order Now</Link>
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
            className="fixed inset-0 bg-white flex flex-col items-center justify-center z-40"
          >
            <div className="flex flex-col gap-8 font-serif text-2xl uppercase tracking-widest">
              {navItems.map((item, idx) => (
                <motion.a
                  key={idx}
                  href={item.href}
                  className="text-gray-900 hover:text-[#C9A227]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>

            <Button asChild className="mt-12 rounded-full bg-[#C9A227] text-white px-8 py-3 text-lg shadow-md hover:shadow-lg transition">
              <Link href="#contact" onClick={() => setMenuOpen(false)}>Order Now</Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
