import { motion } from "framer-motion";
import { Users, ArrowLeft, ArrowRight, Wifi, Wind, Briefcase, Shield } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useListVehicles } from "@workspace/api-client-react";

const STATUS_STYLES: Record<string, string> = {
  available: "bg-green-500/10 border-green-500/30 text-green-400",
  reserved: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  busy: "bg-red-500/10 border-red-500/30 text-red-400",
};

export function FleetPage() {
  const { data: vehicles, isLoading } = useListVehicles();

  const visible = (vehicles ?? []).filter((v) => v.status !== "hidden");
  const grouped = visible.reduce<Record<string, typeof visible>>((acc, v) => {
    (acc[v.type] ??= []).push(v);
    return acc;
  }, {});
  const types = Object.keys(grouped).sort();

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-primary hover:text-white transition-colors mb-10 text-sm uppercase tracking-wider cursor-pointer">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        <div className="mb-16">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary uppercase tracking-[0.3em] text-xs mb-4 font-light">
            Exclusive Fleet
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-serif text-white mb-4">
            Our Vehicles
          </motion.h1>
          <motion.div initial={{ width: 0 }} animate={{ width: "80px" }} transition={{ duration: 0.8, delay: 0.2 }} className="h-[2px] bg-primary mb-6" />
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-gray-400 font-light text-lg max-w-2xl">
            A meticulously maintained fleet of Land Cruisers, each equipped with premium amenities and a professional VIP driver.
          </motion.p>
        </div>

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
            {types.map((type) => {
              const group = grouped[type];
              if (!group?.length) return null;
              const first = group[0];
              return (
                <div key={type} className="mb-16">
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-serif text-white">{first.name || first.model}</h2>
                    <span className="text-gray-500 font-light text-sm">{first.year} · {first.pax} passengers · ${first.pricePerDay}/day</span>
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
                            isAvailable ? "border-white/5 hover:border-primary/50" : "border-white/5 opacity-75"
                          } bg-[#0a0a0a]`}
                        >
                          <Link href={`/fleet/${vehicle.id}`} className="flex flex-col h-full">
                            <div className="relative h-56 overflow-hidden">
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500 z-10" />
                              <img
                                src={vehicle.mainImage || "/lc-hero.png"}
                                alt={vehicle.name || vehicle.model}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                loading="lazy"
                              />
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

                            <div className="p-6 flex-1 flex flex-col">
                              <h3 className="text-xl font-serif text-primary mb-2">{vehicle.name || vehicle.model}</h3>
                              <p className="text-gray-500 text-sm font-light mb-5 leading-relaxed flex-1">{vehicle.description}</p>

                              <div className="flex items-center gap-5 mb-5 text-sm text-gray-400">
                                <div className="flex items-center gap-1.5">
                                  <Users className="w-4 h-4 text-primary/60" />
                                  <span>{vehicle.pax} Pax</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Briefcase className="w-4 h-4 text-primary/60" />
                                  <span>3 Bags</span>
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

                              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div>
                                  <span className="text-xs text-gray-500 uppercase tracking-wider">From</span>
                                  <div className="text-2xl font-serif text-primary">${vehicle.pricePerDay}<span className="text-sm text-gray-500 font-light">/day</span></div>
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
