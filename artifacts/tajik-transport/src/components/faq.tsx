import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_KEYS = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

export function FAQ() {
  const { t } = useTranslation();
  return (
    <section className="py-28 bg-black relative section-glow">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary uppercase tracking-[0.3em] text-xs mb-4 font-light"
          >
            {t("faq.eyebrow")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-white mb-5"
          >
            {t("faq.title")}
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
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-3">
            {FAQ_KEYS.map((key, index) => (
              <AccordionItem
                key={key}
                value={`item-${index}`}
                className="border border-white/8 px-6 py-1 transition-colors duration-300 hover:border-primary/25"
                style={{ background: "rgba(255,255,255,0.025)" }}
              >
                <AccordionTrigger className="text-base md:text-lg font-serif hover:text-primary hover:no-underline text-left py-5 text-white/90">
                  {t(`faq.items.${key}.q`)}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300/75 font-light leading-relaxed pb-5 text-[15px]">
                  {t(`faq.items.${key}.a`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
