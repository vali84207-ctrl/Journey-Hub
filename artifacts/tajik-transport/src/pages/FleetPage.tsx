import { motion } from "framer-motion";
import { Users, Tag, ArrowLeft, Car } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useListVehicles } from "@workspace/api-client-react";

const VEHICLE_CONFIG: Record<string, { name: string, pax: number, price: number, features: string[] }> = {
  "LC300": {
    name: "Toyota Land Cruiser 300",
    pax: 7,
    price: 120,
    features: ["AC", "WiFi", "Driver included", "Luggage space"]
  },
  "LC-PRADO": {
    name: "Toyota Land Cruiser Prado",
    pax: 7,
    price: 90,
    features: ["AC", "WiFi", "Driver included", "Luggage space"]
  }
};

export function FleetPage() {
  const { data: vehicles, isLoading } = useListVehicles();

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-primary hover:text-white transition-colors mb-8 text-sm uppercase tracking-wider cursor-pointer">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        
        <div className="mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif text-white mb-4"
          >
            Our Premium Fleet
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
            Exquisite vehicles tailored to your needs. All equipped with AC, WiFi, and professional drivers.
          </motion.p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles?.map((vehicle, index) => {
              const config = VEHICLE_CONFIG[vehicle.type] || {
                name: vehicle.model,
                pax: 4,
                price: 100,
                features: ["AC", "Driver included"]
              };

              const isAvailable = vehicle.status === "available";

              return (
                <motion.div 
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`glass-panel border border-white/5 hover:border-primary/50 transition-all duration-500 flex flex-col ${!isAvailable ? 'opacity-70' : ''}`}
                >
                  <div className="h-56 bg-gradient-to-br from-gray-900 to-black relative flex items-center justify-center border-b border-white/5 overflow-hidden">
                    <Car className="w-24 h-24 text-primary/20 absolute" />
                    <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-10">
                      <div className="bg-black/80 backdrop-blur-sm border border-white/10 px-3 py-1 text-xs font-mono tracking-wider">
                        {vehicle.code}
                      </div>
                      <div className={`px-3 py-1 text-xs tracking-wider uppercase backdrop-blur-sm border ${
                        vehicle.status === 'available' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                        vehicle.status === 'reserved' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                        'bg-red-500/10 border-red-500/30 text-red-400'
                      }`}>
                        {vehicle.status}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-2xl font-serif text-primary mb-4">{config.name}</h3>
                    
                    <div className="flex items-center gap-6 mb-4 text-sm text-gray-300 font-light">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary/70" />
                        <span>{config.pax} Pax</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-primary/70" />
                        <span>${config.price}/day</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {config.features.map(f => (
                        <span key={f} className="text-[10px] uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-1 text-gray-400">
                          {f}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-auto">
                      <Link href={`/fleet/${vehicle.id}`}>
                        <Button 
                          className="w-full bg-transparent border border-white/20 hover:border-primary hover:bg-primary hover:text-black transition-all duration-300 rounded-none text-white tracking-widest uppercase text-xs py-5 cursor-pointer"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
