import { motion } from "framer-motion";
import { Users, Tag, ArrowLeft, ArrowRight, Wifi, Wind, Briefcase, Shield } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useListVehicles } from "@workspace/api-client-react";

type VehicleConfig = {
  name: string;
  year: string;
  pax: number;
  luggage: number;
  price: number;
  features: string[];
  cardImage: string;
  description: string;
};

const VEHICLE_CONFIG: Record<string, VehicleConfig> = {
  LC200: {
    name: "Toyota Land Cruiser 200",
    year: "2010",
    pax: 7,
    luggage: 3,
    price: 100,
    features: ["AC", "WiFi", "Professional Driver", "Luggage Space", "VIP Interior"],
    cardImage: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
    description: "The iconic Land Cruiser 200 series — legendary off-road capability combined with executive-class comfort for journeys across Tajikistan.",
  },
  LC300: {
    name: "Toyota Land Cruiser 300",
    year: "2012",
    pax: 7,
    luggage: 3,
    price: 120,
    features: ["AC", "WiFi", "Professional Driver", "Luggage Space", "VIP Interior"],
    cardImage: "https://images.unsplash.com/photo-1619767886558-efdc259b6e09?w=800&q=80",
    description: "The Land Cruiser 300 series delivers modern luxury with an imposing presence — ideal for VIP airport transfers and high-end executive travel.",
  },
};

const STATUS_STYLES: Record<string, string> = {
  available: "bg-green-500/10 border-green-500/30 text-green-400",
  reserved: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  busy: "bg-red-500/10 border-red-500/30 text-red-400",
};

export function FleetPage() {
  const { data: vehicles, isLoading } = useListVehicles();

  const sorted = vehicles
    ? [...vehicles].sort((a, b) => {
        if (a.type !== b.type) return a.type < b.type ? 1 : -1;
        return a.code.localeCompare(b.code);
      })
    : [];

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Back */}
        <Link href="/" className="inline-flex items-center text-primary hover:text-white transition-colors mb-10 text-sm uppercase tracking-wider cursor-pointer">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        {/* Header */}
        <div className="mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-primary uppercase tracking-[0.3em] text-xs mb-4 font-light"
          >
            Exclusive Fleet
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif text-white mb-4"
          >
            Toyota Land Cruiser
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[2px] bg-primary mb-6"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 font-light text-lg max-w-2xl"
          >
            Six meticulously maintained Land Cruiser 200 and 300 series vehicles, each equipped with premium amenities and a professional driver.
          </motion.p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-10">
          {Object.entries(STATUS_STYLES).map(([status, cls]) => (
            <div key={status} className={`flex items-center gap-2 px-3 py-1.5 border text-xs uppercase tracking-wider ${cls}`}>
              <div className={`w-2 h-2 rounded-full ${status === "available" ? "bg-green-400" : status === "reserved" ? "bg-amber-400" : "bg-red-400"}`} />
              {status}
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
          </div>
        ) : (
          <>
            {/* LC300 group */}
            {["LC300", "LC200"].map((type) => {
              const group = sorted.filter((v) => v.type === type);
              if (!group.length) return null;
              const cfg = VEHICLE_CONFIG[type];
              return (
                <div key={type} className="mb-16">
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-serif text-white">{cfg.name}</h2>
                    <span className="text-gray-500 font-light text-sm">{cfg.year} · {cfg.pax} passengers · ${cfg.price}/day</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {group.map((vehicle, index) => {
                      const isAvailable = vehicle.status === "available";
                      return (
                        <motion.div
                          key={vehicle.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.08 }}
                          className={`group flex flex-col border transition-all duration-500 cursor-pointer ${
                            isAvailable
                              ? "border-white/5 hover:border-primary/50"
                              : "border-white/5 opacity-75"
                          } bg-[#0a0a0a]`}
                        >
                          <Link href={`/fleet/${vehicle.id}`} className="flex flex-col h-full">
                            {/* Image */}
                            <div className="relative h-56 overflow-hidden">
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500 z-10" />
                              <img
                                src={cfg.cardImage}
                                alt={cfg.name}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                loading="lazy"
                              />
                              {/* Badges */}
                              <div className="absolute top-4 left-4 z-20">
                                <span className="bg-black/80 backdrop-blur-sm border border-white/10 px-3 py-1 text-xs font-mono tracking-wider text-white">
                                  {vehicle.code}
                                </span>
                              </div>
                              <div className="absolute top-4 right-4 z-20">
                                <span className={`px-3 py-1 text-xs tracking-wider uppercase backdrop-blur-sm border ${STATUS_STYLES[vehicle.status] ?? STATUS_STYLES.busy}`}>
                                  {vehicle.status}
                                </span>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                              <h3 className="text-xl font-serif text-primary mb-2">{cfg.name}</h3>
                              <p className="text-gray-500 text-sm font-light mb-5 leading-relaxed flex-1">{cfg.description}</p>

                              {/* Specs row */}
                              <div className="flex items-center gap-5 mb-5 text-sm text-gray-400">
                                <div className="flex items-center gap-1.5">
                                  <Users className="w-4 h-4 text-primary/60" />
                                  <span>{cfg.pax} Pax</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Briefcase className="w-4 h-4 text-primary/60" />
                                  <span>{cfg.luggage} Bags</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Wifi className="w-4 h-4 text-primary/60" />
                                  <span>WiFi</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Wind className="w-4 h-4 text-primary/60" />
                                  <span>AC</span>
                                </div>
                              </div>

                              {/* Price & CTA */}
                              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div>
                                  <span className="text-xs text-gray-500 uppercase tracking-wider">From</span>
                                  <div className="text-2xl font-serif text-primary">${cfg.price}<span className="text-sm text-gray-500 font-light">/day</span></div>
                                </div>
                                <Button
                                  className="bg-transparent border border-white/20 group-hover:border-primary group-hover:bg-primary group-hover:text-black transition-all duration-300 rounded-none text-white tracking-widest uppercase text-xs px-5 py-3"
                                  tabIndex={-1}
                                >
                                  Details <ArrowRight className="ml-1.5 w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Info strip */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 border border-white/5 bg-[#0a0a0a] p-8">
          {[
            { icon: Shield, title: "Fully Insured", desc: "All vehicles carry comprehensive insurance for your peace of mind." },
            { icon: Users, title: "Professional Drivers", desc: "Experienced, multilingual drivers trained in VIP hospitality." },
            { icon: Wind, title: "Climate Controlled", desc: "Premium dual-zone air conditioning throughout every journey." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4">
              <div className="w-10 h-10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="text-white font-serif mb-1">{title}</h4>
                <p className="text-gray-500 text-sm font-light leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
