import { Router } from "express";
import { db } from "@workspace/db";
import { siteSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpdateSiteSettingsBody } from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router = Router();
const SINGLETON_ID = 1;

function serialize(s: typeof siteSettingsTable.$inferSelect) {
  return { ...s, updatedAt: s.updatedAt.toISOString() };
}

const DEFAULTS = {
  heroEyebrow: "Premium VIP Transportation — Tajikistan",
  heroTitleLine1: "Luxury Travel",
  heroTitleLine2: "In Tajikistan",
  heroSubtitle:
    "Premium transportation services for the most discerning travelers.",
  heroBackgroundImage: "/lc-hero.png",
  contactPhone: "+992 00 404 40 35",
  contactWhatsapp: "+992 00 404 40 35",
  contactTelegram: "@pamirluxedrive",
  contactEmail: "info@pamirluxedrive.com",
  contactAddress: "Rudaki Avenue, Dushanbe, Tajikistan",
  contactMapsUrl: "https://maps.google.com/?q=Dushanbe",
  footerTagline: "Premium ground transportation across Tajikistan.",
};

async function getOrCreate() {
  const existing = await db
    .select()
    .from(siteSettingsTable)
    .where(eq(siteSettingsTable.id, SINGLETON_ID))
    .limit(1);
  if (existing[0]) return existing[0];
  await db
    .insert(siteSettingsTable)
    .values({ id: SINGLETON_ID, ...DEFAULTS, updatedAt: new Date() })
    .onConflictDoNothing({ target: siteSettingsTable.id });
  const after = await db
    .select()
    .from(siteSettingsTable)
    .where(eq(siteSettingsTable.id, SINGLETON_ID))
    .limit(1);
  return after[0]!;
}

router.get("/site-settings", async (_req, res) => {
  const row = await getOrCreate();
  res.json(serialize(row));
});

router.put("/site-settings", requireAdmin, async (req, res) => {
  const parsed = UpdateSiteSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join("; ") });
    return;
  }
  const existing = await getOrCreate();
  const [row] = await db
    .update(siteSettingsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(siteSettingsTable.id, SINGLETON_ID))
    .returning();
  res.json(serialize(row ?? existing));
});

export default router;
