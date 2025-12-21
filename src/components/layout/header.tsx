"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [topBarActive, setTopBarActive] = useState(false);

  const { scrollY } = useScroll();
  const headerTop = useTransform(scrollY, [0, 40], [40, 0], { clamp: true });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    const checkTopBar = async () => {
      try {
        const res = await fetch('/api/marketing/campaign');
        if (res.ok) {
          const data = await res.json();
          if (data && data.top_bar_active) {
            setTopBarActive(true);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    checkTopBar();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: '/#gallery', label: 'Gallery' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/#testimonials', label: 'Testimonials' },
    { href: '/gift', label: 'Gift' },
    { href: '/blog', label: 'Blog' },
    { href: '/#pricing', label: 'Pricing' },
  ];

  return (
    <>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ top: topBarActive ? headerTop : 0 }}
        className={`fixed w-full z-50 flex items-center justify-between px-4 md:px-6 transition-all duration-300 ${scrolled
          ? "backdrop-blur-md bg-background/80 shadow-md h-20"
          : "bg-transparent h-24"
          } md:justify-between`}
      >
        {/* Mobile Logo (Centered) */}
        <div className="flex md:hidden justify-center flex-1">
          <Link href="/" className="relative block h-20 w-64">
            {/* Santa Hat Easter Egg */}
            <div className="absolute -top-1 left-8 w-10 h-10 rotate-[-15deg] z-10 animate-bounce-slow pointer-events-none">
              <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M414.195 91.875C397.662 50.817 394 65 373.136 68.966c-13.799 2.623-28.533-31.118-42.5-35.158-9.48-2.742-20.941 7.284-46.742 27.674-123.636 97.711-136.234 162.246-138.807 203.49-2.5 40.091 19.349 71.309 37.962 81.082 2.677 1.406 5.86-1.558 4.418-4.148-18.788-33.725-7.794-67.636 9.873-100.999 18.25-34.464 68.324-91.815 110.151-119.513 14.549-9.633 46.104-32.969 57.65-27.106 12.016 6.101 44.912 6.55 64.957 7.747 18.665 1.115 15.698-13.067-15.903-10.16zm-59.083 45.922c22.846 6.002 65.655 42.43 83.271 78.435 9.006 18.407 14.28 41.536 12.871 50.14-1.353 8.249-16.711 7.633-15.908-1.503 1.849-21.05-18.918-62.812-46.992-80.453-27.701-17.41-55.882-29.471-55.3-36.42.493-5.881 7.425-14.032 22.058-10.199z" fill="#D80027" />
                <path d="M68.528 359.395c-20.554 0-37.218 16.662-37.218 37.217s16.664 37.218 37.218 37.218c20.556 0 37.219-16.663 37.219-37.218s-16.663-37.217-37.219-37.217z" fill="#fff" />
                <path d="M439.066 123.016c-17.062 0-30.895 13.829-30.895 30.893 0 17.062 13.833 30.893 30.895 30.893 17.065 0 30.896-13.83 30.896-30.893 0-17.063-13.831-30.893-30.896-30.893z" fill="#fff" />
                <path d="M110.88 327.917c34.908 41.066 90.354 54.385 141.401 55.205 29.531.474 44.57 3.528 54.912 25.163 10.963 22.936-2.229 48.064-28.874 53.606-44.596 9.276-136.21-12.228-164.847-51.579-20.254-27.832 9.421-68.272-2.592-82.396z" fill="#fff" />
              </svg>
            </div>
            <Image
              src="/portfolio/Eterna_Portrait_Logo_Gold_Transparent.png"
              alt="Eterna Portrait Logo"
              fill
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* Desktop Logo (Left-Aligned) */}
        <div className="hidden md:flex items-center">
          <Link href="/" className="relative block h-20 w-64">
            {/* Santa Hat Easter Egg */}
            <div className="absolute -top-1 left-8 w-10 h-10 rotate-[-15deg] z-10 animate-bounce-slow pointer-events-none">
              <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M414.195 91.875C397.662 50.817 394 65 373.136 68.966c-13.799 2.623-28.533-31.118-42.5-35.158-9.48-2.742-20.941 7.284-46.742 27.674-123.636 97.711-136.234 162.246-138.807 203.49-2.5 40.091 19.349 71.309 37.962 81.082 2.677 1.406 5.86-1.558 4.418-4.148-18.788-33.725-7.794-67.636 9.873-100.999 18.25-34.464 68.324-91.815 110.151-119.513 14.549-9.633 46.104-32.969 57.65-27.106 12.016 6.101 44.912 6.55 64.957 7.747 18.665 1.115 15.698-13.067-15.903-10.16zm-59.083 45.922c22.846 6.002 65.655 42.43 83.271 78.435 9.006 18.407 14.28 41.536 12.871 50.14-1.353 8.249-16.711 7.633-15.908-1.503 1.849-21.05-18.918-62.812-46.992-80.453-27.701-17.41-55.882-29.471-55.3-36.42.493-5.881 7.425-14.032 22.058-10.199z" fill="#D80027" />
                <path d="M68.528 359.395c-20.554 0-37.218 16.662-37.218 37.217s16.664 37.218 37.218 37.218c20.556 0 37.219-16.663 37.219-37.218s-16.663-37.217-37.219-37.217z" fill="#fff" />
                <path d="M439.066 123.016c-17.062 0-30.895 13.829-30.895 30.893 0 17.062 13.833 30.893 30.895 30.893 17.065 0 30.896-13.83 30.896-30.893 0-17.063-13.831-30.893-30.896-30.893z" fill="#fff" />
                <path d="M110.88 327.917c34.908 41.066 90.354 54.385 141.401 55.205 29.531.474 44.57 3.528 54.912 25.163 10.963 22.936-2.229 48.064-28.874 53.606-44.596 9.276-136.21-12.228-164.847-51.579-20.254-27.832 9.421-68.272-2.592-82.396z" fill="#fff" />
              </svg>
            </div>
            <Image
              src="/portfolio/Eterna_Portrait_Logo_Gold_Transparent.png"
              alt="Eterna Portrait Logo"
              fill
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-10 font-headline text-sm uppercase tracking-widest">
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

        {/* CTA Button & Mobile Menu Button */}
        <div className="flex items-center justify-end">
          <Button asChild className="hidden md:block rounded-full bg-primary text-primary-foreground px-6 py-2 text-base shadow-sm hover:shadow-md hover:bg-primary/90 transition-all">
            <Link href="/#pricing">Order Now</Link>
          </Button>
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
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