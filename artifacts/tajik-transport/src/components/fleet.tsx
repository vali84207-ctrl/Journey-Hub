import { motion } from "framer-motion";
import { Users, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

import carMercedes from "@/assets/images/car-mercedes.jpg";
import carLandCruiser from "@/assets/images/car-land-cruiser.jpg";
import carLexus from "@/assets/images/car-lexus.jpg";
import carBmw from "@/assets/images/car-bmw.jpg";
import carStaria from "@/assets/images/car-staria.jpg";
import carTahoe from "@/assets/images/car-tahoe.jpg";

const fleet = [
  {
    name: "Mercedes S-Class",
    image: carMercedes,
    pax: 3,
    price: 80,
  },
  {
    name: "Toyota Land Cruiser",
    image: carLandCruiser,
    pax: 6,
    price: 90,
  },
  {
    name: "Lexus LX570",
    image: carLexus,
    pax: 6,
    price: 95,
  },
  {
    name: "BMW 7 Series",
    image: carBmw,
    pax: 3,
    price: 85,
  },
  {
    name: "Hyundai Staria",
    image: carStaria,
    pax: 7,
    price: 70,
  },
  {
    name: "Chevrolet Tahoe",
    image: carTahoe,
    pax: 6,
    price: 75,
  }
];

export function Fleet() {
  const scrollToBooking = (carName: string) => {
    const el = document.getElementById("booking");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      // We could use context or URL params to pre-select the car, 
      // but for simplicity we just scroll down
    }
  };

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fleet.map((car, index) => (
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
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-serif text-primary mb-4">{car.name}</h3>
                
                <div className="flex items-center gap-6 mb-6 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{car.pax} Passengers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-primary" />
                    <span>From ${car.price}/trip</span>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <Button 
                    className="w-full bg-white/5 border border-white/10 hover:border-primary hover:bg-primary hover:text-black transition-all duration-300 rounded-none text-white tracking-widest uppercase text-xs py-5"
                    onClick={() => scrollToBooking(car.name)}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
