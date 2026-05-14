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
        {/* Reduced overlays so the photo reads more vividly */}
        <div className="absolute inset-0 bg-black/38" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/30" />
        {/* Subtle gold ambient glow at the centre */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 70%, rgba(203,169,78,0.06) 0%, transparent 65%)' }} />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-6 py-32 text-center max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* Decorative gold rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mb-6 h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent"
          />
          <h2 className="text-primary font-medium tracking-[0.25em] uppercase mb-5 text-xs md:text-sm">
            Premium VIP Transportation
          </h2>
          <h1
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6"
            style={{ textShadow: '0 2px 40px rgba(0,0,0,0.8)' }}
          >
            Luxury Across<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-200 to-primary">
              Tajikistan
            </span>
          </h1>
          <p className="text-base md:text-xl text-white/75 font-light mb-12 max-w-2xl mx-auto tracking-wide leading-relaxed">
            Comfort. Safety. Prestige. Experience unhurried elegance with our exclusive Land Cruiser fleet and professional chauffeurs.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <Button
            size="lg"
            className="w-full sm:w-auto bg-primary text-black hover:bg-primary/90 font-semibold tracking-wider uppercase px-12 py-7 text-sm rounded-none border border-primary transition-all duration-300"
            style={{ boxShadow: '0 0 28px rgba(203,169,78,0.35)' }}
            onClick={scrollToBooking}
          >
            Book Now
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto bg-white/5 text-white border-white/25 hover:bg-white/10 hover:border-white/60 font-semibold tracking-wider uppercase px-12 py-7 text-sm rounded-none transition-all duration-300 backdrop-blur-sm"
            onClick={() => window.open("https://wa.me/992000000000", "_blank")}
          >
            WhatsApp
          </Button>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-16 flex flex-wrap justify-center gap-10 md:gap-16"
        >
          {[
            { value: "6", label: "Luxury Vehicles" },
            { value: "24/7", label: "Available" },
            { value: "100%", label: "Professional" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl md:text-3xl font-serif text-primary font-bold">{value}</p>
              <p className="text-xs text-white/45 uppercase tracking-widest mt-1">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-white/35 uppercase tracking-widest font-medium">Scroll</span>
        <div className="w-px h-12 bg-white/15 relative overflow-hidden">
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
