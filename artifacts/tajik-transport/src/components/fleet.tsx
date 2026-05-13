import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const teaserFleet = [
  {
    name: "Toyota Land Cruiser 300",
    year: "2012",
    tag: "LC300",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259b6e09?w=800&q=80",
  },
  {
    name: "Toyota Land Cruiser 200",
    year: "2010",
    tag: "LC200",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
  },
  {
    name: "Toyota Land Cruiser 300",
    year: "2012",
    tag: "LC300",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
  },
];

export function FleetTeaser() {
  return (
    <section id="fleet" className="py-24 bg-[#050505] relative">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary uppercase tracking-[0.3em] text-xs mb-4 font-light"
          >
            Premium Fleet
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-white mb-4"
          >
            Toyota Land Cruiser
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[2px] bg-primary mx-auto"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 font-light mt-6 max-w-xl mx-auto"
          >
            An exclusive fleet of six Land Cruiser 200 and 300 series vehicles — chosen for their legendary reliability and VIP-level comfort.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {teaserFleet.map((car, index) => (
            <Link key={index} href="/fleet">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-panel group overflow-hidden flex flex-col cursor-pointer hover:border-primary/50 border border-white/5 transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500 z-10" />
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-black/80 backdrop-blur-sm border border-white/10 px-3 py-1 text-xs font-mono tracking-wider text-white">
                      {car.tag}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-serif text-primary">{car.name}</h3>
                    <p className="text-gray-500 text-sm font-light mt-1">Year {car.year}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary/50 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </motion.div>
            </Link>
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
