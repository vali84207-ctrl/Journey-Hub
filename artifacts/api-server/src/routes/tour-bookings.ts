import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { bookingsTable, toursTable } from "@workspace/db";
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

  const [tour] = await db
    .select({ slug: toursTable.slug, title: toursTable.title, hidden: toursTable.hidden })
    .from(toursTable)
    .where(eq(toursTable.slug, data.tourSlug))
    .limit(1);

  if (!tour || tour.hidden) {
    res.status(400).json({ error: "Unknown or unavailable tour" });
    return;
  }

  const [inserted] = await db
    .insert(bookingsTable)
    .values({
      fullName: data.fullName,
      phone: data.phone,
      pickup: data.pickup,
      destination: tour.title,
      date: data.date,
      time: "—",
      carType: "TOUR",
      passengers: data.passengers,
      notes: data.notes ?? null,
      tourSlug: tour.slug,
      tourTitle: tour.title,
    })
    .returning();

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
