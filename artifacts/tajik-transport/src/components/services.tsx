import { motion } from "framer-motion";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useListTours } from "@workspace/api-client-react";
import { pickI18n, useActiveLang } from "@/lib/locale";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function Services() {
  const { t, i18n } = useTranslation();
  const lang = useActiveLang(i18n.language);
  const { data: tours, isLoading } = useListTours();
  const visible = (tours ?? [])
    .filter((tour) => !tour.hidden)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);

  return (
    <section id="services" className="py-28 bg-black relative section-glow">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary uppercase tracking-[0.3em] text-xs mb-4 font-light"
          >
            {t("services.eyebrow")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-white mb-5"
          >
            {t("services.title")}
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-white/55 font-light text-sm md:text-base mt-6 max-w-2xl mx-auto"
          >
            {t("services.subtitle")}
          </motion.p>
        </div>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center text-gray-500 text-sm">
            {t("services.loading")}
          </div>
        ) : visible.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-500 text-sm">
            {t("services.empty")}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {visible.map((tour) => {
              const tTitle = pickI18n(tour.title, tour.titleI18n, lang);
              const tDuration = pickI18n(tour.duration, tour.durationI18n, lang);
              const tRoute = pickI18n(tour.route, tour.routeI18n, lang);
              const tShort = pickI18n(tour.shortDescription, tour.shortDescriptionI18n, lang);
              return (
              <motion.div key={tour.id} variants={itemVariants} className="h-full">
                <Link
                  href={`/tours/${tour.slug}`}
                  className="block group h-full glass-panel card-gold-top overflow-hidden hover-gold-glow transition-all duration-500"
                >
                  <div className="relative h-56 overflow-hidden bg-black">
                    <img
                      src={tour.mainImage || "/lc-hero.png"}
                      alt={tTitle}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {tDuration && (
                      <div className="absolute top-4 left-4">
                        <span className="text-[10px] uppercase tracking-widest text-primary/90 bg-black/70 backdrop-blur-sm px-2.5 py-1 border border-primary/20 inline-flex items-center gap-1.5">
                          <Clock size={10} /> {tDuration}
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-4 right-4 text-right">
                      <span className="text-[9px] uppercase tracking-widest text-white/60 block">
                        {t("services.startingFrom")}
                      </span>
                      <span className="text-primary font-sans font-bold text-2xl">
                        ${tour.startingPrice}
                      </span>
                    </div>
                  </div>

                  <div className="p-7">
                    <h3 className="text-xl font-serif text-white mb-2 tracking-wide group-hover:text-primary/90 transition-colors duration-300">
                      {tTitle}
                    </h3>
                    {tRoute && (
                      <p className="flex items-start gap-1.5 text-primary/60 text-[10px] uppercase tracking-[0.2em] mb-3">
                        <MapPin size={11} className="mt-0.5 flex-shrink-0" />
                        <span className="truncate">{tRoute}</span>
                      </p>
                    )}
                    <p className="text-gray-300/80 font-light leading-relaxed text-[15px] mb-6 line-clamp-3">
                      {tShort}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-[10px] uppercase tracking-widest text-white/40 group-hover:text-primary transition-colors duration-300">
                        {t("services.viewDetails")}
                      </span>
                      <ArrowRight
                        size={14}
                        className="text-white/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
