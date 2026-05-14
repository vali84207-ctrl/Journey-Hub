import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft, Users, Wifi, Wind, Briefcase, CheckCircle2,
  Loader2, Phone, Shield, Star, MapPin, Clock, ChevronRight,
  MessageCircle, Car,
} from "lucide-react";
import { useListVehicles, useCreateBooking } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_STYLES: Record<string, string> = {
  available: "bg-green-500/10 border-green-500/30 text-green-400",
  reserved: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  busy: "bg-red-500/10 border-red-500/30 text-red-400",
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
  const vehicle = vehicles?.find((v) => v.id === Number(id));

  const [activeImg, setActiveImg] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"terms" | "policy" | "travel" | "contact">("terms");

  const createBooking = useCreateBooking();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "", phone: "", pickup: "", destination: "",
      date: "", time: "", carType: vehicle?.code ?? "", passengers: 1, notes: "",
    },
  });

  useEffect(() => {
    if (vehicle?.code) form.setValue("carType", vehicle.code);
  }, [vehicle?.code, form]);

  useEffect(() => { window.scrollTo(0, 0); setActiveImg(0); }, [id]);

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </main>
    );
  }

  if (!vehicle || vehicle.status === "hidden") {
    return (
      <main className="min-h-screen bg-[#050505] text-white pt-24 px-4 text-center">
        <Car className="w-16 h-16 text-primary/30 mx-auto mb-6" />
        <h1 className="text-3xl font-serif text-primary mb-4">Vehicle Not Found</h1>
        <Link href="/fleet" className="text-gray-400 hover:text-white underline cursor-pointer">
          Return to Fleet
        </Link>
      </main>
    );
  }

  const isAvailable = vehicle.status === "available";
  const showBooking = vehicle.bookingVisible !== false;
  const gallery = vehicle.gallery && vehicle.gallery.length > 0
    ? vehicle.gallery
    : [vehicle.mainImage || "/lc-hero.png"];
  const displayName = vehicle.name || vehicle.model;
  const features = vehicle.features ?? [];

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-24">
      {/* Hero / Image Gallery */}
      <div className="relative w-full h-[55vh] md:h-[65vh] overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImg}
            src={gallery[activeImg]}
            alt={displayName}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/30 to-transparent" />

        {gallery.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {gallery.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-16 h-10 md:w-20 md:h-12 overflow-hidden border-2 transition-all duration-300 ${
                  activeImg === i ? "border-primary" : "border-white/20 opacity-60 hover:opacity-100"
                }`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="absolute top-6 left-6 z-20">
          <Link
            href="/fleet"
            className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-sm border border-white/10 px-4 py-2 text-sm text-white hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Fleet
          </Link>
        </div>
      </div>

      {/* Main */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-10">
        <div className={`grid grid-cols-1 ${showBooking ? "lg:grid-cols-5" : ""} gap-12 lg:gap-16`}>
          <div className={showBooking ? "lg:col-span-3" : ""}>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="bg-black border border-white/20 px-3 py-1 text-sm font-mono tracking-wider">
                {vehicle.code}
              </span>
              <span className={`px-3 py-1 text-sm tracking-wider uppercase border ${STATUS_STYLES[vehicle.status] ?? STATUS_STYLES.busy}`}>
                {vehicle.status}
              </span>
              <span className="text-gray-500 text-sm font-light">{vehicle.year}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">{displayName}</h1>
            <p className="text-gray-300 font-light leading-relaxed text-lg mb-10">{vehicle.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
              {[
                { icon: Users, label: `${vehicle.pax} Passengers` },
                { icon: Briefcase, label: "Luggage" },
                { icon: Wind, label: "Climate Control" },
                { icon: Wifi, label: "4G WiFi" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 bg-white/3 border border-white/5 p-4 text-center">
                  <Icon className="w-6 h-6 text-primary" />
                  <span className="text-xs text-gray-300 font-light">{label}</span>
                </div>
              ))}
            </div>

            {features.length > 0 && (
              <>
                <h3 className="text-xl font-serif text-white mb-5 border-b border-white/10 pb-4">Features & Inclusions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
                  {features.map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-gray-300 font-light text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <h3 className="text-xl font-serif text-white mb-5 border-b border-white/10 pb-4">What's Always Included</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
              {[
                "Professional licensed chauffeur",
                "Door-to-door VIP service",
                "Complimentary bottled water",
                "24/7 dispatch support",
                "Full comprehensive insurance",
                "Meet & greet at airport",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-gray-300 font-light text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-12 bg-primary/5 border border-primary/20 px-6 py-4">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => <Star key={s} className="w-4 h-4 fill-primary text-primary" />)}
              </div>
              <span className="text-primary font-serif text-lg">5.0</span>
              <span className="text-gray-400 text-sm font-light">— consistently rated excellent by our clients</span>
            </div>

            <div id="info" className="mb-4">
              <div className="flex border-b border-white/10 mb-8 overflow-x-auto">
                {(["terms", "policy", "travel", "contact"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-3 text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${
                      activeTab === tab ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-white"
                    }`}
                  >
                    {tab === "terms" ? "Terms & Conditions"
                      : tab === "policy" ? "Booking Policy"
                      : tab === "travel" ? "Travel Information"
                      : "Contact Us"}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "terms" && (
                  <motion.div key="terms" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5 text-gray-400 font-light leading-relaxed text-sm">
                    <h4 className="text-white font-serif text-lg">Terms & Conditions</h4>
                    <p>By completing a booking with Pamir Luxe Drive, you agree to the following terms. Please read them carefully before confirming your reservation.</p>
                    {[
                      ["1. Service Agreement", "Pamir Luxe Drive provides premium ground transportation services within the Republic of Tajikistan. All bookings are subject to vehicle availability at the time of confirmation."],
                      ["2. Driver Conduct", "Our chauffeurs are professionally trained and licensed, bound by a strict code of conduct encompassing punctuality, discretion, and guest safety at all times."],
                      ["3. Liability", "We hold full comprehensive vehicle insurance. The company is not responsible for delays caused by circumstances beyond our control."],
                      ["4. Luggage & Property", "Clients are responsible for their personal belongings. We accept no liability for items left in the vehicle."],
                      ["5. Governing Law", "These terms are governed by the laws of the Republic of Tajikistan."],
                    ].map(([title, body]) => (
                      <div key={title as string}>
                        <h5 className="text-white text-sm font-medium mb-1">{title}</h5>
                        <p>{body}</p>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === "policy" && (
                  <motion.div key="policy" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5 text-gray-400 font-light leading-relaxed text-sm">
                    <h4 className="text-white font-serif text-lg">Booking Policy</h4>
                    {[
                      ["Reservations", "All bookings must be made at least 2 hours in advance. For same-day, contact us via WhatsApp or Telegram."],
                      ["Confirmation", "Your reservation is not guaranteed until you receive a written confirmation. Our dispatch will contact you within 30 minutes."],
                      ["Cancellations", "Cancellations more than 24 hours before pickup are fully refunded. Within 24 hours: 50% fee. No-shows charged in full."],
                      ["Waiting Time", "Complimentary 15 min for city pickups, 45 min for airport arrivals from actual landing time."],
                      ["Payment", "Tajik Somoni (TJS) or US Dollars (USD) in cash, or via prior arrangement. Corporate invoicing available."],
                    ].map(([title, body]) => (
                      <div key={title as string} className="flex gap-3">
                        <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="text-white text-sm font-medium mb-1">{title}</h5>
                          <p>{body}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === "travel" && (
                  <motion.div key="travel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5 text-gray-400 font-light leading-relaxed text-sm">
                    <h4 className="text-white font-serif text-lg">Travel Information — Tajikistan</h4>
                    <p>Tajikistan offers some of Central Asia's most dramatic landscapes. Our Land Cruiser fleet is purpose-suited to its terrain.</p>
                    {[
                      { icon: MapPin, title: "Key Routes", body: "Dushanbe Airport · Khujand · Kulob · Murghab · Ishkashim · Wakhan Corridor. Full Pamir Highway expeditions by arrangement." },
                      { icon: Clock, title: "Journey Times", body: "Dushanbe city transfers: 30–60 min. Dushanbe–Khujand: ~8 hrs. Dushanbe–Murghab: ~16–20 hrs depending on conditions." },
                      { icon: Shield, title: "Safety", body: "All vehicles carry first-aid kits, high-altitude emergency equipment, and satellite communication for remote routes." },
                      { icon: Star, title: "Best Seasons", body: "May–October optimal for mountain routes. Winter possible on main highways with our 4WD fleet." },
                    ].map(({ icon: Icon, title, body }) => (
                      <div key={title} className="flex gap-3">
                        <div className="w-8 h-8 border border-primary/30 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h5 className="text-white text-sm font-medium mb-1">{title}</h5>
                          <p>{body}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === "contact" && (
                  <motion.div key="contact" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5 text-gray-400 font-light leading-relaxed text-sm">
                    <h4 className="text-white font-serif text-lg">Contact Pamir Luxe Drive</h4>
                    <p>Our dispatch team is available around the clock for bookings, route planning, and special requirements.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { icon: Phone, label: "Phone / WhatsApp", value: "+992 00 404 40 35" },
                        { icon: MessageCircle, label: "Telegram", value: "@PamirLuxeDrive" },
                        { icon: MapPin, label: "Base Location", value: "Dushanbe, Tajikistan" },
                        { icon: Clock, label: "Operating Hours", value: "24 / 7 — 365 days" },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex gap-3 bg-white/3 border border-white/5 p-4">
                          <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                          <div>
                            <div className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">{label}</div>
                            <div className="text-white">{value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-4">
                      <Button onClick={() => window.open("https://wa.me/992004044035", "_blank")} className="bg-[#25D366] hover:bg-[#1ebe5a] text-white rounded-none px-6 py-3 text-sm tracking-wider uppercase">
                        <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                      </Button>
                      <Button onClick={() => window.open("https://t.me/PamirLuxeDrive", "_blank")} className="bg-[#229ED9] hover:bg-[#1a8cc2] text-white rounded-none px-6 py-3 text-sm tracking-wider uppercase">
                        <Phone className="w-4 h-4 mr-2" /> Telegram
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {showBooking && (
            <div className="lg:col-span-2">
              <div className="glass-panel p-8 border border-primary/20 sticky top-28">
                <div className="text-center pb-6 mb-6 border-b border-white/10">
                  <span className="text-gray-500 uppercase tracking-widest text-xs">Starting from</span>
                  <div className="text-5xl font-serif text-primary mt-1">${vehicle.pricePerDay}</div>
                  <span className="text-gray-500 text-sm font-light">per day · trip variations apply</span>
                </div>

                <h2 className="text-2xl font-serif text-white mb-1">Reserve This Vehicle</h2>
                <p className="text-gray-400 font-light text-sm mb-6">
                  Complete the form to secure <span className="text-primary font-mono">{vehicle.code}</span> for your journey.
                </p>

                <Button
                  onClick={() => window.open(`https://wa.me/992004044035?text=I'd like to book ${vehicle.code} — `, "_blank")}
                  className="w-full bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-none mb-6 py-3 text-sm tracking-wider uppercase transition-all duration-300"
                >
                  <MessageCircle className="w-4 h-4 mr-2" /> Book via WhatsApp
                </Button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-gray-600 text-xs uppercase tracking-wider">or fill the form</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {!isAvailable ? (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                      <Car className="w-7 h-7 text-amber-500" />
                    </div>
                    <h3 className="text-lg font-serif text-white mb-2">Currently Unavailable</h3>
                    <p className="text-gray-400 font-light text-sm mb-6">
                      This vehicle is <span className="text-amber-400">{vehicle.status}</span>. Contact us to check alternatives.
                    </p>
                    <Button onClick={() => window.open("https://wa.me/992004044035", "_blank")} className="w-full bg-transparent border border-primary text-primary hover:bg-primary hover:text-black transition-all duration-300 rounded-none">
                      <Phone className="w-4 h-4 mr-2" /> Inquire via WhatsApp
                    </Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField control={form.control} name="carType" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-400 font-light tracking-wide text-xs uppercase">Vehicle</FormLabel>
                          <FormControl>
                            <Input readOnly className="bg-primary/10 border-primary/30 text-primary focus:border-primary rounded-none font-mono text-sm" {...field} />
                          </FormControl>
                        </FormItem>
                      )} />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="fullName" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-400 font-light tracking-wide text-xs uppercase">Full Name</FormLabel>
                            <FormControl><Input placeholder="John Doe" className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none text-sm" {...field} /></FormControl>
                            <FormMessage className="text-red-400 text-xs" />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-400 font-light tracking-wide text-xs uppercase">Phone</FormLabel>
                            <FormControl><Input placeholder="+992 …" className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none text-sm" {...field} /></FormControl>
                            <FormMessage className="text-red-400 text-xs" />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="date" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-400 font-light tracking-wide text-xs uppercase">Date</FormLabel>
                            <FormControl><Input type="date" className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none [color-scheme:dark] text-sm" {...field} /></FormControl>
                            <FormMessage className="text-red-400 text-xs" />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="time" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-400 font-light tracking-wide text-xs uppercase">Time</FormLabel>
                            <FormControl><Input type="time" className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none [color-scheme:dark] text-sm" {...field} /></FormControl>
                            <FormMessage className="text-red-400 text-xs" />
                          </FormItem>
                        )} />
                      </div>

                      <FormField control={form.control} name="pickup" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-400 font-light tracking-wide text-xs uppercase">Pickup Location</FormLabel>
                          <FormControl><Input placeholder="e.g. Dushanbe Airport" className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none text-sm" {...field} /></FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="destination" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-400 font-light tracking-wide text-xs uppercase">Destination</FormLabel>
                          <FormControl><Input placeholder="e.g. Khujand" className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none text-sm" {...field} /></FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="passengers" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-400 font-light tracking-wide text-xs uppercase">Passengers</FormLabel>
                          <FormControl><Input type="number" min="1" max={vehicle.pax} className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none text-sm" {...field} /></FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="notes" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-400 font-light tracking-wide text-xs uppercase">Notes (Optional)</FormLabel>
                          <FormControl><Textarea placeholder="Special requests, flight number, etc." className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none min-h-[70px] text-sm" {...field} /></FormControl>
                        </FormItem>
                      )} />

                      <Button type="submit" disabled={createBooking.isPending} className="bg-primary hover:bg-primary/90 text-black w-full py-5 text-sm tracking-widest rounded-none uppercase font-medium mt-2">
                        {createBooking.isPending ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing…</>
                        ) : (
                          "Confirm Reservation"
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </div>
            </div>
          )}
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
              Thank you for choosing Pamir Luxe Drive. Your request for{" "}
              <span className="text-primary font-mono">{vehicle.code}</span> has been received. Our team will contact you shortly to confirm.
            </p>
            <Button onClick={() => setShowSuccess(false)} className="bg-transparent border border-primary text-primary hover:bg-primary hover:text-black rounded-none px-8 tracking-widest uppercase">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
