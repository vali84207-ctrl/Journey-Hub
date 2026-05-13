import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const isHome = location === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    if (!isHome) {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/80 backdrop-blur-md border-b border-white/10 py-4 shadow-lg"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <span className="font-serif text-2xl tracking-widest text-primary font-bold">
                TAJIK ELITE
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection("services")} className="text-sm uppercase tracking-wider hover:text-primary transition-colors">Services</button>
            <Link href="/fleet" className="text-sm uppercase tracking-wider hover:text-primary transition-colors cursor-pointer">Fleet</Link>
            <button onClick={() => scrollToSection("booking")} className="text-sm uppercase tracking-wider hover:text-primary transition-colors">Book</button>
            <button onClick={() => scrollToSection("contact")} className="text-sm uppercase tracking-wider hover:text-primary transition-colors">Contact</button>
            
            <Button 
              className="bg-primary/10 text-primary border border-primary hover:bg-primary hover:text-black transition-all duration-300"
              onClick={() => window.open("https://wa.me/992000000000", "_blank")}
            >
              <Phone className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            <Link href="/admin" className="text-xs uppercase tracking-wider text-gray-500 hover:text-white transition-colors cursor-pointer">Admin</Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg border-b border-white/10 p-6 flex flex-col space-y-6 shadow-2xl">
          <button onClick={() => scrollToSection("services")} className="text-left text-lg uppercase tracking-wider hover:text-primary transition-colors">Services</button>
          <Link href="/fleet" onClick={() => setIsMobileMenuOpen(false)} className="text-left text-lg uppercase tracking-wider hover:text-primary transition-colors">Fleet</Link>
          <button onClick={() => scrollToSection("booking")} className="text-left text-lg uppercase tracking-wider hover:text-primary transition-colors">Book</button>
          <button onClick={() => scrollToSection("contact")} className="text-left text-lg uppercase tracking-wider hover:text-primary transition-colors">Contact</button>
          
          <Button 
            className="bg-primary text-black hover:bg-primary/90 w-full"
            onClick={() => window.open("https://wa.me/992000000000", "_blank")}
          >
            <Phone className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
          <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-center text-sm uppercase tracking-wider text-gray-500 hover:text-white transition-colors">Admin Access</Link>
        </div>
      )}
    </nav>
  );
}
