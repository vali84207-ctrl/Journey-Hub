import { motion } from "framer-motion";
import { ArrowRight, Crown, User, Shield, Clock } from "lucide-react";
import { Link } from "wouter";

const vehicles = [
  { code: "LC300-01", type: "LC300", id: 1, pos: "object-right" },
  { code: "LC300-02", type: "LC300", id: 2, pos: "object-right" },
  { code: "LC300-03", type: "LC300", id: 3, pos: "object-right" },
  { code: "LC200-01", type: "LC200", id: 4, pos: "object-left" },
  { code: "LC200-02", type: "LC200", id: 5, pos: "object-left" },
  { code: "LC200-03", type: "LC200", id: 6, pos: "object-left" },
];

const features = [
  { icon: Crown, title: "Premium Fleet", desc: "Latest luxury vehicles" },
  { icon: User, title: "Professional Drivers", desc: "Experienced & discreet" },
  { icon: Shield, title: "Safety First", desc: "Your safety is our priority" },
  { icon: Clock, title: "24/7 Service", desc: "We are always here" },
];

export function Hero() {
  return (
    <section className="relative bg-black">

      {/* ── CINEMATIC HERO ───────────────────────────── */}
      <div className="relative min-h-screen flex flex-col overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/lc-hero.png"
            alt="Pamir Luxe Drive"
            className="w-full h-full object-cover object-center"
            style={{ transform: "scale(1.04)", transformOrigin: "center 40%" }}
          />
          {/* Left dark gradient for text legibility */}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(105deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.70) 38%, rgba(0,0,0,0.28) 65%, rgba(0,0,0,0.20) 100%)" }}
          />
          {/* Bottom fade into vehicle strip */}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 45%)" }}
          />
          {/* Top fade */}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 18%)" }}
          />
          {/* Subtle warm ambient over mountain */}
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 70% 35%, rgba(203,169,78,0.07) 0%, transparent 55%)" }}
          />
        </div>

        {/* Text content — left aligned */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-28 pt-32 pb-16 max-w-3xl">

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-7">
                <div className="h-px w-8 bg-primary/80" />
                <span className="text-primary text-[10px] tracking-[0.35em] uppercase font-medium">
                  Premium VIP Transportation — Tajikistan
                </span>
              </div>

              {/* Main headline */}
              <h1
                className="font-sans font-black text-white uppercase leading-[0.92] mb-2"
                style={{
                  fontSize: "clamp(3.2rem, 8vw, 7rem)",
                  letterSpacing: "-0.01em",
                  textShadow: "0 4px 60px rgba(0,0,0,0.9)",
                }}
              >
                Luxury Travel
              </h1>
              <h1
                className="font-sans font-black uppercase leading-[0.92] mb-8"
                style={{
                  fontSize: "clamp(3.2rem, 8vw, 7rem)",
                  letterSpacing: "-0.01em",
                  color: "hsl(44,65%,56%)",
                  textShadow: "0 4px 60px rgba(0,0,0,0.7), 0 0 40px rgba(203,169,78,0.2)",
                }}
              >
                In Tajikistan
              </h1>

              {/* Subtitle */}
              <p className="text-white/70 text-base lg:text-[17px] font-light leading-relaxed mb-10 max-w-sm">
                Premium transportation services<br />for the most discerning travelers.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-4">
                <Link href="/fleet">
                  <button
                    className="flex items-center gap-3 border border-white/55 text-white hover:bg-white hover:text-black transition-all duration-300 text-xs tracking-[0.22em] uppercase font-semibold px-8 py-4"
                  >
                    Explore Fleet <ArrowRight size={14} />
                  </button>
                </Link>
                <button
                  onClick={() => document.querySelector("#book")?.scrollIntoView({ behavior: "smooth" })}
                  className="flex items-center gap-3 bg-primary text-black hover:bg-primary/90 transition-all duration-300 text-xs tracking-[0.22em] uppercase font-semibold px-8 py-4"
                  style={{ boxShadow: "0 0 24px rgba(203,169,78,0.35)" }}
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Vehicle showcase row ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative z-10 grid grid-cols-3 md:grid-cols-6"
          style={{ borderTop: "1px solid rgba(203,169,78,0.15)" }}
        >
          {vehicles.map((v, i) => (
            <Link key={v.code} href={`/fleet/${v.id}`}>
              <div className="group relative h-32 md:h-40 overflow-hidden cursor-pointer"
                style={{ borderRight: i < 5 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
              >
                <img
                  src="/lc-hero.png"
                  alt={v.code}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${v.pos}`}
                />
                {/* Gold top line on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-[9px] text-primary/80 uppercase tracking-widest font-light">{v.type}</p>
                  <p className="text-white text-[10px] font-mono tracking-wider mt-0.5">{v.code}</p>
                </div>
                {/* Logo watermark on hover */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-70 transition-opacity duration-300">
                  <img src="/pamir-luxe-logo.png" alt="" className="h-5 w-auto" />
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>

      {/* ── Feature strip ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="grid grid-cols-2 lg:grid-cols-4"
        style={{
          background: "rgba(8,8,8,1)",
          borderTop: "1px solid rgba(203,169,78,0.18)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        {features.map(({ icon: Icon, title, desc }, i) => (
          <div
            key={title}
            className="flex items-center gap-4 px-8 py-7 group"
            style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
          >
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0"
              style={{ border: "1px solid rgba(203,169,78,0.35)" }}>
              <Icon size={17} style={{ color: "hsl(44,65%,56%)" }} />
            </div>
            <div>
              <p className="text-white text-xs font-semibold uppercase tracking-[0.12em]">{title}</p>
              <p className="text-white/40 text-[11px] mt-0.5 font-light">{desc}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
