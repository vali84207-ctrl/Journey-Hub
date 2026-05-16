import { motion } from "framer-motion";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, Plane, Crown, Briefcase, Map, Heart, UserSquare } from "lucide-react";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/footer";

const placeholderIcons = [Plane, Crown, Briefcase, Map, Heart, UserSquare];

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

          <div className="mb-16 text-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-primary uppercase tracking-[0.3em] text-xs mb-4 font-light"
            >
              {t("services.comingSoon.eyebrow")}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-serif text-white mb-6"
            >
              {t("services.comingSoon.title")}
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "80px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-[2px] bg-primary mx-auto mb-8"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 font-light text-lg max-w-2xl mx-auto"
            >
              {t("services.comingSoon.body")}
            </motion.p>
          </div>

          {/* Decorative placeholder grid — preserves luxury black/gold feel
              while leaving the actual service catalogue intentionally empty. */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {placeholderIcons.map((Icon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className="glass-panel border border-white/5 p-10 flex flex-col items-center text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/5 pointer-events-none" />
                <div className="w-14 h-14 border border-primary/30 bg-primary/5 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="h-3 w-24 bg-white/5 mb-3" />
                <div className="h-2 w-32 bg-white/[0.03] mb-2" />
                <div className="h-2 w-20 bg-white/[0.03]" />
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center">
            <a
              href="https://wa.me/992004044035"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 border border-primary/60 text-primary hover:bg-primary hover:text-black transition-all duration-300 px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-medium"
            >
              {t("services.comingSoon.cta")}
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
