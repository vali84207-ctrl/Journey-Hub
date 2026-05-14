import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What areas in Tajikistan do you serve?",
    answer: "We primarily operate in Dushanbe, offering airport transfers and city rides. We also provide intercity transportation and guided luxury trips to major tourist destinations across Tajikistan."
  },
  {
    question: "How far in advance should I book?",
    answer: "For guaranteed availability of your preferred vehicle, we recommend booking at least 24 hours in advance. However, we do accommodate short-notice requests subject to fleet availability."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major international credit cards, bank transfers for corporate accounts, and cash payments. Payment links can be securely provided upon booking confirmation."
  },
  {
    question: "Are your chauffeurs English-speaking?",
    answer: "Yes, we have a selection of professional, English-speaking chauffeurs. Please specify this requirement when making your reservation."
  },
  {
    question: "What happens if my flight is delayed?",
    answer: "We actively monitor flight tracking systems. Your chauffeur will adjust their arrival time accordingly, and we offer complimentary wait time for airport pickups."
  },
  {
    question: "Do you offer corporate billing?",
    answer: "Yes, we provide specialized corporate accounts with monthly invoicing and dedicated account management for frequent business travelers."
  }
];

export function FAQ() {
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
            Common Questions
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-white mb-5"
          >
            Frequently Asked Questions
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
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-white/8 px-6 py-1 transition-colors duration-300 hover:border-primary/25"
                style={{ background: 'rgba(255,255,255,0.025)' }}
              >
                <AccordionTrigger className="text-base md:text-lg font-serif hover:text-primary hover:no-underline text-left py-5 text-white/90">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300/75 font-light leading-relaxed pb-5 text-[15px]">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
