import { pgTable, serial, text, integer, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";

export type TourHighlight = { title: string; body: string };
export type TourItineraryDay = { day: number; title: string; body: string };

export const toursTable = pgTable("tours", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  shortDescription: text("short_description").notNull().default(""),
  description: text("description").notNull().default(""),
  duration: text("duration").notNull().default(""),
  startingPrice: integer("starting_price").notNull().default(0),
  route: text("route").notNull().default(""),
  mainImage: text("main_image").notNull().default(""),
  gallery: jsonb("gallery").$type<string[]>().notNull().default([]),
  highlights: jsonb("highlights").$type<TourHighlight[]>().notNull().default([]),
  itinerary: jsonb("itinerary").$type<TourItineraryDay[]>().notNull().default([]),
  included: jsonb("included").$type<string[]>().notNull().default([]),
  featured: boolean("featured").notNull().default(true),
  hidden: boolean("hidden").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Tour = typeof toursTable.$inferSelect;
export type InsertTour = typeof toursTable.$inferInsert;
