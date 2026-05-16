import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  MapPin,
  CheckCircle2,
  MessageCircle,
  Phone,
  Loader2,
  Compass,
  Users,
  Calendar,
  Star,
  ChevronDown,
  Quote,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGetTourBySlug } from "@workspace/api-client-react";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { TourBookingForm } from "@/components/TourBookingForm";
import { pickI18n, pickLocale, pickLocaleArray, useActiveLang } from "@/lib/locale";

const STATUS_STYLES: Record<string, string> = {
  available: "bg-green-500/10 border-green-500/30 text-green-400",
  limited: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  soldout: "bg-red-500/10 border-red-500/30 text-red-400",
};

function formatDate(iso: string, lang: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  try {
    return d.toLocaleDateString(lang === "tj" ? "ru-RU" : lang, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function TourDetailPage() {
  const { t, i18n } = useTranslation();
  const lang = useActiveLang(i18n.language);
  const { slug } = useParams();
  const { data: tour, isLoading, error } = useGetTourBySlug(slug ?? "");
  const [activeImg, setActiveImg] = useState(0);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImg(0);
    setOpenFaq(null);
  }, [slug]);

  const sortedDepartures = useMemo(() => {
    return [...(tour?.departures ?? [])].sort((a, b) =>
      (a.startDate || "").localeCompare(b.startDate || ""),
    );
  }, [tour?.departures]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </main>
    );
  }

  if (error || !tour || tour.hidden) {
    return (
      <main className="min-h-screen bg-[#050505] text-white pt-24 px-4 text-center">
        <Compass className="w-16 h-16 text-primary/30 mx-auto mb-6" />
        <h1 className="text-3xl font-serif text-primary mb-4">{t("tourDetail.notFound")}</h1>
        <Link href="/" className="text-gray-400 hover:text-white underline cursor-pointer">
          {t("tourDetail.backHome")}
        </Link>
      </main>
    );
  }

  const gallery =
    tour.gallery && tour.gallery.length > 0
      ? tour.gallery
      : [tour.mainImage || "/lc-hero.png"];
  const title = pickI18n(tour.title, tour.titleI18n, lang);
  const description = pickI18n(tour.description, tour.descriptionI18n, lang);
  const duration = pickI18n(tour.duration, tour.durationI18n, lang);
  const route = pickI18n(tour.route, tour.routeI18n, lang);
  const groupSize = pickI18n(tour.groupSize, tour.groupSizeI18n, lang);
  const includedItems = pickLocaleArray(tour.included, lang);
  const inquiryText = encodeURIComponent(
    `${t("tourDetail.inquiryPrefix")} ${title} —`,
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#050505] text-white pb-24">
        {/* Hero gallery */}
        <div className="relative w-full h-[55vh] md:h-[68vh] overflow-hidden bg-black">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImg}
              src={gallery[activeImg]}
              alt={title}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent" />

          {gallery.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-10 md:w-20 md:h-12 overflow-hidden border-2 transition-all duration-300 ${
                    activeImg === i
                      ? "border-primary"
                      : "border-white/20 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="absolute top-24 left-6 z-20">
            <Link
              href="/#services"
              className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-sm border border-white/10 px-4 py-2 text-sm text-white hover:text-primary transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> {t("tourDetail.backToTours")}
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Main column */}
            <div className="lg:col-span-3">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {duration && (
                  <span className="inline-flex items-center gap-1.5 bg-black border border-primary/30 text-primary px-3 py-1 text-xs uppercase tracking-widest">
                    <Clock className="w-3 h-3" /> {duration}
                  </span>
                )}
                {route && (
                  <span className="inline-flex items-center gap-1.5 bg-black border border-white/15 text-white/70 px-3 py-1 text-xs uppercase tracking-widest">
                    <MapPin className="w-3 h-3" /> {route}
                  </span>
                )}
                {groupSize && (
                  <span className="inline-flex items-center gap-1.5 bg-black border border-white/15 text-white/70 px-3 py-1 text-xs uppercase tracking-widest">
                    <Users className="w-3 h-3" /> {groupSize}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">
                {title}
              </h1>

              {/* Quick facts strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 mb-10 border border-white/10">
                <div className="bg-[#0a0a0a] p-4">
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                    {t("tourDetail.facts.duration")}
                  </div>
                  <div className="text-sm text-white font-light">{duration || "—"}</div>
                </div>
                <div className="bg-[#0a0a0a] p-4">
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                    {t("tourDetail.facts.route")}
                  </div>
                  <div className="text-sm text-white font-light truncate">{route || "—"}</div>
                </div>
                <div className="bg-[#0a0a0a] p-4">
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                    {t("tourDetail.facts.groupSize")}
                  </div>
                  <div className="text-sm text-white font-light">{groupSize || "—"}</div>
                </div>
                <div className="bg-[#0a0a0a] p-4">
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                    {t("tourDetail.facts.from")}
                  </div>
                  <div className="text-sm text-primary font-serif">
                    ${tour.startingPrice}
                  </div>
                </div>
              </div>

              <p className="text-gray-300 font-light leading-relaxed text-lg mb-12">
                {description || pickI18n(tour.shortDescription, tour.shortDescriptionI18n, lang)}
              </p>

              {tour.highlights && tour.highlights.length > 0 && (
                <section className="mb-14">
                  <h2 className="text-xl font-serif text-white mb-5 border-b border-white/10 pb-4">
                    {t("tourDetail.highlights")}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {tour.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="bg-white/3 border border-white/5 p-5 hover:border-primary/30 transition-colors"
                      >
                        <h3 className="text-primary font-serif text-base mb-1.5">
                          {pickLocale(h.title, lang)}
                        </h3>
                        <p className="text-gray-400 text-sm font-light leading-relaxed">
                          {pickLocale(h.body, lang)}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {sortedDepartures.length > 0 && (
                <section id="dates-prices" className="mb-14">
                  <h2 className="text-xl font-serif text-white mb-5 border-b border-white/10 pb-4">
                    {t("tourDetail.datesPrices")}
                  </h2>
                  <div className="overflow-x-auto border border-white/10">
                    <table className="w-full text-sm">
                      <thead className="bg-white/5 text-gray-400">
                        <tr>
                          <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-medium">
                            {t("tourDetail.depart.start")}
                          </th>
                          <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-medium">
                            {t("tourDetail.depart.end")}
                          </th>
                          <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-medium">
                            {t("tourDetail.depart.seats")}
                          </th>
                          <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-medium">
                            {t("tourDetail.depart.price")}
                          </th>
                          <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-medium">
                            {t("tourDetail.depart.status")}
                          </th>
                          <th className="px-4 py-3" />
                        </tr>
                      </thead>
                      <tbody>
                        {sortedDepartures.map((d) => {
                          const cls = STATUS_STYLES[d.status] ?? STATUS_STYLES.available!;
                          const isSold = d.status === "soldout";
                          return (
                            <tr key={d.id} className="border-t border-white/5">
                              <td className="px-4 py-3 text-white/90 font-light">
                                <span className="inline-flex items-center gap-2">
                                  <Calendar className="w-3.5 h-3.5 text-primary/60" />
                                  {formatDate(d.startDate, lang)}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-white/70 font-light">
                                {formatDate(d.endDate, lang)}
                              </td>
                              <td className="px-4 py-3 text-white/70 font-light">{d.seats}</td>
                              <td className="px-4 py-3 text-primary font-serif">${d.price}</td>
                              <td className="px-4 py-3">
                                <span
                                  className={`inline-block px-2 py-1 text-[10px] uppercase tracking-wider border ${cls}`}
                                >
                                  {t(`tourDetail.status.${d.status}`)}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                {isSold ? (
                                  <span className="text-[11px] text-gray-500">—</span>
                                ) : (
                                  <a
                                    href="#tour-booking"
                                    className="text-[10px] uppercase tracking-widest text-primary hover:underline"
                                  >
                                    {t("tourDetail.depart.book")}
                                  </a>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {tour.itinerary && tour.itinerary.length > 0 && (
                <section className="mb-14">
                  <h2 className="text-xl font-serif text-white mb-5 border-b border-white/10 pb-4">
                    {t("tourDetail.itinerary")}
                  </h2>
                  <div className="space-y-6">
                    {tour.itinerary.map((d) => {
                      const locs = pickLocaleArray(d.locations, lang);
                      const acts = pickLocaleArray(d.activities, lang);
                      const overnight = pickLocale(d.overnightLocation, lang);
                      return (
                        <div key={d.day} className="flex gap-4">
                          <div className="w-12 h-12 flex-shrink-0 border border-primary/40 text-primary font-serif text-lg flex items-center justify-center">
                            {d.day}
                          </div>
                          <div className="flex-1 space-y-2">
                            <h3 className="text-white font-serif">{pickLocale(d.title, lang)}</h3>
                            <p className="text-gray-400 text-sm font-light leading-relaxed">
                              {pickLocale(d.body, lang)}
                            </p>
                            {locs.length > 0 && (
                              <p className="text-xs text-primary/80 uppercase tracking-wider">
                                {locs.join(" · ")}
                              </p>
                            )}
                            {acts.length > 0 && (
                              <ul className="text-xs text-gray-500 space-y-0.5 list-disc list-inside">
                                {acts.map((a, ai) => (
                                  <li key={ai}>{a}</li>
                                ))}
                              </ul>
                            )}
                            {overnight && (
                              <p className="text-[10px] uppercase tracking-wider text-gray-500">
                                {t("tourDetail.overnight")}: {overnight}
                              </p>
                            )}
                            {d.images && d.images.length > 0 && (
                              <div className="flex gap-2 overflow-x-auto pt-2">
                                {d.images.map((src, ii) => (
                                  <img
                                    key={ii}
                                    src={src}
                                    alt=""
                                    className="h-20 w-32 object-cover flex-shrink-0 border border-white/10"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {includedItems.length > 0 && (
                <section className="mb-14">
                  <h2 className="text-xl font-serif text-white mb-5 border-b border-white/10 pb-4">
                    {t("tourDetail.included")}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {includedItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-gray-300 font-light text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {tour.reviews && tour.reviews.length > 0 && (
                <section className="mb-14">
                  <h2 className="text-xl font-serif text-white mb-5 border-b border-white/10 pb-4">
                    {t("tourDetail.reviews")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tour.reviews.map((r) => {
                      const reviewLocation = pickLocale(r.location, lang);
                      return (
                        <article
                          key={r.id}
                          className="bg-white/3 border border-white/5 p-6 relative hover:border-primary/30 transition-colors"
                        >
                          <Quote className="absolute top-4 right-4 w-6 h-6 text-primary/15" />
                          <div className="flex items-center gap-1 mb-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < r.rating
                                    ? "fill-primary text-primary"
                                    : "text-gray-700"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-200 font-light italic leading-relaxed text-sm mb-4">
                            "{pickLocale(r.body, lang)}"
                          </p>
                          <div className="flex items-center justify-between text-[11px]">
                            <div>
                              <div className="text-white tracking-wider uppercase">
                                {r.author}
                              </div>
                              {reviewLocation && (
                                <div className="text-gray-500">{reviewLocation}</div>
                              )}
                            </div>
                            {r.date && (
                              <div className="text-gray-500">
                                {formatDate(r.date, lang)}
                              </div>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              )}

              {tour.faq && tour.faq.length > 0 && (
                <section className="mb-14">
                  <h2 className="text-xl font-serif text-white mb-5 border-b border-white/10 pb-4">
                    {t("tourDetail.faq")}
                  </h2>
                  <div className="border border-white/10">
                    {tour.faq.map((q, i) => {
                      const isOpen = openFaq === q.id;
                      const buttonId = `faq-trigger-${q.id}`;
                      const panelId = `faq-panel-${q.id}`;
                      return (
                        <div
                          key={q.id}
                          className={i > 0 ? "border-t border-white/10" : ""}
                        >
                          <button
                            type="button"
                            id={buttonId}
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            onClick={() => setOpenFaq(isOpen ? null : q.id)}
                            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/3 transition-colors"
                          >
                            <span className="text-white font-light text-sm md:text-base">
                              {pickLocale(q.question, lang)}
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 text-primary flex-shrink-0 transition-transform ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                key="panel"
                                id={panelId}
                                role="region"
                                aria-labelledby={buttonId}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="px-5 pb-5 text-gray-400 text-sm font-light leading-relaxed whitespace-pre-line">
                                  {pickLocale(q.answer, lang)}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              <TourBookingForm tourSlug={tour.slug} tourTitle={title} />
            </div>

            {/* Sticky booking sidebar */}
            <aside className="lg:col-span-2">
              <div className="glass-panel p-8 border border-primary/20 sticky top-28">
                <div className="text-center pb-6 mb-6 border-b border-white/10">
                  <span className="text-gray-500 uppercase tracking-widest text-xs">
                    {t("tourDetail.startingFrom")}
                  </span>
                  <div className="text-5xl font-serif text-primary mt-1">
                    ${tour.startingPrice}
                  </div>
                  <span className="text-gray-500 text-sm font-light">
                    {t("tourDetail.perGuest")}
                  </span>
                </div>

                {sortedDepartures.length > 0 && (
                  <div className="mb-6 pb-6 border-b border-white/10">
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-3">
                      {t("tourDetail.nextDepartures")}
                    </div>
                    <ul className="space-y-2">
                      {sortedDepartures.slice(0, 3).map((d) => {
                        const cls = STATUS_STYLES[d.status] ?? STATUS_STYLES.available!;
                        return (
                          <li
                            key={d.id}
                            className="flex items-center justify-between gap-2 text-xs"
                          >
                            <span className="text-white/80 font-light">
                              {formatDate(d.startDate, lang)}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-[9px] uppercase tracking-wider border ${cls}`}
                            >
                              {t(`tourDetail.status.${d.status}`)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    <a
                      href="#dates-prices"
                      className="block mt-3 text-[10px] uppercase tracking-widest text-primary hover:underline"
                    >
                      {t("tourDetail.viewAllDates")} →
                    </a>
                  </div>
                )}

                <h2 className="text-2xl font-serif text-white mb-2">
                  {t("tourDetail.reserveTitle")}
                </h2>
                <p className="text-gray-400 font-light text-sm mb-6">
                  {t("tourDetail.reserveDesc")}
                </p>

                <Button
                  onClick={() =>
                    window.open(
                      `https://wa.me/992004044035?text=${inquiryText}`,
                      "_blank",
                    )
                  }
                  className="w-full bg-[#25D366] hover:bg-[#1ebe5a] text-white rounded-none mb-3 py-3 text-sm tracking-wider uppercase transition-all duration-300"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />{" "}
                  {t("tourDetail.whatsappCta")}
                </Button>
                <Button
                  onClick={() => window.open("https://t.me/PamirLuxeDrive", "_blank")}
                  className="w-full bg-[#229ED9] hover:bg-[#1a8cc2] text-white rounded-none mb-6 py-3 text-sm tracking-wider uppercase transition-all duration-300"
                >
                  <Phone className="w-4 h-4 mr-2" /> {t("tourDetail.telegramCta")}
                </Button>

                <a
                  href="#tour-booking"
                  className="block text-center w-full border border-primary/40 text-primary hover:bg-primary hover:text-black transition-all duration-300 rounded-none py-3 text-xs tracking-[0.2em] uppercase"
                >
                  {t("tourDetail.requestForm")}
                </a>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
