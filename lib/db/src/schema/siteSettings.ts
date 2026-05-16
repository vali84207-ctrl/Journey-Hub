import { pgTable, serial, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import type { LangMap } from "../i18n";

export const siteSettingsTable = pgTable("site_settings", {
  id: serial("id").primaryKey(),

  heroEyebrow: text("hero_eyebrow").notNull().default(""),
  heroEyebrowI18n: jsonb("hero_eyebrow_i18n").$type<LangMap>().notNull().default({}),
  heroTitleLine1: text("hero_title_line1").notNull().default(""),
  heroTitleLine1I18n: jsonb("hero_title_line1_i18n").$type<LangMap>().notNull().default({}),
  heroTitleLine2: text("hero_title_line2").notNull().default(""),
  heroTitleLine2I18n: jsonb("hero_title_line2_i18n").$type<LangMap>().notNull().default({}),
  heroSubtitle: text("hero_subtitle").notNull().default(""),
  heroSubtitleI18n: jsonb("hero_subtitle_i18n").$type<LangMap>().notNull().default({}),
  heroBackgroundImage: text("hero_background_image").notNull().default(""),

  contactPhone: text("contact_phone").notNull().default(""),
  contactWhatsapp: text("contact_whatsapp").notNull().default(""),
  contactTelegram: text("contact_telegram").notNull().default(""),
  contactEmail: text("contact_email").notNull().default(""),
  contactAddress: text("contact_address").notNull().default(""),
  contactAddressI18n: jsonb("contact_address_i18n").$type<LangMap>().notNull().default({}),
  contactMapsUrl: text("contact_maps_url").notNull().default(""),

  footerTagline: text("footer_tagline").notNull().default(""),
  footerTaglineI18n: jsonb("footer_tagline_i18n").$type<LangMap>().notNull().default({}),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type SiteSettings = typeof siteSettingsTable.$inferSelect;
export type InsertSiteSettings = typeof siteSettingsTable.$inferInsert;
