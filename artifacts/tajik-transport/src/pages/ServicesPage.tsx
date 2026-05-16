import { motion } from "framer-motion";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/footer";
import { SERVICES } from "@/lib/services";

export function ServicesPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-primary hover:text-white transition-colors mb-10 text-sm uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> {t("nav.backToHome")}
          </Link>

          <div className="mb-16 max-w-3xl">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-primary uppercase tracking-[0.3em] text-xs mb-4 font-light"
            >
              {t("servicesCatalog.eyebrow")}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-serif text-white mb-6"
            >
              {t("servicesCatalog.title")}
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "80px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-[2px] bg-primary mb-8"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 font-light text-lg"
            >
              {t("servicesCatalog.subtitle")}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {SERVICES.map((service, index) => {
              const Icon = service.icon;
              const title = t(`servicesCatalog.items.${service.i18nKey}.title`);
              const short = t(`servicesCatalog.items.${service.i18nKey}.short`);
              return (
                <motion.div
                  key={service.slug}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link
                    href={`/services/${service.slug}`}
                    className="group block h-full glass-panel card-gold-top overflow-hidden hover-gold-glow transition-all duration-500"
                  >
                    <div className="relative h-44 overflow-hidden bg-black">
                      <img
                        src={service.image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      <div className="absolute bottom-4 left-4 w-12 h-12 border border-primary/40 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="p-7">
                      <h3 className="text-xl font-serif text-white mb-3 tracking-wide group-hover:text-primary/90 transition-colors duration-300">
                        {title}
                      </h3>
                      <p className="text-gray-300/80 font-light leading-relaxed text-[15px] mb-6 line-clamp-3">
                        {short}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <span className="text-[10px] uppercase tracking-widest text-white/40 group-hover:text-primary transition-colors duration-300">
                          {t("servicesCatalog.exploreLabel")}
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

          <div className="mt-20 glass-panel border border-primary/20 p-10 md:p-14 text-center">
            <h2 className="text-2xl md:text-3xl font-serif text-white mb-4">
              {t("servicesCatalog.cta.title")}
            </h2>
            <p className="text-gray-400 font-light mb-8 max-w-2xl mx-auto">
              {t("servicesCatalog.cta.body")}
            </p>
            <a
              href="https://wa.me/992004044035"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 border border-primary/60 bg-primary/10 text-primary hover:bg-primary hover:text-black transition-all duration-300 px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-medium"
            >
              {t("servicesCatalog.cta.button")}
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
