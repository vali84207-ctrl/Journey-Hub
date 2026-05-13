import { Router } from "express";
import { db } from "@workspace/db";
import { bookingsTable } from "@workspace/db";
import { CreateBookingBody } from "@workspace/api-zod";

const router = Router();

async function sendTelegramNotification(booking: {
  fullName: string;
  phone: string;
  pickup: string;
  destination: string;
  date: string;
  time: string;
  carType: string;
  passengers: number;
  notes?: string | null;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  // Support both TELEGRAM_CHAT_IDS (multi) and TELEGRAM_CHAT_ID (single) env var names
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
`🚖 NEW BOOKING — TAJIK ELITE

👤 Name: ${booking.fullName}
📞 Phone: ${booking.phone}
📍 Pickup: ${booking.pickup}
🏁 Destination: ${booking.destination}
📅 Date: ${booking.date}
⏰ Time: ${booking.time}
🚘 Vehicle: ${booking.carType}
👥 Passengers: ${booking.passengers}
📝 Notes: ${booking.notes || "—"}`;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const results = await Promise.allSettled(
    chatIds.map(async (chatId) => {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });
      const body = await resp.json() as { ok: boolean; description?: string };
      if (!body.ok) {
        throw new Error(`Telegram API error for ${chatId}: ${body.description}`);
      }
      return chatId;
    })
  );

  results.forEach((r) => {
    if (r.status === "rejected") {
      console.error("Telegram notification failed:", r.reason);
    }
  });
}

router.post("/bookings", async (req, res) => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid booking data" });
    return;
  }

  const data = parsed.data;

  const [inserted] = await db
    .insert(bookingsTable)
    .values({
      fullName: data.fullName,
      phone: data.phone,
      pickup: data.pickup,
      destination: data.destination,
      date: data.date,
      time: data.time,
      carType: data.carType,
      passengers: data.passengers,
      notes: data.notes ?? null,
    })
    .returning();

  sendTelegramNotification(data).catch(() => {});

  res.status(201).json({
    ...inserted,
    createdAt: inserted.createdAt.toISOString(),
  });
});

router.get("/bookings", async (_req, res) => {
  const bookings = await db
    .select()
    .from(bookingsTable)
    .orderBy(bookingsTable.createdAt);

  res.json(
    bookings.map((b) => ({
      ...b,
      createdAt: b.createdAt.toISOString(),
    }))
  );
});

export default router;
