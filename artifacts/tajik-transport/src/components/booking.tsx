import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { useCreateBooking } from "@workspace/api-client-react";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  pickup: z.string().min(2, "Pickup location is required"),
  destination: z.string().min(2, "Destination is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  carType: z.string().min(1, "Please select a car type"),
  passengers: z.coerce.number().min(1).max(20),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function Booking() {
  const [showSuccess, setShowSuccess] = useState(false);
  const createBooking = useCreateBooking();

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

  function onSubmit(values: FormValues) {
    createBooking.mutate(
      { data: values },
      {
        onSuccess: () => {
          setShowSuccess(true);
          form.reset();
        },
      }
    );
  }

  return (
    <section id="booking" className="py-24 bg-black relative">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-white mb-4"
          >
            Reserve Your Journey
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[2px] bg-primary mx-auto"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-panel p-8 md:p-12 rounded-sm border border-primary/20"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 font-light tracking-wide">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none" {...field} />
                      </FormControl>
                      <FormMessage className="text-destructive/80" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 font-light tracking-wide">Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+992 XXX XX XX XX" className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none" {...field} />
                      </FormControl>
                      <FormMessage className="text-destructive/80" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pickup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 font-light tracking-wide">Pickup Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Dushanbe International Airport" className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none" {...field} />
                      </FormControl>
                      <FormMessage className="text-destructive/80" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 font-light tracking-wide">Destination</FormLabel>
                      <FormControl>
                        <Input placeholder="Serena Hotel Dushanbe" className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none" {...field} />
                      </FormControl>
                      <FormMessage className="text-destructive/80" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 font-light tracking-wide">Date</FormLabel>
                      <FormControl>
                        <Input type="date" className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none [color-scheme:dark]" {...field} />
                      </FormControl>
                      <FormMessage className="text-destructive/80" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 font-light tracking-wide">Time</FormLabel>
                      <FormControl>
                        <Input type="time" className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none [color-scheme:dark]" {...field} />
                      </FormControl>
                      <FormMessage className="text-destructive/80" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="carType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 font-light tracking-wide">Vehicle Class</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none">
                            <SelectValue placeholder="Select vehicle..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-black border-white/10 text-white">
                          <SelectItem value="Mercedes S-Class">Mercedes S-Class</SelectItem>
                          <SelectItem value="Toyota Land Cruiser">Toyota Land Cruiser</SelectItem>
                          <SelectItem value="Lexus LX570">Lexus LX570</SelectItem>
                          <SelectItem value="BMW 7 Series">BMW 7 Series</SelectItem>
                          <SelectItem value="Hyundai Staria">Hyundai Staria</SelectItem>
                          <SelectItem value="Chevrolet Tahoe">Chevrolet Tahoe</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-destructive/80" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passengers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 font-light tracking-wide">Passengers</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="20" className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none" {...field} />
                      </FormControl>
                      <FormMessage className="text-destructive/80" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 font-light tracking-wide">Special Requests (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any special requirements..." 
                        className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-destructive/80" />
                  </FormItem>
                )}
              />

              <div className="pt-4 flex justify-center">
                <Button 
                  type="submit" 
                  disabled={createBooking.isPending}
                  className="bg-primary hover:bg-primary/90 text-black px-12 py-6 text-lg tracking-widest rounded-none min-w-[250px]"
                >
                  {createBooking.isPending ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> PROCESSING</>
                  ) : (
                    "RESERVE NOW"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="bg-black border border-primary/30 text-white sm:max-w-md p-10 outline-none">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-serif text-white">Booking Received</h2>
            <p className="text-gray-400 font-light text-lg">
              Thank you for choosing Tajik Elite. Our team will contact you shortly to confirm your reservation details.
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
    </section>
  );
}
