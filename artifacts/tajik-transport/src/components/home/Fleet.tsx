import { motion } from "framer-motion";
import { Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

import imgMercedes from "@/assets/images/car-mercedes.jpg";
import imgLandCruiser from "@/assets/images/car-land-cruiser.jpg";
import imgLexus from "@/assets/images/car-lexus.jpg";
import imgBmw from "@/assets/images/car-bmw.jpg";
import imgStaria from "@/assets/images/car-staria.jpg";
import imgTahoe from "@/assets/images/car-tahoe.jpg";

const fleet = [
  {
    name: "Mercedes S-Class",
    image: imgMercedes,
    pax: 3,
    price: 80,
  },
  {
    name: "Toyota Land Cruiser",
    image: imgLandCruiser,
    pax: 6,
    price: 90,
  },
  {
    name: "Lexus LX570",
    image: imgLexus,
    pax: 6,
    price: 95,
  },
  {
    name: "BMW 7 Series",
    image: imgBmw,
    pax: 3,
    price: 85,
  },
  {
    name: "Hyundai Staria",
    image: imgStaria,
    pax: 7,
    price: 70,
  },
  {
    name: "Chevrolet Tahoe",
    image: imgTahoe,
    pax: 6,
    price: 75,
  },
];

export function Fleet() {
  const scrollToBooking = () => {
    document.querySelector("#book")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="fleet" className="py-32 relative bg-[#050505]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Our Fleet</h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fleet.map((car, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-card border border-white/5 overflow-hidden"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10 duration-500" />
                <img 
                  src={car.image} 
                  alt={car.name} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                />
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-serif font-bold text-primary mb-6">{car.name}</h3>
                
                <div className="flex flex-col gap-4 mb-8">
                  <div className="flex items-center gap-3 text-white/70">
                    <Users className="w-5 h-5 text-white/40" />
                    <span className="font-light tracking-wide">Up to {car.pax} Passengers</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/70">
                    <DollarSign className="w-5 h-5 text-white/40" />
                    <span className="font-light tracking-wide">From ${car.price} / trip</span>
                  </div>
                </div>

                <Button 
                  onClick={scrollToBooking}
                  className="w-full bg-white/5 hover:bg-primary hover:text-primary-foreground text-white border border-white/10 hover:border-primary transition-all duration-300 rounded-none uppercase tracking-widest text-xs py-6"
                >
                  Book Now
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
