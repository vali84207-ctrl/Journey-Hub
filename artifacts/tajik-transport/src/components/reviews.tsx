import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useTranslation } from "react-i18next";

const REVIEW_KEYS = ["r1", "r2", "r3", "r4"] as const;

export function Reviews() {
  const { t } = useTranslation();
  return (
    <section className="py-28 bg-[#070707] relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(203,169,78,0.05) 0%, transparent 60%)" }}
      />

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary uppercase tracking-[0.3em] text-xs mb-4 font-light"
          >
            {t("reviews.eyebrow")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-white mb-5"
          >
            {t("reviews.title")}
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {REVIEW_KEYS.map((key, index) => {
            const name = t(`reviews.items.${key}.name`);
            const role = t(`reviews.items.${key}.role`);
            const quote = t(`reviews.items.${key}.quote`);
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                className="glass-panel p-8 relative group hover-gold-glow transition-all duration-500"
              >
                <div className="absolute left-0 top-6 bottom-6 w-[3px] bg-gradient-to-b from-transparent via-primary/60 to-transparent rounded-full" />
                <div className="flex items-start justify-between mb-5">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-primary/20 flex-shrink-0" />
                </div>
                <p className="text-base text-white/80 italic font-light mb-7 leading-relaxed">
                  "{quote}"
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-white/6">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-serif font-bold text-black"
                    style={{ background: "linear-gradient(135deg, hsl(44,65%,56%), hsl(44,65%,42%))" }}
                  >
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-serif text-base leading-tight">{name}</p>
                    <p className="text-primary/70 text-xs uppercase tracking-widest mt-0.5">{role}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
