import { motion } from "framer-motion";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, Clock, MapPin, Star } from "lucide-react";
import { useListTours } from "@workspace/api-client-react";
import type { Tour } from "@workspace/api-client-react";
import { pickI18n, useActiveLang } from "@/lib/locale";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/footer";

export function ToursPage() {
  const { t, i18n } = useTranslation();
  const lang = useActiveLang(i18n.language);
  const { data: tours, isLoading } = useListTours();

  const visible = (tours ?? [])
    .filter((tour) => !tour.hidden)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);

  const featured = visible.filter((t) => t.featured);
  const regular = visible.filter((t) => !t.featured);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-primary hover:text-white transition-colors mb-10 text-sm uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> {t("nav.backToHome")}
          </Link>

          <div className="mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-primary uppercase tracking-[0.3em] text-xs mb-4 font-light"
            >
              {t("toursPage.eyebrow")}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-serif text-white mb-4"
            >
              {t("toursPage.title")}
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "80px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-[2px] bg-primary mb-6"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 font-light text-lg max-w-2xl"
            >
              {t("toursPage.subtitle")}
            </motion.p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
            </div>
          ) : visible.length === 0 ? (
            <div className="border border-white/5 bg-[#0a0a0a] py-32 text-center text-gray-500 text-sm">
              {t("toursPage.empty")}
            </div>
          ) : (
            <>
              {featured.length > 0 && (
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-8">
                    <Star className="w-4 h-4 text-primary" />
                    <h2 className="text-xs uppercase tracking-[0.3em] text-primary">
                      {t("toursPage.featured")}
                    </h2>
                  </div>
                  <TourGrid tours={featured} lang={lang} t={t} />
                </div>
              )}

              {regular.length > 0 && (
                <div>
                  {featured.length > 0 && (
                    <div className="h-px bg-white/5 mb-14" />
                  )}
                  <TourGrid tours={regular} lang={lang} t={t} />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function TourGrid({
  tours,
  lang,
  t,
}: {
  tours: Tour[];
  lang: string;
  t: (key: string) => string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {tours.map((tour, index) => {
        const tTitle = pickI18n(tour.title, tour.titleI18n, lang);
        const tDuration = pickI18n(tour.duration, tour.durationI18n, lang);
        const tRoute = pickI18n(tour.route, tour.routeI18n, lang);
        const tShort = pickI18n(tour.shortDescription, tour.shortDescriptionI18n, lang);
        return (
          <motion.div
            key={tour.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
            className="h-full"
          >
            <Link
              href={`/tours/${tour.slug}`}
              className="block group h-full glass-panel card-gold-top overflow-hidden hover-gold-glow transition-all duration-500"
            >
              <div className="relative h-56 overflow-hidden bg-black">
                <img
                  src={tour.mainImage || "/lc-hero.png"}
                  alt={tTitle}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
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
                    {t("toursPage.startingFrom")}
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
                    {t("toursPage.viewDetails")}
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
    </div>
  );
}
