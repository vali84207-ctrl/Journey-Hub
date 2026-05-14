import { motion } from "framer-motion";
import { Mail, MapPin, Phone, MessageCircle, Send, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export function Contact() {
  const { t } = useTranslation();
  const items = [
    { icon: Phone, label: t("contact.phone"), value: "+992 00 404 40 35" },
    { icon: Mail, label: t("contact.email"), value: "info@pamirLuxedrive.com" },
    { icon: MapPin, label: t("contact.headquarters"), value: t("contact.address") },
  ];
  return (
    <section id="contact" className="py-28 bg-[#070707] relative">
      <div className="gold-divider absolute top-0 left-0 right-0" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary uppercase tracking-[0.3em] text-xs mb-4 font-light"
          >
            {t("contact.eyebrow")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-white mb-5"
          >
            {t("contact.title")}
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            <div>
              <h3 className="text-2xl font-serif text-white mb-4">{t("contact.getInTouch")}</h3>
              <p className="text-gray-300/70 font-light leading-relaxed text-[15px]">
                {t("contact.description")}
              </p>
            </div>

            <div className="space-y-6">
              {items.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4 group">
                  <div
                    className="w-12 h-12 flex items-center justify-center shrink-0 mt-0.5 border border-white/12 group-hover:border-primary/50 transition-all duration-300"
                    style={{ background: "rgba(203,169,78,0.05)" }}
                  >
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-white font-light leading-relaxed whitespace-pre-line">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">{t("contact.connect")}</p>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="rounded-none border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366] hover:text-white bg-transparent h-11 px-5 text-sm transition-all duration-300"
                  onClick={() => window.open("https://wa.me/992004044035", "_blank")}
                >
                  <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="rounded-none border-[#0088cc]/40 text-[#0088cc] hover:bg-[#0088cc] hover:text-white bg-transparent h-11 px-5 text-sm transition-all duration-300"
                  onClick={() => window.open("https://t.me/PamirLuxeDrive", "_blank")}
                >
                  <Send className="w-4 h-4 mr-2" /> Telegram
                </Button>
                <Button
                  variant="outline"
                  className="rounded-none border-[#E1306C]/40 text-[#E1306C] hover:bg-gradient-to-r hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F56040] hover:text-white hover:border-transparent bg-transparent h-11 px-5 text-sm transition-all duration-300"
                  onClick={() => window.open("https://instagram.com/PamirLuxeDrive", "_blank")}
                >
                  <Instagram className="w-4 h-4 mr-2" /> Instagram
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="h-[400px] md:h-[500px] w-full border overflow-hidden"
            style={{ borderColor: "rgba(203,169,78,0.2)", boxShadow: "0 0 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(203,169,78,0.08)" }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100140.23071378875!2d68.70425712282245!3d38.561146399120614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38b5d1685256b3bf%3A0x8bd57dc5eb5e6d92!2sDushanbe%2C%20Tajikistan!5e0!3m2!1sen!2sus!4v1709214316988!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(80%) grayscale(80%)" }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
