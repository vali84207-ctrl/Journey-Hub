import { motion } from "framer-motion";
import { Users, ArrowRight, Wifi, Wind } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useListVehicles } from "@workspace/api-client-react";
import { pickI18n, useActiveLang } from "@/lib/locale";

export function Fleet() {
  const { t, i18n } = useTranslation();
  const lang = useActiveLang(i18n.language);
  const { data: vehicles } = useListVehicles();
  const visible = (vehicles ?? [])
    .filter((v) => v.status !== "hidden")
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
    .slice(0, 6);

  return (
    <section id="fleet" className="py-28 relative" style={{ background: "#060606" }}>
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-5"
          >
            <div className="h-px w-10 bg-primary/70" />
            <p className="text-primary text-[10px] tracking-[0.35em] uppercase font-medium">{t("fleet.eyebrow")}</p>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-sans font-black text-white uppercase leading-none"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.01em" }}
          >
            {t("fleet.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/45 font-light text-sm mt-4 max-w-xl"
          >
            {t("fleet.subtitle")}
          </motion.p>
        </div>

        <div className="relative overflow-hidden mb-12 h-52 md:h-72">
          <img
            src="/lc-hero.png"
            alt="Pamir Luxe Drive Fleet"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, #060606 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.6) 0%, transparent 50%, rgba(0,0,0,0.6) 100%)" }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.05)" }}>
          {visible.map((car, index) => {
            const carName =
              pickI18n(car.name, car.nameI18n, lang) ||
              pickI18n(car.model, car.modelI18n, lang);
            return (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: index * 0.07 }}
              style={{ background: "#060606" }}
            >
              <Link href={`/fleet/${car.id}`} className="block group h-full">
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={car.mainImage || "/lc-hero.png"}
                    alt={carName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition-colors duration-500" />
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-mono tracking-widest text-white/90 bg-black/70 backdrop-blur-sm px-2.5 py-1 border border-white/10">
                      {car.code}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="text-[10px] uppercase tracking-wider text-primary/90 bg-black/70 backdrop-blur-sm px-2.5 py-1 border border-primary/20">
                      {car.type}
                    </span>
                  </div>
                </div>

                <div className="p-6 border-t border-white/5 group-hover:border-primary/20 transition-colors duration-400">
                  <p className="text-primary/60 text-[9px] uppercase tracking-[0.3em] mb-1">{car.year} · {car.type}</p>
                  <h3 className="text-white font-sans font-bold text-lg uppercase tracking-tight mb-4">{carName}</h3>

                  <div className="flex items-center gap-5 text-white/40 text-xs mb-5">
                    <span className="flex items-center gap-1.5"><Users size={11} className="text-primary/50" />{car.pax} {t("fleet.pax")}</span>
                    <span className="flex items-center gap-1.5"><Wifi size={11} className="text-primary/50" />{t("fleet.wifi")}</span>
                    <span className="flex items-center gap-1.5"><Wind size={11} className="text-primary/50" />{t("fleet.ac")}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div>
                      <span className="text-[9px] text-white/35 uppercase tracking-widest block">{t("fleet.fromPrice")}</span>
                      <span className="text-primary font-sans font-bold text-xl">${car.pricePerDay}</span>
                      <span className="text-white/30 text-xs">{t("fleet.perDay")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/40 group-hover:text-primary transition-colors duration-300 text-[10px] tracking-widest uppercase">
                      {t("fleet.viewDetails")} <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/fleet">
            <button className="border border-primary/50 text-primary hover:bg-primary hover:text-black transition-all duration-300 text-xs tracking-[0.25em] uppercase font-semibold px-12 py-4">
              {t("fleet.viewAll")}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
