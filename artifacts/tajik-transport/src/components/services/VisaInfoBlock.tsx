import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Globe,
  Mountain,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

const MFA_URL = "https://mfa.tj/en";
const EVISA_URL = "https://www.evisa.tj/";

export function VisaInfoBlock() {
  const { t } = useTranslation();
  const visaFreeList = t("servicesCatalog.visa.visaFreeList", {
    returnObjects: true,
  }) as string[];

  return (
    <section className="mt-16">
      <div className="mb-10">
        <p className="text-primary uppercase tracking-[0.3em] text-xs mb-3 font-light">
          {t("servicesCatalog.visa.eyebrow")}
        </p>
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-3">
          {t("servicesCatalog.visa.blockTitle")}
        </h2>
        <div className="h-[2px] w-16 bg-primary mb-5" />
        <p className="text-gray-400 font-light max-w-2xl">
          {t("servicesCatalog.visa.blockSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-10">
        {/* Visa-Free */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel border border-primary/15 p-7 md:p-8 relative overflow-hidden"
        >
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 border border-primary/30 bg-primary/5 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-serif text-white">
              {t("servicesCatalog.visa.visaFreeTitle")}
            </h3>
          </div>
          <p className="text-gray-400 font-light text-[15px] leading-relaxed mb-5">
            {t("servicesCatalog.visa.visaFreeBody")}
          </p>
          {Array.isArray(visaFreeList) && (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {visaFreeList.map((country) => (
                <li
                  key={country}
                  className="text-sm text-white/85 flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-primary rounded-full flex-shrink-0" />
                  {country}
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* E-Visa */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="glass-panel border border-primary/15 p-7 md:p-8 relative overflow-hidden"
        >
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 border border-primary/30 bg-primary/5 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-serif text-white">
              {t("servicesCatalog.visa.eVisaTitle")}
            </h3>
          </div>
          <p className="text-gray-400 font-light text-[15px] leading-relaxed mb-5">
            {t("servicesCatalog.visa.eVisaBody")}
          </p>
          <a
            href={EVISA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-white text-xs uppercase tracking-[0.2em] transition-colors"
          >
            {t("servicesCatalog.visa.visitEvisa")}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </motion.div>

        {/* Consular */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass-panel border border-white/10 p-7 md:p-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 border border-white/15 bg-white/5 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white/70" />
            </div>
            <h3 className="text-xl font-serif text-white">
              {t("servicesCatalog.visa.consularTitle")}
            </h3>
          </div>
          <p className="text-gray-400 font-light text-[15px] leading-relaxed">
            {t("servicesCatalog.visa.consularBody")}
          </p>
        </motion.div>

        {/* GBAO */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="glass-panel border border-amber-500/20 p-7 md:p-8 bg-amber-500/[0.02]"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 border border-amber-400/30 bg-amber-400/5 flex items-center justify-center">
              <Mountain className="w-5 h-5 text-amber-300" />
            </div>
            <h3 className="text-xl font-serif text-white">
              {t("servicesCatalog.visa.gbaoTitle")}
            </h3>
          </div>
          <p className="text-gray-400 font-light text-[15px] leading-relaxed">
            {t("servicesCatalog.visa.gbaoBody")}
          </p>
        </motion.div>
      </div>

      {/* Disclaimer + Official source */}
      <div className="border border-primary/30 bg-gradient-to-br from-primary/[0.06] via-black to-black p-8 md:p-10">
        <div className="flex items-start gap-4 mb-6">
          <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white/90 font-light leading-relaxed text-[15px]">
              {t("servicesCatalog.visa.disclaimer")}
            </p>
          </div>
        </div>
        <div className="border-t border-primary/20 pt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-4 h-4 text-primary" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-white/50">
              {t("servicesCatalog.visa.officialSource")}
            </span>
          </div>
          <a
            href={MFA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-black transition-all duration-300 px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium"
          >
            {t("servicesCatalog.visa.visitMfa")}
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
