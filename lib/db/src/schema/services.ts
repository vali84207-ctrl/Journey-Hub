import { pgTable, serial, text, integer, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
import type { LangMap, LocalizedString } from "../i18n";

export const servicesTable = pgTable("services", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  iconName: text("icon_name").notNull().default("Sparkles"),
  image: text("image").notNull().default(""),
  title: text("title").notNull(),
  titleI18n: jsonb("title_i18n").$type<LangMap>().notNull().default({}),
  shortDescription: text("short_description").notNull().default(""),
  shortDescriptionI18n: jsonb("short_description_i18n").$type<LangMap>().notNull().default({}),
  description: text("description").notNull().default(""),
  descriptionI18n: jsonb("description_i18n").$type<LangMap>().notNull().default({}),
  bullets: jsonb("bullets").$type<LocalizedString[]>().notNull().default([]),
  isVisaSupport: boolean("is_visa_support").notNull().default(false),
  hidden: boolean("hidden").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Service = typeof servicesTable.$inferSelect;
export type InsertService = typeof servicesTable.$inferInsert;
