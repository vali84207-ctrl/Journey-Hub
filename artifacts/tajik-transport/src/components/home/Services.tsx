import { motion } from "framer-motion";
import { Plane, Crown, Briefcase, Map, Heart, UserSquare } from "lucide-react";

const services = [
  {
    title: "Airport Transfers",
    description: "Punctual, discreet pickups and drop-offs at Dushanbe International Airport.",
    icon: Plane,
  },
  {
    title: "VIP Cars",
    description: "Ultra-luxury vehicles for dignitaries, executives, and special guests.",
    icon: Crown,
  },
  {
    title: "Business Trips",
    description: "Reliable hourly chauffeur services for your corporate engagements.",
    icon: Briefcase,
  },
  {
    title: "Tourism Transportation",
    description: "Explore the majestic Pamir Mountains in supreme comfort and safety.",
    icon: Map,
  },
  {
    title: "Wedding Cars",
    description: "Elegant arriving for your special day with our pristine luxury fleet.",
    icon: Heart,
  },
  {
    title: "Chauffeur Services",
    description: "Professional, multi-lingual drivers trained in defensive driving.",
    icon: UserSquare,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function Services() {
  return (
    <section id="services" className="py-32 relative bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Our Services</h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass-panel p-10 group hover-gold-glow transition-all duration-500 relative overflow-hidden"
            >
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors duration-500">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-bold text-white mb-4">{service.title}</h3>
                <p className="text-white/60 leading-relaxed font-light">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
