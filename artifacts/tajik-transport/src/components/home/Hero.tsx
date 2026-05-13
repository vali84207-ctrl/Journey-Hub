import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
  const scrollToBooking = () => {
    document.querySelector("#book")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transform transition-transform duration-[20s] ease-out hover:scale-100"
          style={{ backgroundImage: `url(/lc-hero.png)` }}
        />
        {/* layered overlays for depth and readability */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/40" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-6 py-32 text-center max-w-5xl">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex justify-center mb-10"
        >
          <img
            src="/pamir-luxe-logo.png"
            alt="Pamir Luxe Drive"
            className="h-32 md:h-40 w-auto drop-shadow-2xl"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <h2 className="text-primary font-medium tracking-[0.2em] uppercase mb-4 text-sm md:text-base">
            Premium VIP Transportation
          </h2>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6 drop-shadow-2xl">
            Luxury Across<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-200 to-primary">Tajikistan</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 font-light mb-12 max-w-2xl mx-auto tracking-wide">
            Comfort. Safety. Prestige. Experience unhurried elegance with our exclusive Land Cruiser fleet and professional chauffeurs.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Button
            size="lg"
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-semibold tracking-wider uppercase px-12 py-7 text-sm rounded-none border border-primary transition-all"
            onClick={scrollToBooking}
          >
            Book Now
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto bg-transparent text-white border-white/30 hover:bg-white/5 hover:border-white font-semibold tracking-wider uppercase px-12 py-7 text-sm rounded-none transition-all"
            onClick={() => window.open("https://wa.me/992000000000", "_blank")}
          >
            WhatsApp
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-white/40 uppercase tracking-widest font-medium">Scroll</span>
        <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full h-1/2 bg-primary"
            animate={{ top: ["-50%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
