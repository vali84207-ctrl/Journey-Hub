import app from "./app";
import { logger } from "./lib/logger";
import { ensureUpcomingDepartures } from "./lib/auto-departures";
import { bootDbSetup } from "./routes";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function scheduleDepartureAutoGen() {
  bootDbSetup
    .then(() => ensureUpcomingDepartures())
    .then(({ generated }) => {
      logger.info({ generated }, "Initial tour departure auto-gen complete");
    })
    .catch((err) => {
      logger.error({ err }, "Initial tour departure auto-gen failed");
    });

  setInterval(() => {
    ensureUpcomingDepartures()
      .then(({ generated }) => {
        if (generated > 0) {
          logger.info({ generated }, "Scheduled tour departure auto-gen complete");
        }
      })
      .catch((err) => {
        logger.error({ err }, "Scheduled tour departure auto-gen failed");
      });
  }, ONE_DAY_MS).unref();
}

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
  scheduleDepartureAutoGen();
});
