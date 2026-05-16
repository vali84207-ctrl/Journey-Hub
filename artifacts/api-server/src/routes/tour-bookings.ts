import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { bookingsTable, toursTable, type TourDeparture } from "@workspace/db";
import { CreateTourBookingBody } from "@workspace/api-zod";

const router = Router();

async function sendTourTelegramNotification(b: {
  tourTitle: string;
  tourSlug: string;
  fullName: string;
  phone: string;
  passengers: number;
  date: string;
  pickup: string;
  notes?: string | null;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIdsRaw =
    process.env.TELEGRAM_CHAT_IDS || process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatIdsRaw) {
    return;
  }

  const chatIds = chatIdsRaw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const message =
`🗺️ NEW TOUR REQUEST — PAMIR LUXE DRIVE

🌄 Tour: ${b.tourTitle}
🔖 Slug: ${b.tourSlug}

👤 Name: ${b.fullName}
📞 Phone: ${b.phone}
👥 Travelers: ${b.passengers}
📅 Preferred date: ${b.date}
📍 Pickup: ${b.pickup}
📝 Notes: ${b.notes || "—"}`;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const results = await Promise.allSettled(
    chatIds.map(async (chatId) => {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: message }),
      });
      const body = (await resp.json()) as { ok: boolean; description?: string };
      if (!body.ok) {
        throw new Error(`Telegram API error for ${chatId}: ${body.description}`);
      }
      return chatId;
    }),
  );

  results.forEach((r) => {
    if (r.status === "rejected") {
      console.error("Telegram tour notification failed:", r.reason);
    }
  });
}

router.post("/tour-bookings", async (req, res) => {
  const parsed = CreateTourBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: parsed.error.issues.map((i) => i.message).join("; "),
    });
    return;
  }
  const data = parsed.data;

  // Lock the tour row, mutate its departures, and insert the booking inside a
  // single transaction so concurrent bookings can't both decrement the same
  // seat count.
  type TxResult =
    | { ok: true; tourTitle: string; tourSlug: string; booking: typeof bookingsTable.$inferSelect; bookedDeparture: TourDeparture | null }
    | { ok: false; status: number; error: string };

  const result: TxResult = await db.transaction(async (tx) => {
    const [tour] = await tx
      .select()
      .from(toursTable)
      .where(eq(toursTable.slug, data.tourSlug))
      .for("update")
      .limit(1);

    if (!tour || tour.hidden) {
      return { ok: false, status: 400, error: "Unknown or unavailable tour" };
    }

    let bookedDeparture: TourDeparture | null = null;
    if (data.departureId) {
      const idx = tour.departures.findIndex((d) => d.id === data.departureId);
      if (idx === -1) {
        return { ok: false, status: 400, error: "Selected departure not found" };
      }
      const dep = tour.departures[idx]!;
      if (dep.status === "soldout" || dep.seats <= 0) {
        return { ok: false, status: 409, error: "Selected departure is sold out" };
      }
      if (dep.seats < data.passengers) {
        return {
          ok: false,
          status: 409,
          error: `Only ${dep.seats} seat(s) remaining on this departure`,
        };
      }
      const remaining = dep.seats - data.passengers;
      let nextStatus: TourDeparture["status"];
      if (remaining <= 0) nextStatus = "soldout";
      else if (remaining <= 2) nextStatus = "limited";
      else nextStatus = dep.status;
      const updatedDep: TourDeparture = {
        ...dep,
        seats: remaining,
        status: nextStatus,
      };
      const updatedDepartures = [...tour.departures];
      updatedDepartures[idx] = updatedDep;
      await tx
        .update(toursTable)
        .set({ departures: updatedDepartures, updatedAt: new Date() })
        .where(eq(toursTable.id, tour.id));
      bookedDeparture = updatedDep;
    }

    const [booking] = await tx
      .insert(bookingsTable)
      .values({
        fullName: data.fullName,
        phone: data.phone,
        pickup: data.pickup,
        destination: tour.title,
        date: bookedDeparture?.startDate ?? data.date,
        time: "—",
        carType: "TOUR",
        passengers: data.passengers,
        notes: data.notes ?? null,
        tourSlug: tour.slug,
        tourTitle: tour.title,
        departureId: data.departureId ?? null,
      })
      .returning();

    return {
      ok: true,
      tourTitle: tour.title,
      tourSlug: tour.slug,
      booking: booking!,
      bookedDeparture,
    };
  });

  if (!result.ok) {
    res.status(result.status).json({ error: result.error });
    return;
  }

  const inserted = result.booking;
  const tour = { title: result.tourTitle, slug: result.tourSlug };

  sendTourTelegramNotification({
    tourTitle: tour.title,
    tourSlug: tour.slug,
    fullName: data.fullName,
    phone: data.phone,
    passengers: data.passengers,
    date: data.date,
    pickup: data.pickup,
    notes: data.notes,
  }).catch(() => {});

  res.status(201).json({
    ...inserted,
    createdAt: inserted.createdAt.toISOString(),
  });
});

export default router;
