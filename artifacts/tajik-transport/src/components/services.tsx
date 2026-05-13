import { motion } from "framer-motion";
import { Plane, Crown, Briefcase, Map, Heart, UserCircle } from "lucide-react";

const services = [
  {
    title: "Airport Transfers",
    description: "Seamless and punctual transfers to and from Dushanbe International Airport with meet-and-greet service.",
    icon: Plane
  },
  {
    title: "VIP Cars",
    description: "The ultimate luxury experience with our top-tier fleet designed for dignitaries and VIPs.",
    icon: Crown
  },
  {
    title: "Business Trips",
    description: "Reliable and discreet transportation for executives, ensuring productivity on the move.",
    icon: Briefcase
  },
  {
    title: "Tourism Transportation",
    description: "Explore the majestic landscapes of Tajikistan in absolute comfort and style with knowledgeable drivers.",
    icon: Map
  },
  {
    title: "Wedding Cars",
    description: "Elegant and pristine vehicles to make your special day truly unforgettable.",
    icon: Heart
  },
  {
    title: "Chauffeur Services",
    description: "Professional, multi-lingual chauffeurs available for hourly or daily hire.",
    icon: UserCircle
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export function Services() {
  return (
    <section id="services" className="py-24 bg-black relative">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-white mb-4"
          >
            Our Services
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[2px] bg-primary mx-auto"
          />
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <div className="glass-panel p-8 rounded-sm h-full hover-gold-glow transition-all duration-500 group cursor-default">
                <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 group-hover:border-primary/50 transition-colors">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-serif text-white mb-3 tracking-wide">{service.title}</h3>
                <p className="text-gray-400 font-light leading-relaxed">
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
