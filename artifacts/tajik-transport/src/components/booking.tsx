import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCreateBooking } from "@workspace/api-client-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CAR_TYPES = [
  "Mercedes S-Class",
  "Toyota Land Cruiser",
  "Lexus LX570",
  "BMW 7 Series",
  "Hyundai Staria",
  "Chevrolet Tahoe",
];

export function Booking() {
  const { t } = useTranslation();
  const [successOpen, setSuccessOpen] = useState(false);
  const createBooking = useCreateBooking();

  const formSchema = z.object({
    fullName: z.string().min(2, t("booking.errors.nameMin")),
    phone: z.string().min(7, t("booking.errors.phoneMin")),
    pickup: z.string().min(2, t("booking.errors.pickupMin")),
    destination: z.string().min(2, t("booking.errors.destMin")),
    date: z.string().min(1, t("booking.errors.dateReq")),
    time: z.string().min(1, t("booking.errors.timeReq")),
    carType: z.string().min(1, t("booking.errors.carReq")),
    passengers: z.coerce.number().min(1).max(20),
    notes: z.string().optional().nullable(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      pickup: "",
      destination: "",
      date: "",
      time: "",
      carType: "",
      passengers: 1,
      notes: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    createBooking.mutate(
      { data },
      {
        onSuccess: () => {
          setSuccessOpen(true);
          form.reset();
        },
      }
    );
  };

  return (
    <section id="booking" className="py-32 relative bg-background">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">{t("booking.title")}</h2>
          <p className="text-white/60 font-light max-w-2xl mx-auto">
            {t("booking.subtitle")}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-panel p-8 md:p-12 relative"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80 uppercase text-xs tracking-widest">{t("booking.fields.fullName")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("booking.fields.fullNamePh")} className="bg-white/5 border-white/10 rounded-none h-12 text-white placeholder:text-white/30 focus-visible:ring-primary focus-visible:border-primary" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80 uppercase text-xs tracking-widest">{t("booking.fields.phone")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("booking.fields.phonePh")} className="bg-white/5 border-white/10 rounded-none h-12 text-white placeholder:text-white/30 focus-visible:ring-primary focus-visible:border-primary" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pickup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80 uppercase text-xs tracking-widest">{t("booking.fields.pickup")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("booking.fields.pickupPh")} className="bg-white/5 border-white/10 rounded-none h-12 text-white placeholder:text-white/30 focus-visible:ring-primary focus-visible:border-primary" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80 uppercase text-xs tracking-widest">{t("booking.fields.destination")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("booking.fields.destinationPh")} className="bg-white/5 border-white/10 rounded-none h-12 text-white placeholder:text-white/30 focus-visible:ring-primary focus-visible:border-primary" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80 uppercase text-xs tracking-widest">{t("booking.fields.date")}</FormLabel>
                      <FormControl>
                        <Input type="date" className="bg-white/5 border-white/10 rounded-none h-12 text-white placeholder:text-white/30 focus-visible:ring-primary focus-visible:border-primary [color-scheme:dark]" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80 uppercase text-xs tracking-widest">{t("booking.fields.time")}</FormLabel>
                      <FormControl>
                        <Input type="time" className="bg-white/5 border-white/10 rounded-none h-12 text-white placeholder:text-white/30 focus-visible:ring-primary focus-visible:border-primary [color-scheme:dark]" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="carType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80 uppercase text-xs tracking-widest">{t("booking.fields.vehicleClass")}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/5 border-white/10 rounded-none h-12 text-white focus:ring-primary">
                            <SelectValue placeholder={t("booking.fields.vehiclePlaceholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card border-white/10 text-white rounded-none">
                          {CAR_TYPES.map(car => (
                            <SelectItem key={car} value={car} className="focus:bg-primary/20 focus:text-primary rounded-none">
                              {car}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passengers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80 uppercase text-xs tracking-widest">{t("booking.fields.passengers")}</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={20} className="bg-white/5 border-white/10 rounded-none h-12 text-white placeholder:text-white/30 focus-visible:ring-primary focus-visible:border-primary" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80 uppercase text-xs tracking-widest">{t("booking.fields.notes")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("booking.fields.notesPh")}
                        className="bg-white/5 border-white/10 rounded-none min-h-[100px] text-white placeholder:text-white/30 focus-visible:ring-primary focus-visible:border-primary"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={createBooking.isPending}
                className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold tracking-widest uppercase text-sm rounded-none border border-primary hover:gold-glow transition-all"
              >
                {createBooking.isPending ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t("booking.submitting")}</>
                ) : (
                  t("booking.submit")
                )}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="bg-card border border-white/10 rounded-none sm:max-w-md p-8">
          <DialogHeader className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-serif text-white">{t("booking.success.title")}</DialogTitle>
            <DialogDescription className="text-base text-white/60 font-light">
              {t("booking.success.body")}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => setSuccessOpen(false)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-8 font-semibold tracking-wider uppercase text-xs"
            >
              {t("booking.success.close")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
