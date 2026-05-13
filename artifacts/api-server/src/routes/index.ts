import { Router, type IRouter } from "express";
import healthRouter from "./health";
import bookingsRouter from "./bookings";
import vehiclesRouter, { seedVehicles } from "./vehicles";
import adminRouter from "./admin";

const router: IRouter = Router();

seedVehicles().catch((err) => console.error("Failed to seed vehicles:", err));

router.use(healthRouter);
router.use(bookingsRouter);
router.use(vehiclesRouter);
router.use(adminRouter);

export default router;
