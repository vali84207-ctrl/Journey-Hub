import { motion } from "framer-motion";
import { ArrowRight, Crown, User, Shield, Clock } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export function Hero() {
  const { t } = useTranslation();
  const features = [
    { icon: Crown, key: "premium" as const },
    { icon: User, key: "drivers" as const },
    { icon: Shield, key: "safety" as const },
    { icon: Clock, key: "service" as const },
  ];
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
            style={{
              transform: "scale(1.04)",
              transformOrigin: "center 40%",
              filter: "brightness(1.15) contrast(1.08) saturate(1.1)",
            }}
          />
          {/* Left dark gradient for text legibility — softened */}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(105deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.52) 38%, rgba(0,0,0,0.18) 65%, rgba(0,0,0,0.10) 100%)" }}
          />
          {/* Bottom fade — lighter so cars stay visible */}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 38%)" }}
          />
          {/* Warm golden ambient over sky/mountain */}
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 72% 30%, rgba(221,184,95,0.16) 0%, transparent 55%)" }}
          />
          {/* Subtle gold rim light from upper-right */}
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 95% 5%, rgba(255,200,120,0.10) 0%, transparent 40%)" }}
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
                  {t("hero.eyebrow")}
                </span>
              </div>

              {/* Main headline */}
              <h1
                className="font-sans font-black text-white uppercase leading-[0.92] mb-2"
                style={{
                  fontSize: "clamp(3.2rem, 8vw, 7rem)",
                  letterSpacing: "-0.01em",
                  textShadow: "0 4px 40px rgba(0,0,0,0.85), 0 0 80px rgba(221,184,95,0.08)",
                }}
              >
                {t("hero.titleLine1")}
              </h1>
              <h1
                className="font-sans font-black uppercase leading-[0.92] mb-8"
                style={{
                  fontSize: "clamp(3.2rem, 8vw, 7rem)",
                  letterSpacing: "-0.01em",
                  background: "linear-gradient(180deg, #F0D079 0%, #DDB85F 45%, #B8923D 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.6)) drop-shadow(0 0 40px rgba(221,184,95,0.35))",
                }}
              >
                {t("hero.titleLine2")}
              </h1>

              {/* Subtitle */}
              <p className="text-white/85 text-base lg:text-[17px] font-light leading-relaxed mb-10 max-w-sm"
                style={{ textShadow: "0 1px 12px rgba(0,0,0,0.6)" }}>
                {t("hero.subtitle")}
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-4">
                <Link href="/fleet">
                  <button
                    className="flex items-center gap-3 border border-white/70 text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300 text-xs tracking-[0.22em] uppercase font-semibold px-8 py-4 backdrop-blur-sm"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    {t("hero.exploreFleet")} <ArrowRight size={14} />
                  </button>
                </Link>
                <button
                  onClick={() => document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth" })}
                  className="flex items-center gap-3 bg-primary text-black hover:bg-primary/90 hover:scale-[1.03] transition-all duration-300 text-xs tracking-[0.22em] uppercase font-semibold px-8 py-4 gold-pulse"
                >
                  {t("hero.bookNow")} <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>

      </div>

      {/* ── Feature strip ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="grid grid-cols-2 lg:grid-cols-4 relative"
        style={{
          background: "linear-gradient(180deg, rgba(14,14,14,1) 0%, rgba(10,10,10,1) 100%)",
          borderTop: "1px solid rgba(221,184,95,0.28)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          boxShadow: "0 -10px 40px rgba(221,184,95,0.06), inset 0 1px 0 rgba(221,184,95,0.08)",
        }}
      >
        {features.map(({ icon: Icon, key }, i) => (
          <div
            key={key}
            className="flex items-center gap-4 px-8 py-8 group transition-all duration-400 hover:bg-white/[0.02]"
            style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
          >
            <div className="w-11 h-11 flex items-center justify-center flex-shrink-0 transition-all duration-400 group-hover:bg-primary/10"
              style={{
                border: "1px solid rgba(221,184,95,0.5)",
                boxShadow: "0 0 16px rgba(221,184,95,0.12)",
              }}>
              <Icon size={18} style={{ color: "hsl(44,72%,62%)" }} className="transition-transform duration-400 group-hover:scale-110" />
            </div>
            <div>
              <p className="text-white text-xs font-semibold uppercase tracking-[0.13em]">{t(`hero.features.${key}.title`)}</p>
              <p className="text-white/55 text-[11px] mt-1 font-light">{t(`hero.features.${key}.desc`)}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
