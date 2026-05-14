import { pgTable, serial, text, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";

export type BlogContentBlock = {
  type: "paragraph" | "heading" | "quote" | "image";
  text?: string;
  src?: string;
  caption?: string;
};

export const blogPostsTable = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  cover: text("cover").notNull(),
  gallery: jsonb("gallery").$type<string[]>().notNull().default([]),
  location: text("location").notNull().default(""),
  date: text("date").notNull(),
  readTime: text("read_time").notNull().default("5 min read"),
  author: text("author").notNull().default("Pamir Luxe Editorial"),
  category: text("category").notNull().default("Mountain Journeys"),
  content: jsonb("content").$type<BlogContentBlock[]>().notNull().default([]),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type BlogPost = typeof blogPostsTable.$inferSelect;
export type InsertBlogPost = typeof blogPostsTable.$inferInsert;
