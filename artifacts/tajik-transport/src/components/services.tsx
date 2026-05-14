import { motion } from "framer-motion";
import { Plane, Crown, Briefcase, Map, Heart, UserCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const services = [
  { key: "airport", icon: Plane },
  { key: "vip", icon: Crown },
  { key: "business", icon: Briefcase },
  { key: "tourism", icon: Map },
  { key: "wedding", icon: Heart },
  { key: "chauffeur", icon: UserCircle },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function Services() {
  const { t } = useTranslation();
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
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {services.map((service) => (
            <motion.div key={service.key} variants={itemVariants}>
              <div className="glass-panel card-gold-top p-8 h-full hover-gold-glow transition-all duration-500 group cursor-default">
                <div
                  className="w-14 h-14 flex items-center justify-center mb-6 border border-primary/20 group-hover:border-primary/60 transition-all duration-400 relative"
                  style={{ background: "rgba(203,169,78,0.06)" }}
                >
                  <service.icon className="w-6 h-6 text-primary" />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                    style={{ boxShadow: "inset 0 0 20px rgba(203,169,78,0.12)" }}
                  />
                </div>
                <h3 className="text-xl font-serif text-white mb-3 tracking-wide group-hover:text-primary/90 transition-colors duration-300">
                  {t(`services.items.${service.key}.title`)}
                </h3>
                <p className="text-gray-300/80 font-light leading-relaxed text-[15px]">
                  {t(`services.items.${service.key}.desc`)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
