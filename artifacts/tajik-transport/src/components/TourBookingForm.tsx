import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { useCreateTourBooking } from "@workspace/api-client-react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
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

export function TourBookingForm({
  tourSlug,
  tourTitle,
}: {
  tourSlug: string;
  tourTitle: string;
}) {
  const { t } = useTranslation();
  const createTourBooking = useCreateTourBooking();
  const [showSuccess, setShowSuccess] = useState(false);

  const formSchema = z.object({
    fullName: z.string().min(2, t("tourBooking.errors.nameMin")),
    phone: z.string().min(5, t("tourBooking.errors.phoneMin")),
    passengers: z.coerce.number().min(1, t("tourBooking.errors.passengersMin")).max(40),
    date: z.string().min(1, t("tourBooking.errors.dateReq")),
    pickup: z.string().min(2, t("tourBooking.errors.pickupMin")),
    notes: z.string().optional(),
  });
  type Values = z.infer<typeof formSchema>;

  const form = useForm<Values>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      passengers: 2,
      date: "",
      pickup: "",
      notes: "",
    },
  });

  function onSubmit(values: Values) {
    createTourBooking.mutate(
      { data: { ...values, tourSlug, tourTitle } },
      {
        onSuccess: () => {
          setShowSuccess(true);
          form.reset({
            fullName: "",
            phone: "",
            passengers: 2,
            date: "",
            pickup: "",
            notes: "",
          });
          setTimeout(() => setShowSuccess(false), 6000);
        },
      },
    );
  }

  const inputCls =
    "bg-black/50 border-white/10 text-white focus:border-primary rounded-none text-sm";
  const labelCls =
    "text-gray-400 font-light tracking-wide text-xs uppercase";

  return (
    <section
      id="tour-booking"
      className="bg-[#0a0a0a] border border-primary/20 p-6 md:p-10"
    >
      <div className="mb-7">
        <p className="text-primary uppercase tracking-[0.3em] text-[10px] mb-2">
          {t("tourBooking.eyebrow")}
        </p>
        <h2 className="text-2xl md:text-3xl font-serif text-white mb-1">
          {t("tourBooking.title")}
        </h2>
        <p className="text-gray-400 font-light text-sm">
          {t("tourBooking.subtitle", { tour: tourTitle })}
        </p>
      </div>

      {showSuccess && (
        <div className="mb-6 flex items-start gap-3 px-4 py-3 border border-green-500/30 bg-green-500/10 text-green-300">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium">{t("tourBooking.successTitle")}</div>
            <div className="text-green-400/80 mt-0.5">
              {t("tourBooking.successBody")}
            </div>
          </div>
        </div>
      )}

      {createTourBooking.isError && (
        <div className="mb-6 px-4 py-3 border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
          {t("tourBooking.errorBody")}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>
                    {t("tourBooking.fields.fullName")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("tourBooking.fields.fullNamePh")}
                      className={inputCls}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>
                    {t("tourBooking.fields.phone")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("tourBooking.fields.phonePh")}
                      className={inputCls}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passengers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>
                    {t("tourBooking.fields.passengers")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="40"
                      className={inputCls}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>
                    {t("tourBooking.fields.date")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className={`${inputCls} [color-scheme:dark]`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="pickup"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelCls}>
                  {t("tourBooking.fields.pickup")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("tourBooking.fields.pickupPh")}
                    className={inputCls}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelCls}>
                  {t("tourBooking.fields.notes")}
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder={t("tourBooking.fields.notesPh")}
                    className={inputCls}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              disabled={createTourBooking.isPending}
              className="bg-primary hover:bg-primary/90 text-black rounded-none px-8 py-3 text-xs tracking-[0.2em] uppercase font-medium disabled:opacity-50"
            >
              {createTourBooking.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("tourBooking.submitting")}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {t("tourBooking.submit")}
                </>
              )}
            </Button>
            <span className="text-gray-500 text-xs font-light">
              {t("tourBooking.replyNote")}
            </span>
          </div>
        </form>
      </Form>
    </section>
  );
}
