import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import carMercedes from "@/assets/images/car-mercedes.jpg";
import carLandCruiser from "@/assets/images/car-land-cruiser.jpg";
import carLexus from "@/assets/images/car-lexus.jpg";

const teaserFleet = [
  {
    name: "Mercedes S-Class",
    image: carMercedes,
  },
  {
    name: "Toyota Land Cruiser",
    image: carLandCruiser,
  },
  {
    name: "Lexus LX570",
    image: carLexus,
  }
];

export function FleetTeaser() {
  return (
    <section id="fleet" className="py-24 bg-[#050505] relative">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-white mb-4"
          >
            Our Fleet
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[2px] bg-primary mx-auto"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {teaserFleet.map((car, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-panel group overflow-hidden flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img 
                  src={car.image} 
                  alt={car.name} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-serif text-primary">{car.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center">
          <Link href="/fleet">
            <Button className="bg-transparent border border-primary text-primary hover:bg-primary hover:text-black transition-all duration-300 rounded-none px-8 py-6 text-sm tracking-widest uppercase cursor-pointer">
              View Full Fleet <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
