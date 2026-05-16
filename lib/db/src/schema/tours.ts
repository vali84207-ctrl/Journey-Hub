import { pgTable, serial, text, integer, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
import type { LangMap, LocalizedString } from "../i18n";

export type TourHighlight = { title: LocalizedString; body: LocalizedString };

export type TourItineraryDay = {
  day: number;
  title: LocalizedString;
  body: LocalizedString;
  locations?: LocalizedString[];
  activities?: LocalizedString[];
  overnightLocation?: LocalizedString;
  images?: string[];
};

export const toursTable = pgTable("tours", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  titleI18n: jsonb("title_i18n").$type<LangMap>().notNull().default({}),
  shortDescription: text("short_description").notNull().default(""),
  shortDescriptionI18n: jsonb("short_description_i18n").$type<LangMap>().notNull().default({}),
  description: text("description").notNull().default(""),
  descriptionI18n: jsonb("description_i18n").$type<LangMap>().notNull().default({}),
  duration: text("duration").notNull().default(""),
  durationI18n: jsonb("duration_i18n").$type<LangMap>().notNull().default({}),
  startingPrice: integer("starting_price").notNull().default(0),
  route: text("route").notNull().default(""),
  routeI18n: jsonb("route_i18n").$type<LangMap>().notNull().default({}),
  mainImage: text("main_image").notNull().default(""),
  gallery: jsonb("gallery").$type<string[]>().notNull().default([]),
  highlights: jsonb("highlights").$type<TourHighlight[]>().notNull().default([]),
  itinerary: jsonb("itinerary").$type<TourItineraryDay[]>().notNull().default([]),
  included: jsonb("included").$type<LocalizedString[]>().notNull().default([]),
  featured: boolean("featured").notNull().default(true),
  hidden: boolean("hidden").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Tour = typeof toursTable.$inferSelect;
export type InsertTour = typeof toursTable.$inferInsert;
