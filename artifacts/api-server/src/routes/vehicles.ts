import { Router } from "express";
import { db } from "@workspace/db";
import { vehiclesTable, vehicleStatusEnum } from "@workspace/db";
import { eq } from "drizzle-orm";
const router = Router();

const SEED_VEHICLES = [
  { code: "LC300-01", model: "Toyota Land Cruiser 300", type: "LC300" },
  { code: "LC300-02", model: "Toyota Land Cruiser 300", type: "LC300" },
  { code: "LC300-03", model: "Toyota Land Cruiser 300", type: "LC300" },
  { code: "LC-PRADO-01", model: "Toyota Land Cruiser Prado", type: "LC-PRADO" },
  { code: "LC-PRADO-02", model: "Toyota Land Cruiser Prado", type: "LC-PRADO" },
  { code: "LC-PRADO-03", model: "Toyota Land Cruiser Prado", type: "LC-PRADO" },
];

export async function seedVehicles() {
  for (const v of SEED_VEHICLES) {
    await db
      .insert(vehiclesTable)
      .values({ code: v.code, model: v.model, type: v.type, status: "available" })
      .onConflictDoNothing();
  }
}

function serializeVehicle(v: typeof vehiclesTable.$inferSelect) {
  return { ...v, updatedAt: v.updatedAt.toISOString() };
}

router.get("/vehicles", async (_req, res) => {
  const vehicles = await db.select().from(vehiclesTable).orderBy(vehiclesTable.id);
  res.json(vehicles.map(serializeVehicle));
});

router.patch("/vehicles/:id/status", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid vehicle ID" });
    return;
  }

  const { status } = req.body as { status?: string };
  if (!status || !vehicleStatusEnum.includes(status as (typeof vehicleStatusEnum)[number])) {
    res.status(400).json({ error: "Invalid status value" });
    return;
  }

  const validStatus = status as (typeof vehicleStatusEnum)[number];

  const [updated] = await db
    .update(vehiclesTable)
    .set({ status: validStatus, updatedAt: new Date() })
    .where(eq(vehiclesTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Vehicle not found" });
    return;
  }

  res.json(serializeVehicle(updated));
});

export default router;
