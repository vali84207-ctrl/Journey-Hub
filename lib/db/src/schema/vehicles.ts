import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const vehicleStatusEnum = ["available", "reserved", "busy"] as const;
export type VehicleStatus = (typeof vehicleStatusEnum)[number];

export const vehiclesTable = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  model: text("model").notNull(),
  type: text("type").notNull(),
  status: text("status").$type<VehicleStatus>().notNull().default("available"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Vehicle = typeof vehiclesTable.$inferSelect;
