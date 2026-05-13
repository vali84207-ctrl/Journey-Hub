# Tajik Elite — Premium Transportation Website

A luxury ground transportation booking website for Tajikistan, styled after Blacklane and premium Dubai transport companies.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/tajik-transport run dev` — run the frontend (port 18455)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + Framer Motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/db/src/schema/bookings.ts` — Bookings table schema
- `artifacts/api-server/src/routes/bookings.ts` — Booking API + Telegram notification
- `artifacts/tajik-transport/src/` — Frontend (single-page, all sections in App.tsx)

## Architecture decisions

- Single-page layout (no multi-page routing) — all sections in one scrollable page
- Telegram notification is fire-and-forget (non-blocking) — booking saves even if Telegram fails
- Dark mode only — no light/dark toggle; the luxury brand demands a fixed dark palette
- Booking form uses react-hook-form + zod with Orval-generated mutation hook

## Product

- Hero section with cinematic luxury car background
- Services grid (Airport, VIP, Business, Tourism, Wedding, Chauffeur)
- Car fleet showcase (6 vehicles with photos, pax count, pricing)
- Booking form that saves to PostgreSQL and sends Telegram notification
- Customer reviews section
- FAQ accordion
- Contact section with WhatsApp, Telegram, Instagram, Maps
- Footer with nav links

## User preferences

- Brand name: TAJIK ELITE
- Colors: deep black, charcoal, gold (#C9A84C / #D4AF37), white text
- Fonts: Playfair Display (headings) + Inter (body)

## Gotchas

- After any OpenAPI spec change, run codegen then `pnpm run typecheck:libs` before typechecking the API server
- TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are stored as shared env vars

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
