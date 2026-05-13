import { useState } from "react";
import { useParams, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Users, Car, Wifi, Wind, Briefcase, CheckCircle2, Loader2, Phone } from "lucide-react";

import { useListVehicles, useCreateBooking } from "@workspace/api-client-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const VEHICLE_CONFIG: Record<string, { name: string, pax: number, price: number, description: string }> = {
  "LC300": {
    name: "Toyota Land Cruiser 300",
    pax: 7,
    price: 120,
    description: "Experience the ultimate in luxury and capability with the Land Cruiser 300. Perfect for both executive city transfers and venturing into the majestic mountainous terrains of Tajikistan. Features premium leather seating, advanced climate control, and unmatched safety."
  },
  "LC-PRADO": {
    name: "Toyota Land Cruiser Prado",
    pax: 7,
    price: 90,
    description: "The Land Cruiser Prado offers an exceptional balance of luxury comfort and rugged reliability. Whether you're attending high-profile meetings in Dushanbe or planning a scenic drive, the Prado ensures you arrive in style and absolute comfort."
  }
};

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  pickup: z.string().min(2, "Pickup location is required"),
  destination: z.string().min(2, "Destination is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  carType: z.string().min(1, "Vehicle code is required"),
  passengers: z.coerce.number().min(1).max(20),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function VehicleDetailPage() {
  const { id } = useParams();
  const { data: vehicles, isLoading } = useListVehicles();
  const vehicle = vehicles?.find(v => v.id === Number(id));
  
  const [showSuccess, setShowSuccess] = useState(false);
  const createBooking = useCreateBooking();

  const config = vehicle ? (VEHICLE_CONFIG[vehicle.type] || {
    name: vehicle.model,
    pax: 4,
    price: 100,
    description: "Premium executive transport with professional chauffeur. Enjoy a seamless and luxurious journey across Tajikistan."
  }) : null;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      pickup: "",
      destination: "",
      date: "",
      time: "",
      carType: vehicle?.code || "",
      passengers: 1,
      notes: "",
    },
  });

  // Update default value if vehicle loads later
  if (vehicle && !form.getValues("carType")) {
    form.setValue("carType", vehicle.code);
  }

  function onSubmit(values: FormValues) {
    createBooking.mutate(
      { data: values },
      {
        onSuccess: () => {
          setShowSuccess(true);
          form.reset({ ...values, fullName: "", phone: "", notes: "" });
        },
      }
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </main>
    );
  }

  if (!vehicle || !config) {
    return (
      <main className="min-h-screen bg-[#050505] text-white pt-24 px-4 text-center">
        <h1 className="text-3xl font-serif text-primary mb-4">Vehicle Not Found</h1>
        <Link href="/fleet" className="text-gray-400 hover:text-white underline cursor-pointer">Return to Fleet</Link>
      </main>
    );
  }

  const isAvailable = vehicle.status === "available";

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <Link href="/fleet" className="inline-flex items-center text-primary hover:text-white transition-colors mb-8 text-sm uppercase tracking-wider cursor-pointer">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Fleet
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Details Column */}
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-black border border-white/20 px-3 py-1 text-sm font-mono tracking-wider">
                  {vehicle.code}
                </span>
                <span className={`px-3 py-1 text-sm tracking-wider uppercase border ${
                  vehicle.status === 'available' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                  vehicle.status === 'reserved' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                  'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                  {vehicle.status}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">{config.name}</h1>
              <p className="text-gray-400 font-light leading-relaxed text-lg">
                {config.description}
              </p>
            </div>

            <div className="h-64 md:h-80 bg-gradient-to-br from-gray-900 to-black relative flex items-center justify-center border border-white/5 mb-12 overflow-hidden">
               <Car className="w-32 h-32 text-primary/20" />
            </div>

            <h3 className="text-xl font-serif text-white mb-6 border-b border-white/10 pb-4">Features & Specifications</h3>
            <div className="grid grid-cols-2 gap-4 mb-12">
              <div className="flex items-center gap-3 bg-white/5 p-4 border border-white/5">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-light">Up to {config.pax} Passengers</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 p-4 border border-white/5">
                <Wind className="w-5 h-5 text-primary" />
                <span className="font-light">Climate Control (AC)</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 p-4 border border-white/5">
                <Wifi className="w-5 h-5 text-primary" />
                <span className="font-light">Complimentary WiFi</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 p-4 border border-white/5">
                <Briefcase className="w-5 h-5 text-primary" />
                <span className="font-light">Ample Luggage Space</span>
              </div>
            </div>
            
            <div className="bg-primary/5 border border-primary/20 p-8 flex flex-col items-center justify-center text-center">
               <span className="text-gray-400 uppercase tracking-widest text-sm mb-2">Starting from</span>
               <div className="text-5xl font-serif text-primary mb-2">${config.price}</div>
               <span className="text-gray-500 text-sm font-light">per day / trip variations apply</span>
            </div>
          </div>

          {/* Booking Column */}
          <div className="lg:pl-8">
            <div className="glass-panel p-8 md:p-10 border border-primary/20 sticky top-32">
              <h2 className="text-3xl font-serif text-white mb-2">Reserve Vehicle</h2>
              <p className="text-gray-400 font-light mb-8 pb-8 border-b border-white/10">Complete the form below to secure {vehicle.code} for your journey.</p>
              
              {!isAvailable ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                    <Car className="w-8 h-8 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-serif text-white mb-2">Currently Unavailable</h3>
                  <p className="text-gray-400 font-light mb-8">
                    This vehicle is currently marked as {vehicle.status}. Please select another vehicle from our fleet or contact us for alternatives.
                  </p>
                  <Button 
                    className="bg-transparent border border-primary text-primary hover:bg-primary hover:text-black transition-all duration-300 rounded-none w-full"
                    onClick={() => window.open("https://wa.me/992000000000", "_blank")}
                  >
                    <Phone className="w-4 h-4 mr-2" /> Inquire via WhatsApp
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="carType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 font-light tracking-wide">Vehicle</FormLabel>
                          <FormControl>
                            <Input readOnly className="bg-primary/10 border-primary/30 text-primary focus:border-primary rounded-none font-mono" {...field} />
                          </FormControl>
                          <FormMessage className="text-destructive/80" />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="fullName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 font-light tracking-wide">Full Name</FormLabel>
                          <FormControl><Input placeholder="John Doe" className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none" {...field} /></FormControl>
                          <FormMessage className="text-destructive/80" />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 font-light tracking-wide">Phone Number</FormLabel>
                          <FormControl><Input placeholder="+992 XXX XX XX XX" className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none" {...field} /></FormControl>
                          <FormMessage className="text-destructive/80" />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="date" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 font-light tracking-wide">Date</FormLabel>
                          <FormControl><Input type="date" className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none [color-scheme:dark]" {...field} /></FormControl>
                          <FormMessage className="text-destructive/80" />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="time" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 font-light tracking-wide">Time</FormLabel>
                          <FormControl><Input type="time" className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none [color-scheme:dark]" {...field} /></FormControl>
                          <FormMessage className="text-destructive/80" />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="pickup" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 font-light tracking-wide">Pickup Location</FormLabel>
                        <FormControl><Input className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none" {...field} /></FormControl>
                        <FormMessage className="text-destructive/80" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="destination" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 font-light tracking-wide">Destination</FormLabel>
                        <FormControl><Input className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none" {...field} /></FormControl>
                        <FormMessage className="text-destructive/80" />
                      </FormItem>
                    )} />
                    
                    <FormField control={form.control} name="passengers" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 font-light tracking-wide">Passengers</FormLabel>
                        <FormControl><Input type="number" min="1" max={config.pax} className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none" {...field} /></FormControl>
                        <FormMessage className="text-destructive/80" />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="notes" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 font-light tracking-wide">Notes (Optional)</FormLabel>
                        <FormControl><Textarea className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none min-h-[80px]" {...field} /></FormControl>
                        <FormMessage className="text-destructive/80" />
                      </FormItem>
                    )} />

                    <Button 
                      type="submit" 
                      disabled={createBooking.isPending}
                      className="bg-primary hover:bg-primary/90 text-black w-full py-6 text-lg tracking-widest rounded-none mt-4 uppercase"
                    >
                      {createBooking.isPending ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                      ) : (
                        "Confirm Reservation"
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="bg-black border border-primary/30 text-white sm:max-w-md p-10 outline-none">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-serif text-white">Booking Received</h2>
            <p className="text-gray-400 font-light text-lg">
              Thank you for choosing Tajik Elite. We have received your request for {vehicle.code}. Our team will contact you shortly to confirm.
            </p>
            <Button 
              onClick={() => setShowSuccess(false)}
              className="mt-4 bg-transparent border border-primary text-primary hover:bg-primary hover:text-black rounded-none px-8 tracking-widest uppercase"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
