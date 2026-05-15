import { Router } from "express";
import { db } from "@workspace/db";
import { toursTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { CreateTourBody, UpdateTourBody } from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router = Router();

function serialize(t: typeof toursTable.$inferSelect) {
  return {
    ...t,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  };
}

router.get("/tours", async (_req, res) => {
  const rows = await db
    .select()
    .from(toursTable)
    .orderBy(asc(toursTable.sortOrder), asc(toursTable.id));
  res.json(rows.map(serialize));
});

router.get("/tours/by-slug/:slug", async (req, res) => {
  const slug = String(req.params.slug);
  const [row] = await db.select().from(toursTable).where(eq(toursTable.slug, slug));
  if (!row) {
    res.status(404).json({ error: "Tour not found" });
    return;
  }
  res.json(serialize(row));
});

router.post("/tours", requireAdmin, async (req, res) => {
  const parsed = CreateTourBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join("; ") });
    return;
  }
  try {
    const [row] = await db
      .insert(toursTable)
      .values({ ...parsed.data, updatedAt: new Date() })
      .returning();
    res.status(201).json(serialize(row));
  } catch (err) {
    req.log.error({ err }, "Failed to create tour");
    res.status(400).json({ error: "Failed to create tour (slug may already exist)" });
  }
});

router.put("/tours/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid tour ID" });
    return;
  }
  const parsed = UpdateTourBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join("; ") });
    return;
  }
  const [row] = await db
    .update(toursTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(toursTable.id, id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Tour not found" });
    return;
  }
  res.json(serialize(row));
});

router.delete("/tours/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid tour ID" });
    return;
  }
  const [row] = await db.delete(toursTable).where(eq(toursTable.id, id)).returning();
  if (!row) {
    res.status(404).json({ error: "Tour not found" });
    return;
  }
  res.status(204).end();
});

export default router;
