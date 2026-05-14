import { Router } from "express";
import { db } from "@workspace/db";
import { vehiclesTable, vehicleStatusEnum } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { CreateVehicleBody, UpdateVehicleBody, UpdateVehicleStatusBody } from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router = Router();

function serialize(v: typeof vehiclesTable.$inferSelect) {
  return {
    ...v,
    createdAt: v.createdAt.toISOString(),
    updatedAt: v.updatedAt.toISOString(),
  };
}

router.get("/vehicles", async (_req, res) => {
  const rows = await db
    .select()
    .from(vehiclesTable)
    .orderBy(asc(vehiclesTable.sortOrder), asc(vehiclesTable.id));
  res.json(rows.map(serialize));
});

router.get("/vehicles/:id", async (req, res) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid vehicle ID" });
    return;
  }
  const [row] = await db.select().from(vehiclesTable).where(eq(vehiclesTable.id, id));
  if (!row) {
    res.status(404).json({ error: "Vehicle not found" });
    return;
  }
  res.json(serialize(row));
});

router.post("/vehicles", requireAdmin, async (req, res) => {
  const parsed = CreateVehicleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join("; ") });
    return;
  }
  try {
    const [row] = await db
      .insert(vehiclesTable)
      .values({
        ...parsed.data,
        updatedAt: new Date(),
      })
      .returning();
    res.status(201).json(serialize(row));
  } catch (err) {
    req.log.error({ err }, "Failed to create vehicle");
    res.status(400).json({ error: "Failed to create vehicle (code may already exist)" });
  }
});

router.put("/vehicles/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid vehicle ID" });
    return;
  }
  const parsed = UpdateVehicleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join("; ") });
    return;
  }
  const [row] = await db
    .update(vehiclesTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(vehiclesTable.id, id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Vehicle not found" });
    return;
  }
  res.json(serialize(row));
});

router.delete("/vehicles/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid vehicle ID" });
    return;
  }
  const [row] = await db
    .delete(vehiclesTable)
    .where(eq(vehiclesTable.id, id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Vehicle not found" });
    return;
  }
  res.status(204).end();
});

router.patch("/vehicles/:id/status", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid vehicle ID" });
    return;
  }
  const parsed = UpdateVehicleStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid status value" });
    return;
  }
  const status = parsed.data.status as (typeof vehicleStatusEnum)[number];
  const [row] = await db
    .update(vehiclesTable)
    .set({ status, updatedAt: new Date() })
    .where(eq(vehiclesTable.id, id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Vehicle not found" });
    return;
  }
  res.json(serialize(row));
});

export default router;
