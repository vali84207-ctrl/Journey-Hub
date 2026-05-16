import { db } from "@workspace/db";
import { toursTable, type TourDeparture } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

const HORIZON_DAYS = 30;
const DEFAULT_SEATS = 8;
const FALLBACK_DURATION_DAYS = 3;

function parseDurationDays(duration: string): number {
  const m = duration.match(/(\d+)/);
  return m && m[1] ? parseInt(m[1], 10) : 0;
}

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

/**
 * Generate back-to-back N-day slots between [today, horizonEnd) that don't
 * overlap any existing departure. If a candidate window [cursor, cursor+N-1]
 * intersects an existing departure, jump the cursor past that departure's end
 * instead of producing an overlapping slot.
 */
function generateBackToBackSlots(
  today: Date,
  horizonEnd: Date,
  slotLength: number,
  existing: TourDeparture[],
  price: number,
): TourDeparture[] {
  const intervals = existing
    .filter((d) => !!d.startDate)
    .map((d) => {
      const start = new Date(`${d.startDate}T00:00:00Z`);
      const endStr = d.endDate || d.startDate;
      const end = new Date(`${endStr}T00:00:00Z`);
      return { start, end };
    })
    .filter((iv) => !Number.isNaN(iv.start.getTime()) && !Number.isNaN(iv.end.getTime()))
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  // Start the cursor at today, but if today already falls inside an existing
  // departure, skip past the end of that one.
  let cursor = today;
  for (const iv of intervals) {
    if (iv.start <= cursor && cursor <= iv.end) {
      cursor = addDays(iv.end, 1);
    }
  }

  const additions: TourDeparture[] = [];
  let safety = 0;
  while (cursor < horizonEnd && safety++ < 1000) {
    const candidateEnd = addDays(cursor, slotLength - 1);
    // Find the first existing interval that overlaps [cursor, candidateEnd].
    const conflict = intervals.find(
      (iv) => iv.start <= candidateEnd && iv.end >= cursor,
    );
    if (conflict) {
      cursor = addDays(conflict.end, 1);
      continue;
    }
    additions.push({
      id: newDepartureId(),
      startDate: toIsoDate(cursor),
      endDate: toIsoDate(candidateEnd),
      seats: DEFAULT_SEATS,
      price,
      status: "available",
    });
    cursor = addDays(cursor, slotLength);
  }
  return additions;
}

function newDepartureId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `dep-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Ensure each non-hidden tour has back-to-back departures covering at least
 * HORIZON_DAYS into the future. Existing departures (manual or generated) are
 * never overwritten — we only append new ones whose start date is not already
 * occupied. This is safe to call repeatedly.
 */
export async function ensureUpcomingDepartures(): Promise<{ generated: number }> {
  const tours = await db.select().from(toursTable);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const horizonEnd = addDays(today, HORIZON_DAYS);
  let generated = 0;

  for (const tour of tours) {
    if (tour.hidden) continue;
    const slotLength =
      tour.durationDays > 0
        ? tour.durationDays
        : parseDurationDays(tour.duration) || FALLBACK_DURATION_DAYS;
    if (slotLength <= 0) continue;

    const existing = [...tour.departures].sort((a, b) =>
      (a.startDate || "").localeCompare(b.startDate || ""),
    );

    const additions = generateBackToBackSlots(
      today,
      horizonEnd,
      slotLength,
      existing,
      tour.startingPrice,
    );

    if (additions.length > 0) {
      const merged = [...existing, ...additions].sort((a, b) =>
        (a.startDate || "").localeCompare(b.startDate || ""),
      );
      await db
        .update(toursTable)
        .set({ departures: merged, updatedAt: new Date() })
        .where(eq(toursTable.id, tour.id));
      generated += additions.length;
      logger.info(
        { tourId: tour.id, slug: tour.slug, added: additions.length },
        "Auto-generated tour departures",
      );
    }
  }

  return { generated };
}

/**
 * Auto-generate for a single tour (used by the admin "regenerate" button).
 * Same idempotency rules as ensureUpcomingDepartures.
 */
export async function ensureUpcomingDeparturesForTour(tourId: number) {
  const [tour] = await db.select().from(toursTable).where(eq(toursTable.id, tourId));
  if (!tour) return null;

  const slotLength =
    tour.durationDays > 0
      ? tour.durationDays
      : parseDurationDays(tour.duration) || FALLBACK_DURATION_DAYS;
  if (slotLength <= 0) return tour;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const horizonEnd = addDays(today, HORIZON_DAYS);
  const existing = [...tour.departures].sort((a, b) =>
    (a.startDate || "").localeCompare(b.startDate || ""),
  );

  const additions = generateBackToBackSlots(
    today,
    horizonEnd,
    slotLength,
    existing,
    tour.startingPrice,
  );

  if (additions.length === 0) return tour;
  const merged = [...existing, ...additions].sort((a, b) =>
    (a.startDate || "").localeCompare(b.startDate || ""),
  );
  const [updated] = await db
    .update(toursTable)
    .set({ departures: merged, updatedAt: new Date() })
    .where(eq(toursTable.id, tourId))
    .returning();
  return updated ?? tour;
}
