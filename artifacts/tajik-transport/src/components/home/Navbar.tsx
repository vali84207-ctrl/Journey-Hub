import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Calendar } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "Fleet", href: "#fleet" },
    { name: "Services", href: "#services" },
    { name: "Contact", href: "#contact" },
  ];

  const scrollToSection = (href: string) => {
    setMobileMenuOpen(false);
    if (href === "#") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: isScrolled
          ? "rgba(5,5,5,0.97)"
          : "rgba(5,5,5,0.82)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(203,169,78,0.12)",
      }}
    >
      <div className="mx-auto px-6 lg:px-10 flex items-center justify-between h-[70px]">

        {/* Logo + brand */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); scrollToSection("#"); }}
          className="flex items-center gap-3 flex-shrink-0"
        >
          <img
            src="/pamir-luxe-logo.png"
            alt="Pamir Luxe Drive"
            className="h-11 w-auto"
          />
          <div className="hidden sm:block leading-tight">
            <p className="text-primary font-serif font-bold text-sm tracking-[0.12em] uppercase">
              Pamir Luxe Drive
            </p>
            <p className="text-white/40 text-[9px] tracking-[0.2em] uppercase font-light">
              VIP Transportation
            </p>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
              className={`text-xs tracking-[0.15em] uppercase font-medium transition-colors duration-200 ${
                i === 0 ? "text-primary" : "text-white/70 hover:text-primary"
              }`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Reserve Now CTA */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => document.querySelector("#book")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center gap-2 border border-primary/70 text-primary hover:bg-primary hover:text-black transition-all duration-300 text-xs tracking-[0.2em] uppercase font-medium px-5 py-2.5"
          >
            <Calendar size={13} />
            Reserve Now
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white/80 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 border-b border-white/8 shadow-2xl py-6 px-6 flex flex-col gap-5 md:hidden"
            style={{ background: "rgba(5,5,5,0.98)", backdropFilter: "blur(16px)" }}
          >
            <div className="flex justify-center pb-4 border-b border-white/8">
              <img src="/pamir-luxe-logo.png" alt="Pamir Luxe Drive" className="h-14 w-auto" />
            </div>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                className="text-white/80 hover:text-primary transition-colors text-sm tracking-[0.15em] uppercase border-b border-white/5 pb-4"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={() => { setMobileMenuOpen(false); document.querySelector("#book")?.scrollIntoView({ behavior: "smooth" }); }}
              className="w-full border border-primary/70 text-primary text-sm tracking-widest uppercase py-4 flex items-center justify-center gap-2 hover:bg-primary hover:text-black transition-all"
            >
              <Calendar size={14} /> Reserve Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
