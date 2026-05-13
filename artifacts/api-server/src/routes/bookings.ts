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
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return;
  }

  const message = `🚖 NEW BOOKING

👤 Name: ${booking.fullName}
📞 Phone: ${booking.phone}
📍 Pickup: ${booking.pickup}
📍 Destination: ${booking.destination}
📅 Date: ${booking.date}
⏰ Time: ${booking.time}
🚘 Car: ${booking.carType}
👥 Passengers: ${booking.passengers}
📝 Notes: ${booking.notes || "—"}`;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });
  } catch {
    // Non-critical — log silently
  }
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
