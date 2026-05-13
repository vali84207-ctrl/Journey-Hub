import { motion } from "framer-motion";
import { Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const fleet = [
  {
    code: "LC300-01",
    type: "LC300",
    name: "Land Cruiser 300",
    subtitle: "New Generation · 2021+",
    pax: 7,
    price: 120,
    id: 1,
  },
  {
    code: "LC300-02",
    type: "LC300",
    name: "Land Cruiser 300",
    subtitle: "New Generation · 2021+",
    pax: 7,
    price: 120,
    id: 2,
  },
  {
    code: "LC300-03",
    type: "LC300",
    name: "Land Cruiser 300",
    subtitle: "New Generation · 2021+",
    pax: 7,
    price: 120,
    id: 3,
  },
  {
    code: "LC200-01",
    type: "LC200",
    name: "Land Cruiser 200",
    subtitle: "Classic Series · 2015–2021",
    pax: 7,
    price: 100,
    id: 4,
  },
  {
    code: "LC200-02",
    type: "LC200",
    name: "Land Cruiser 200",
    subtitle: "Classic Series · 2015–2021",
    pax: 7,
    price: 100,
    id: 5,
  },
  {
    code: "LC200-03",
    type: "LC200",
    name: "Land Cruiser 200",
    subtitle: "Classic Series · 2015–2021",
    pax: 7,
    price: 100,
    id: 6,
  },
];

export function Fleet() {
  return (
    <section id="fleet" className="py-32 relative bg-[#050505]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20">
          <p className="text-primary uppercase tracking-[0.3em] text-xs mb-4 font-light">Exclusive Fleet</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Toyota Land Cruiser</h2>
          <div className="w-24 h-[2px] bg-primary mx-auto mb-6" />
          <p className="text-gray-400 font-light text-lg max-w-2xl mx-auto">
            Six meticulously maintained Land Cruiser 200 and 300 series vehicles, each piloted by a professional chauffeur.
          </p>
        </div>

        {/* Hero image banner */}
        <div className="relative mb-16 overflow-hidden h-64 md:h-80">
          <img
            src="/lc-hero.png"
            alt="Pamir Luxe Drive Fleet — LC200 & LC300"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/60 via-transparent to-[#050505]/60" />
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-12 text-center">
            <div>
              <p className="text-3xl font-serif text-primary font-bold">LC200</p>
              <p className="text-xs text-white/60 uppercase tracking-widest mt-1">Classic Series</p>
            </div>
            <div className="w-[1px] bg-white/10" />
            <div>
              <p className="text-3xl font-serif text-primary font-bold">LC300</p>
              <p className="text-xs text-white/60 uppercase tracking-widest mt-1">New Generation</p>
            </div>
          </div>
        </div>

        {/* Vehicle cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fleet.map((car, index) => (
            <motion.div
              key={car.code}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="group bg-[#0a0a0a] border border-white/5 hover:border-primary/40 overflow-hidden transition-all duration-500"
            >
              <Link href={`/fleet/${car.id}`} className="block">
                {/* Image */}
                <div className="aspect-[16/10] overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors z-10 duration-500" />
                  <img
                    src="/lc-hero.png"
                    alt={car.name}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                      car.type === "LC300" ? "object-right" : "object-left"
                    }`}
                  />
                  {/* Code badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-black/80 backdrop-blur-sm border border-white/10 px-3 py-1 text-xs font-mono tracking-wider text-white">
                      {car.code}
                    </span>
                  </div>
                  {/* Logo badge */}
                  <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <img src="/pamir-luxe-logo.png" alt="PLD" className="h-8 w-auto drop-shadow-lg" />
                  </div>
                </div>

                <div className="p-8">
                  <p className="text-xs text-primary/70 uppercase tracking-widest mb-1">{car.subtitle}</p>
                  <h3 className="text-2xl font-serif font-bold text-white mb-5">{car.name}</h3>

                  <div className="flex items-center gap-3 text-white/60 mb-8">
                    <Users className="w-4 h-4 text-primary/60" />
                    <span className="font-light tracking-wide text-sm">Up to {car.pax} Passengers</span>
                    <span className="text-white/20 ml-auto text-sm font-light">From <span className="text-primary font-serif">${car.price}</span>/day</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs text-gray-500 uppercase tracking-widest">View Details</span>
                    <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link href="/fleet">
            <Button className="bg-transparent border border-primary/50 hover:bg-primary hover:text-black text-primary font-semibold tracking-widest uppercase px-12 py-6 rounded-none transition-all duration-300 text-sm">
              View Full Fleet
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
