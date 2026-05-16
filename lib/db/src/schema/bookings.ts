import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  pickup: text("pickup").notNull(),
  destination: text("destination").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  carType: text("car_type").notNull(),
  passengers: integer("passengers").notNull(),
  notes: text("notes"),
  tourSlug: text("tour_slug"),
  tourTitle: text("tour_title"),
  departureId: text("departure_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, createdAt: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;
