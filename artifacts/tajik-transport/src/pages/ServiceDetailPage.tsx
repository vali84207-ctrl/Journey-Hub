import { motion } from "framer-motion";
import { Link, useRoute, Redirect } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/footer";
import { getServiceBySlug, SERVICES } from "@/lib/services";
import { VisaInfoBlock } from "@/components/services/VisaInfoBlock";

export function ServiceDetailPage() {
  const [, params] = useRoute("/services/:slug");
  const { t } = useTranslation();
  const slug = params?.slug ?? "";
  const service = getServiceBySlug(slug);

  if (!service) {
    return <Redirect to="/services" />;
  }

  const Icon = service.icon;
  const base = `servicesCatalog.items.${service.i18nKey}`;
  const title = t(`${base}.title`);
  const intro = t(`${base}.intro`);
  const bullets = t(`${base}.bullets`, { returnObjects: true }) as string[];

  const otherServices = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={service.image}
            alt={title}
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/85 to-[#050505]" />
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <Link
            href="/services"
            className="inline-flex items-center text-primary hover:text-white transition-colors mb-10 text-sm uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> {t("servicesCatalog.backToServices")}
          </Link>

          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-16 h-16 border border-primary/40 bg-black/60 backdrop-blur-sm flex items-center justify-center mb-6"
            >
              <Icon className="w-7 h-7 text-primary" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-serif text-white mb-6"
            >
              {title}
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
              className="text-gray-300 font-light text-lg leading-relaxed"
            >
              {intro}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-primary uppercase tracking-[0.3em] text-xs mb-4 font-light">
              {t("servicesCatalog.highlights")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Array.isArray(bullets) &&
                bullets.map((b, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-4 p-5 border border-white/5 bg-white/[0.015]"
                  >
                    <div className="w-8 h-8 border border-primary/40 bg-primary/5 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-white/85 font-light text-[15px] leading-relaxed pt-1">
                      {b}
                    </p>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Visa-only special block */}
          {service.slug === "visa-support" && <VisaInfoBlock />}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#050505]">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="glass-panel border border-primary/20 p-10 md:p-14 text-center">
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

      {/* Other services */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="text-primary uppercase tracking-[0.3em] text-xs mb-3 font-light">
                {t("servicesCatalog.relatedEyebrow")}
              </p>
              <h3 className="text-2xl md:text-3xl font-serif text-white">
                {t("servicesCatalog.relatedTitle")}
              </h3>
            </div>
            <Link
              href="/services"
              className="text-xs uppercase tracking-[0.2em] text-white/60 hover:text-primary transition-colors inline-flex items-center gap-2"
            >
              {t("servicesCatalog.backToServices")} <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherServices.map((s) => {
              const OIcon = s.icon;
              return (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group glass-panel border border-white/5 p-6 hover-gold-glow transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 border border-primary/30 bg-primary/5 flex items-center justify-center">
                      <OIcon className="w-4 h-4 text-primary" />
                    </div>
                    <h4 className="text-white font-serif group-hover:text-primary transition-colors">
                      {t(`servicesCatalog.items.${s.i18nKey}.title`)}
                    </h4>
                  </div>
                  <p className="text-white/60 text-sm font-light line-clamp-2">
                    {t(`servicesCatalog.items.${s.i18nKey}.short`)}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
