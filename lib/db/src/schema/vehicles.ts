import { pgTable, serial, text, integer, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
import type { LangMap, LocalizedString } from "../i18n";

export const vehicleStatusEnum = ["available", "reserved", "busy", "hidden"] as const;
export type VehicleStatus = (typeof vehicleStatusEnum)[number];

export const vehiclesTable = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull().default(""),
  nameI18n: jsonb("name_i18n").$type<LangMap>().notNull().default({}),
  model: text("model").notNull(),
  modelI18n: jsonb("model_i18n").$type<LangMap>().notNull().default({}),
  year: integer("year").notNull().default(2024),
  type: text("type").notNull(),
  typeI18n: jsonb("type_i18n").$type<LangMap>().notNull().default({}),
  pax: integer("pax").notNull().default(7),
  pricePerDay: integer("price_per_day").notNull().default(100),
  description: text("description").notNull().default(""),
  descriptionI18n: jsonb("description_i18n").$type<LangMap>().notNull().default({}),
  features: jsonb("features").$type<LocalizedString[]>().notNull().default([]),
  mainImage: text("main_image").notNull().default(""),
  gallery: jsonb("gallery").$type<string[]>().notNull().default([]),
  bookingVisible: boolean("booking_visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  status: text("status").$type<VehicleStatus>().notNull().default("available"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Vehicle = typeof vehiclesTable.$inferSelect;
export type InsertVehicle = typeof vehiclesTable.$inferInsert;
