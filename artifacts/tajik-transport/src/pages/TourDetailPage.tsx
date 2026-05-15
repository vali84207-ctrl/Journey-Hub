import { useEffect, useState } from "react";
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
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGetTourBySlug } from "@workspace/api-client-react";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

export function TourDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const { data: tour, isLoading, error } = useGetTourBySlug(slug ?? "");
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImg(0);
  }, [slug]);

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
  const inquiryText = encodeURIComponent(
    `${t("tourDetail.inquiryPrefix")} ${tour.title} —`,
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
              alt={tour.title}
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
                {tour.duration && (
                  <span className="inline-flex items-center gap-1.5 bg-black border border-primary/30 text-primary px-3 py-1 text-xs uppercase tracking-widest">
                    <Clock className="w-3 h-3" /> {tour.duration}
                  </span>
                )}
                {tour.route && (
                  <span className="inline-flex items-center gap-1.5 bg-black border border-white/15 text-white/70 px-3 py-1 text-xs uppercase tracking-widest">
                    <MapPin className="w-3 h-3" /> {tour.route}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">
                {tour.title}
              </h1>
              <p className="text-gray-300 font-light leading-relaxed text-lg mb-12">
                {tour.description || tour.shortDescription}
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
                          {h.title}
                        </h3>
                        <p className="text-gray-400 text-sm font-light leading-relaxed">
                          {h.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {tour.itinerary && tour.itinerary.length > 0 && (
                <section className="mb-14">
                  <h2 className="text-xl font-serif text-white mb-5 border-b border-white/10 pb-4">
                    {t("tourDetail.itinerary")}
                  </h2>
                  <div className="space-y-5">
                    {tour.itinerary.map((d) => (
                      <div key={d.day} className="flex gap-4">
                        <div className="w-12 h-12 flex-shrink-0 border border-primary/40 text-primary font-serif text-lg flex items-center justify-center">
                          {d.day}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-serif mb-1">{d.title}</h3>
                          <p className="text-gray-400 text-sm font-light leading-relaxed">
                            {d.body}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {tour.included && tour.included.length > 0 && (
                <section className="mb-14">
                  <h2 className="text-xl font-serif text-white mb-5 border-b border-white/10 pb-4">
                    {t("tourDetail.included")}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tour.included.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-gray-300 font-light text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
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

                <Link
                  href="/#booking"
                  className="block text-center w-full border border-primary/40 text-primary hover:bg-primary hover:text-black transition-all duration-300 rounded-none py-3 text-xs tracking-[0.2em] uppercase"
                >
                  {t("tourDetail.requestForm")}
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
