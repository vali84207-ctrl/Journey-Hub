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
import { useTranslation } from "react-i18next";
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

export function VehicleDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data: vehicles, isLoading } = useListVehicles();
  const vehicle = vehicles?.find((v) => v.id === Number(id));

  const [activeImg, setActiveImg] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"terms" | "policy" | "travel" | "contact">("terms");

  const createBooking = useCreateBooking();

  const formSchema = z.object({
    fullName: z.string().min(2, t("vehicleDetail.errors.nameMin")),
    phone: z.string().min(7, t("vehicleDetail.errors.phoneMin")),
    pickup: z.string().min(2, t("vehicleDetail.errors.pickupMin")),
    destination: z.string().min(2, t("vehicleDetail.errors.destMin")),
    date: z.string().min(1, t("vehicleDetail.errors.dateReq")),
    time: z.string().min(1, t("vehicleDetail.errors.timeReq")),
    carType: z.string().min(1, t("vehicleDetail.errors.carReq")),
    passengers: z.coerce.number().min(1).max(20),
    notes: z.string().optional(),
  });
  type FormValues = z.infer<typeof formSchema>;

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
        <h1 className="text-3xl font-serif text-primary mb-4">{t("vehicleDetail.notFoundTitle")}</h1>
        <Link href="/fleet" className="text-gray-400 hover:text-white underline cursor-pointer">
          {t("vehicleDetail.returnToFleet")}
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

  const statusLabel = vehicle.status === "available" ? t("fleet.status.available")
    : vehicle.status === "reserved" ? t("fleet.status.reserved")
    : vehicle.status === "busy" ? t("fleet.status.busy")
    : vehicle.status;

  const includedItems = [
    t("vehicleDetail.included.i1"),
    t("vehicleDetail.included.i2"),
    t("vehicleDetail.included.i3"),
    t("vehicleDetail.included.i4"),
    t("vehicleDetail.included.i5"),
    t("vehicleDetail.included.i6"),
  ];

  const termsSections = (["s1", "s2", "s3", "s4", "s5"] as const).map((k) => ({
    title: t(`vehicleDetail.terms.${k}.t`),
    body: t(`vehicleDetail.terms.${k}.b`),
  }));
  const policySections = (["s1", "s2", "s3", "s4", "s5"] as const).map((k) => ({
    title: t(`vehicleDetail.policy.${k}.t`),
    body: t(`vehicleDetail.policy.${k}.b`),
  }));
  const travelSections = (["s1", "s2", "s3", "s4"] as const).map((k, i) => ({
    icon: [MapPin, Clock, Shield, Star][i],
    title: t(`vehicleDetail.travel.${k}.t`),
    body: t(`vehicleDetail.travel.${k}.b`),
  }));

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-24">
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
            <ArrowLeft className="w-4 h-4" /> {t("vehicleDetail.backFleet")}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-10">
        <div className={`grid grid-cols-1 ${showBooking ? "lg:grid-cols-5" : ""} gap-12 lg:gap-16`}>
          <div className={showBooking ? "lg:col-span-3" : ""}>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="bg-black border border-white/20 px-3 py-1 text-sm font-mono tracking-wider">
                {vehicle.code}
              </span>
              <span className={`px-3 py-1 text-sm tracking-wider uppercase border ${STATUS_STYLES[vehicle.status] ?? STATUS_STYLES.busy}`}>
                {statusLabel}
              </span>
              <span className="text-gray-500 text-sm font-light">{vehicle.year}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">{displayName}</h1>
            <p className="text-gray-300 font-light leading-relaxed text-lg mb-10">{vehicle.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
              {[
                { icon: Users, label: t("vehicleDetail.stats.passengers", { count: vehicle.pax }) },
                { icon: Briefcase, label: t("vehicleDetail.stats.luggage") },
                { icon: Wind, label: t("vehicleDetail.stats.climate") },
                { icon: Wifi, label: t("vehicleDetail.stats.wifi") },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 bg-white/3 border border-white/5 p-4 text-center">
                  <Icon className="w-6 h-6 text-primary" />
                  <span className="text-xs text-gray-300 font-light">{label}</span>
                </div>
              ))}
            </div>

            {features.length > 0 && (
              <>
                <h3 className="text-xl font-serif text-white mb-5 border-b border-white/10 pb-4">{t("vehicleDetail.featuresIncl")}</h3>
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

            <h3 className="text-xl font-serif text-white mb-5 border-b border-white/10 pb-4">{t("vehicleDetail.includedTitle")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
              {includedItems.map((item) => (
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
              <span className="text-gray-400 text-sm font-light">{t("vehicleDetail.ratingNote")}</span>
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
                    {t(`vehicleDetail.tabs.${tab}`)}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "terms" && (
                  <motion.div key="terms" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5 text-gray-400 font-light leading-relaxed text-sm">
                    <h4 className="text-white font-serif text-lg">{t("vehicleDetail.terms.heading")}</h4>
                    <p>{t("vehicleDetail.terms.intro")}</p>
                    {termsSections.map(({ title, body }) => (
                      <div key={title}>
                        <h5 className="text-white text-sm font-medium mb-1">{title}</h5>
                        <p>{body}</p>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === "policy" && (
                  <motion.div key="policy" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5 text-gray-400 font-light leading-relaxed text-sm">
                    <h4 className="text-white font-serif text-lg">{t("vehicleDetail.policy.heading")}</h4>
                    {policySections.map(({ title, body }) => (
                      <div key={title} className="flex gap-3">
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
                    <h4 className="text-white font-serif text-lg">{t("vehicleDetail.travel.heading")}</h4>
                    <p>{t("vehicleDetail.travel.intro")}</p>
                    {travelSections.map(({ icon: Icon, title, body }) => (
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
                    <h4 className="text-white font-serif text-lg">{t("vehicleDetail.contact.heading")}</h4>
                    <p>{t("vehicleDetail.contact.intro")}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { icon: Phone, label: t("vehicleDetail.contact.labels.phone"), value: "+992 00 404 40 35" },
                        { icon: MessageCircle, label: t("vehicleDetail.contact.labels.telegram"), value: "@PamirLuxeDrive" },
                        { icon: MapPin, label: t("vehicleDetail.contact.labels.base"), value: t("vehicleDetail.contact.values.base") },
                        { icon: Clock, label: t("vehicleDetail.contact.labels.hours"), value: t("vehicleDetail.contact.values.hours") },
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
                        <MessageCircle className="w-4 h-4 mr-2" /> {t("vehicleDetail.contact.whatsapp")}
                      </Button>
                      <Button onClick={() => window.open("https://t.me/PamirLuxeDrive", "_blank")} className="bg-[#229ED9] hover:bg-[#1a8cc2] text-white rounded-none px-6 py-3 text-sm tracking-wider uppercase">
                        <Phone className="w-4 h-4 mr-2" /> {t("vehicleDetail.contact.telegramBtn")}
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
                  <span className="text-gray-500 uppercase tracking-widest text-xs">{t("vehicleDetail.sidebar.startingFrom")}</span>
                  <div className="text-5xl font-serif text-primary mt-1">${vehicle.pricePerDay}</div>
                  <span className="text-gray-500 text-sm font-light">{t("vehicleDetail.sidebar.perDayNote")}</span>
                </div>

                <h2 className="text-2xl font-serif text-white mb-1">{t("vehicleDetail.sidebar.reserveTitle")}</h2>
                <p className="text-gray-400 font-light text-sm mb-6">
                  {t("vehicleDetail.sidebar.reserveDesc")} <span className="text-primary font-mono">{vehicle.code}</span> {t("vehicleDetail.sidebar.reserveDescTail")}
                </p>

                <Button
                  onClick={() => window.open(`https://wa.me/992004044035?text=I'd like to book ${vehicle.code} — `, "_blank")}
                  className="w-full bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-none mb-6 py-3 text-sm tracking-wider uppercase transition-all duration-300"
                >
                  <MessageCircle className="w-4 h-4 mr-2" /> {t("vehicleDetail.sidebar.bookViaWhatsapp")}
                </Button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-gray-600 text-xs uppercase tracking-wider">{t("vehicleDetail.sidebar.orFillForm")}</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {!isAvailable ? (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                      <Car className="w-7 h-7 text-amber-500" />
                    </div>
                    <h3 className="text-lg font-serif text-white mb-2">{t("vehicleDetail.sidebar.currentlyUnavailable")}</h3>
                    <p className="text-gray-400 font-light text-sm mb-6">
                      {t("vehicleDetail.sidebar.unavailableBodyA")} <span className="text-amber-400">{statusLabel}</span>{t("vehicleDetail.sidebar.unavailableBodyB")}
                    </p>
                    <Button onClick={() => window.open("https://wa.me/992004044035", "_blank")} className="w-full bg-transparent border border-primary text-primary hover:bg-primary hover:text-black transition-all duration-300 rounded-none">
                      <Phone className="w-4 h-4 mr-2" /> {t("vehicleDetail.sidebar.inquireWhatsapp")}
                    </Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField control={form.control} name="carType" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-400 font-light tracking-wide text-xs uppercase">{t("vehicleDetail.form.vehicle")}</FormLabel>
                          <FormControl>
                            <Input readOnly className="bg-primary/10 border-primary/30 text-primary focus:border-primary rounded-none font-mono text-sm" {...field} />
                          </FormControl>
                        </FormItem>
                      )} />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="fullName" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-400 font-light tracking-wide text-xs uppercase">{t("vehicleDetail.form.fullName")}</FormLabel>
                            <FormControl><Input placeholder={t("vehicleDetail.form.fullNamePh")} className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none text-sm" {...field} /></FormControl>
                            <FormMessage className="text-red-400 text-xs" />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-400 font-light tracking-wide text-xs uppercase">{t("vehicleDetail.form.phone")}</FormLabel>
                            <FormControl><Input placeholder={t("vehicleDetail.form.phonePh")} className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none text-sm" {...field} /></FormControl>
                            <FormMessage className="text-red-400 text-xs" />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="date" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-400 font-light tracking-wide text-xs uppercase">{t("vehicleDetail.form.date")}</FormLabel>
                            <FormControl><Input type="date" className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none [color-scheme:dark] text-sm" {...field} /></FormControl>
                            <FormMessage className="text-red-400 text-xs" />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="time" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-400 font-light tracking-wide text-xs uppercase">{t("vehicleDetail.form.time")}</FormLabel>
                            <FormControl><Input type="time" className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none [color-scheme:dark] text-sm" {...field} /></FormControl>
                            <FormMessage className="text-red-400 text-xs" />
                          </FormItem>
                        )} />
                      </div>

                      <FormField control={form.control} name="pickup" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-400 font-light tracking-wide text-xs uppercase">{t("vehicleDetail.form.pickup")}</FormLabel>
                          <FormControl><Input placeholder={t("vehicleDetail.form.pickupPh")} className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none text-sm" {...field} /></FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="destination" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-400 font-light tracking-wide text-xs uppercase">{t("vehicleDetail.form.destination")}</FormLabel>
                          <FormControl><Input placeholder={t("vehicleDetail.form.destinationPh")} className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none text-sm" {...field} /></FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="passengers" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-400 font-light tracking-wide text-xs uppercase">{t("vehicleDetail.form.passengers")}</FormLabel>
                          <FormControl><Input type="number" min="1" max={vehicle.pax} className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none text-sm" {...field} /></FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="notes" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-400 font-light tracking-wide text-xs uppercase">{t("vehicleDetail.form.notes")}</FormLabel>
                          <FormControl><Textarea placeholder={t("vehicleDetail.form.notesPh")} className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none min-h-[70px] text-sm" {...field} /></FormControl>
                        </FormItem>
                      )} />

                      <Button type="submit" disabled={createBooking.isPending} className="bg-primary hover:bg-primary/90 text-black w-full py-5 text-sm tracking-widest rounded-none uppercase font-medium mt-2">
                        {createBooking.isPending ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("vehicleDetail.form.processing")}</>
                        ) : (
                          t("vehicleDetail.form.confirm")
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
            <h2 className="text-3xl font-serif text-white">{t("vehicleDetail.success.title")}</h2>
            <p className="text-gray-400 font-light text-lg">
              {t("vehicleDetail.success.bodyA")}{" "}
              <span className="text-primary font-mono">{vehicle.code}</span> {t("vehicleDetail.success.bodyB")}
            </p>
            <Button onClick={() => setShowSuccess(false)} className="bg-transparent border border-primary text-primary hover:bg-primary hover:text-black rounded-none px-8 tracking-widest uppercase">
              {t("vehicleDetail.success.close")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
