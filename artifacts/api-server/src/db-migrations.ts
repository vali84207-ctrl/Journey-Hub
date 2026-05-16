import { db } from "@workspace/db";
import { sql } from "drizzle-orm";
import { logger } from "./lib/logger";

const COLUMNS_TO_ADD: ReadonlyArray<{ table: string; column: string; type: string; def: string }> = [
  { table: "vehicles", column: "name_i18n", type: "jsonb", def: "'{}'::jsonb" },
  { table: "vehicles", column: "model_i18n", type: "jsonb", def: "'{}'::jsonb" },
  { table: "vehicles", column: "type_i18n", type: "jsonb", def: "'{}'::jsonb" },
  { table: "vehicles", column: "description_i18n", type: "jsonb", def: "'{}'::jsonb" },

  { table: "tours", column: "title_i18n", type: "jsonb", def: "'{}'::jsonb" },
  { table: "tours", column: "short_description_i18n", type: "jsonb", def: "'{}'::jsonb" },
  { table: "tours", column: "description_i18n", type: "jsonb", def: "'{}'::jsonb" },
  { table: "tours", column: "duration_i18n", type: "jsonb", def: "'{}'::jsonb" },
  { table: "tours", column: "route_i18n", type: "jsonb", def: "'{}'::jsonb" },
  { table: "tours", column: "group_size", type: "text", def: "''" },
  { table: "tours", column: "group_size_i18n", type: "jsonb", def: "'{}'::jsonb" },
  { table: "tours", column: "departures", type: "jsonb", def: "'[]'::jsonb" },
  { table: "tours", column: "reviews", type: "jsonb", def: "'[]'::jsonb" },
  { table: "tours", column: "faq", type: "jsonb", def: "'[]'::jsonb" },

  { table: "blog_posts", column: "title_i18n", type: "jsonb", def: "'{}'::jsonb" },
  { table: "blog_posts", column: "excerpt_i18n", type: "jsonb", def: "'{}'::jsonb" },
  { table: "blog_posts", column: "location_i18n", type: "jsonb", def: "'{}'::jsonb" },
  { table: "blog_posts", column: "read_time_i18n", type: "jsonb", def: "'{}'::jsonb" },
  { table: "blog_posts", column: "author_i18n", type: "jsonb", def: "'{}'::jsonb" },
  { table: "blog_posts", column: "category_i18n", type: "jsonb", def: "'{}'::jsonb" },
];

const SITE_SETTINGS_DDL = `
CREATE TABLE IF NOT EXISTS site_settings (
  id serial PRIMARY KEY,
  hero_eyebrow text NOT NULL DEFAULT '',
  hero_eyebrow_i18n jsonb NOT NULL DEFAULT '{}'::jsonb,
  hero_title_line1 text NOT NULL DEFAULT '',
  hero_title_line1_i18n jsonb NOT NULL DEFAULT '{}'::jsonb,
  hero_title_line2 text NOT NULL DEFAULT '',
  hero_title_line2_i18n jsonb NOT NULL DEFAULT '{}'::jsonb,
  hero_subtitle text NOT NULL DEFAULT '',
  hero_subtitle_i18n jsonb NOT NULL DEFAULT '{}'::jsonb,
  hero_background_image text NOT NULL DEFAULT '',
  contact_phone text NOT NULL DEFAULT '',
  contact_whatsapp text NOT NULL DEFAULT '',
  contact_telegram text NOT NULL DEFAULT '',
  contact_email text NOT NULL DEFAULT '',
  contact_address text NOT NULL DEFAULT '',
  contact_address_i18n jsonb NOT NULL DEFAULT '{}'::jsonb,
  contact_maps_url text NOT NULL DEFAULT '',
  footer_tagline text NOT NULL DEFAULT '',
  footer_tagline_i18n jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp NOT NULL DEFAULT NOW()
)
`;

export async function runMigrations(): Promise<void> {
  try {
    await db.execute(sql.raw(SITE_SETTINGS_DDL));
    for (const c of COLUMNS_TO_ADD) {
      await db.execute(
        sql.raw(
          `ALTER TABLE ${c.table} ADD COLUMN IF NOT EXISTS ${c.column} ${c.type} NOT NULL DEFAULT ${c.def}`,
        ),
      );
    }
    logger.info("DB migrations applied (idempotent)");
  } catch (err) {
    logger.error({ err }, "Migration failure");
    throw err;
  }
}
