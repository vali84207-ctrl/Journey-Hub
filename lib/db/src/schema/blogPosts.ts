import { pgTable, serial, text, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
import type { LangMap, LocalizedString } from "../i18n";

export type BlogContentBlock = {
  type: "paragraph" | "heading" | "quote" | "image";
  text?: LocalizedString;
  src?: string;
  caption?: LocalizedString;
};

export const blogPostsTable = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  titleI18n: jsonb("title_i18n").$type<LangMap>().notNull().default({}),
  excerpt: text("excerpt").notNull(),
  excerptI18n: jsonb("excerpt_i18n").$type<LangMap>().notNull().default({}),
  cover: text("cover").notNull(),
  gallery: jsonb("gallery").$type<string[]>().notNull().default([]),
  location: text("location").notNull().default(""),
  locationI18n: jsonb("location_i18n").$type<LangMap>().notNull().default({}),
  date: text("date").notNull(),
  readTime: text("read_time").notNull().default("5 min read"),
  readTimeI18n: jsonb("read_time_i18n").$type<LangMap>().notNull().default({}),
  author: text("author").notNull().default("Pamir Luxe Editorial"),
  authorI18n: jsonb("author_i18n").$type<LangMap>().notNull().default({}),
  category: text("category").notNull().default("Mountain Journeys"),
  categoryI18n: jsonb("category_i18n").$type<LangMap>().notNull().default({}),
  content: jsonb("content").$type<BlogContentBlock[]>().notNull().default([]),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type BlogPost = typeof blogPostsTable.$inferSelect;
export type InsertBlogPost = typeof blogPostsTable.$inferInsert;
