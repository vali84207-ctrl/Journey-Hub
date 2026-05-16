import { Router } from "express";
import { db, servicesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { CreateServiceBody, UpdateServiceBody } from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router = Router();

function serialize(s: typeof servicesTable.$inferSelect) {
  return {
    ...s,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  };
}

router.get("/services", async (_req, res) => {
  const rows = await db
    .select()
    .from(servicesTable)
    .orderBy(asc(servicesTable.sortOrder), asc(servicesTable.id));
  res.json(rows.map(serialize));
});

router.get("/services/by-slug/:slug", async (req, res) => {
  const slug = String(req.params.slug);
  const [row] = await db.select().from(servicesTable).where(eq(servicesTable.slug, slug));
  if (!row) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  res.json(serialize(row));
});

router.post("/services", requireAdmin, async (req, res) => {
  const parsed = CreateServiceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join("; ") });
    return;
  }
  try {
    const [row] = await db
      .insert(servicesTable)
      .values({ ...parsed.data, updatedAt: new Date() })
      .returning();
    res.status(201).json(serialize(row));
  } catch (err) {
    req.log.error({ err }, "Failed to create service");
    res.status(400).json({ error: "Failed to create service (slug may already exist)" });
  }
});

router.put("/services/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid service ID" });
    return;
  }
  const parsed = UpdateServiceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join("; ") });
    return;
  }
  const [row] = await db
    .update(servicesTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(servicesTable.id, id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  res.json(serialize(row));
});

router.delete("/services/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid service ID" });
    return;
  }
  const [row] = await db.delete(servicesTable).where(eq(servicesTable.id, id)).returning();
  if (!row) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  res.status(204).end();
});

export default router;
