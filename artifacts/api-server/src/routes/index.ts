import { Router, type IRouter } from "express";
import healthRouter from "./health";
import bookingsRouter from "./bookings";
import vehiclesRouter from "./vehicles";
import blogRouter from "./blog";
import adminRouter from "./admin";
import { seedAll } from "./seed";

const router: IRouter = Router();

seedAll().catch((err) => console.error("Failed to seed:", err));

router.use(healthRouter);
router.use(bookingsRouter);
router.use(vehiclesRouter);
router.use(blogRouter);
router.use(adminRouter);

export default router;
