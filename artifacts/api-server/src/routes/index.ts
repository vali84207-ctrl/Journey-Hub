import { Router, type IRouter } from "express";
import healthRouter from "./health";
import bookingsRouter from "./bookings";
import vehiclesRouter from "./vehicles";
import blogRouter from "./blog";
import toursRouter from "./tours";
import tourBookingsRouter from "./tour-bookings";
import storageRouter from "./storage";
import siteSettingsRouter from "./site-settings";
import adminRouter from "./admin";
import { seedAll } from "./seed";
import { runMigrations } from "../db-migrations";
import { logger } from "../lib/logger";

const router: IRouter = Router();

export const bootDbSetup: Promise<void> = (async () => {
  try {
    await runMigrations();
    await seedAll();
  } catch (err) {
    logger.error({ err }, "Boot DB setup failed");
  }
})();

router.use(healthRouter);
router.use(bookingsRouter);
router.use(vehiclesRouter);
router.use(blogRouter);
router.use(toursRouter);
router.use(tourBookingsRouter);
router.use(storageRouter);
router.use(siteSettingsRouter);
router.use(adminRouter);

export default router;
