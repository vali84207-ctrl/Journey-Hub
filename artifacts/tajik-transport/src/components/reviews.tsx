import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Alexander Volkov",
    role: "Business Executive",
    quote: "Exceptional service. The S-Class was immaculate, and the chauffeur was highly professional. Truly the Blacklane of Central Asia.",
    rating: 5
  },
  {
    name: "Sarah Jenkins",
    role: "Diplomat",
    quote: "I rely on Tajik Elite for all my transportation needs in Dushanbe. Their discretion, punctuality, and luxury fleet are unmatched.",
    rating: 5
  },
  {
    name: "Rustam Karimov",
    role: "Entrepreneur",
    quote: "Booked the Land Cruiser for a trip to the mountains. Smooth ride, incredibly safe driver, and top-tier comfort the entire way.",
    rating: 5
  },
  {
    name: "Elena M.",
    role: "Private Client",
    quote: "From the airport pickup to the hotel transfer, everything was seamless. The attention to detail makes all the difference.",
    rating: 5
  }
];

export function Reviews() {
  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-white mb-4"
          >
            What Our Clients Say
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[2px] bg-primary mx-auto"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="glass-panel p-8 rounded-sm"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-lg text-gray-300 italic font-light mb-8 leading-relaxed">
                "{review.quote}"
              </p>
              <div>
                <p className="text-white font-serif text-lg">{review.name}</p>
                <p className="text-primary text-sm uppercase tracking-widest mt-1">{review.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
