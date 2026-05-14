# Pamir Luxe Drive — VIP Transportation Website

A luxury ground transportation booking website for Tajikistan, styled after Blacklane and premium Dubai transport companies. Brand: Pamir Luxe Drive.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — API server (port 8080)
- `pnpm --filter @workspace/tajik-transport run dev` — frontend (port 18455)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks/Zod from OpenAPI
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET`
- Optional env: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind + Framer Motion + Wouter + react-hook-form + Zod
- API: Express 5, JWT-style admin tokens (issued by `/api/admin/login`)
- DB: PostgreSQL + Drizzle ORM
- API codegen: Orval → React Query hooks + Zod schemas

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/db/src/schema/` — `bookings`, `vehicles`, `blogPosts` schemas
- `artifacts/api-server/src/routes/{bookings,vehicles,blog,admin,seed}.ts`
- `artifacts/api-server/src/middlewares/requireAdmin.ts` — Bearer-token guard
- `artifacts/tajik-transport/src/pages/` — public + `admin/` sub-pages
- `artifacts/tajik-transport/src/components/admin/AdminLayout.tsx` — sidebar shell + ConfirmDialog + ModalShell

## Architecture decisions

- Single public landing page with `/fleet`, `/fleet/:id`, `/blog`, `/blog/:slug` sub-pages
- Telegram notification on booking is fire-and-forget (non-blocking)
- Dark mode only — fixed luxury black/gold palette
- Admin uses bearer token in localStorage via `lib/adminAuth.ts` and `setAuthTokenGetter`
- All admin write endpoints (vehicles/blog CRUD) and `GET /bookings` require admin token
- Public `GET /vehicles` and `GET /blog` return everything; the frontend hides
  `status === "hidden"` vehicles and `published === false` posts
- Seed data: `seed.ts` runs at boot — only inserts new rows; existing rows are not overwritten

## Admin Panel

Routes (all behind `ProtectedRoute` → `/admin/login` if no valid token):
- `/admin` — dashboard with fleet/blog/booking counts
- `/admin/fleet` — Land Cruiser CRUD: code, model, year, pax, price, description, features, main image URL, gallery URLs (one per line), bookingVisible toggle, status (Available / Reserved / Busy / Hidden), sortOrder
- `/admin/blog` — blog CRUD with a content-block editor (paragraph / heading / quote / image), gallery URLs, published toggle
- `/admin/bookings` — read-only booking requests table

All image inputs are URL-only (no file upload). Use Unsplash / CDN / `/lc-hero.png`.

## Product

- Hero section with cinematic luxury car background
- Services grid (Airport, VIP, Business, Tourism, Wedding, Chauffeur)
- Fleet showcase reading from `/api/vehicles` (status badges, click-through to detail)
- Booking form → PostgreSQL + Telegram notification
- Reviews, FAQ, Contact (WhatsApp / Telegram / Maps), Footer
- Blog journal driven by `/api/blog`

## User preferences

- Brand name: Pamir Luxe Drive
- Colors: deep black, charcoal, gold (#C9A84C / #D4AF37), white text
- Fonts: Playfair Display (headings) + Inter (body)

## i18n (Multilingual Frontend)

- Public site supports EN (default), RU, TJ, UZ via `react-i18next` + `i18next-browser-languagedetector`
- Setup: `src/i18n/index.ts`, locales in `src/i18n/locales/{en,ru,tj,uz}.ts`
- Persisted in `localStorage` under key `pld_lang`
- Language switcher: `src/components/LanguageSwitcher.tsx` — desktop dropdown + mobile 4-button grid in Navbar
- Translation keys are flat-namespaced objects: `t("vehicleDetail.terms.s1.t")`, with interpolation `t("vehicleDetail.stats.passengers", { count: vehicle.pax })`
- `en.ts` is the source-of-truth shape; `ru/tj/uz` typed as `typeof en` so missing keys cause TS errors
- Admin panel, vehicle/blog DB content, brand name, phone, social handles are intentionally NOT translated
- Zod error messages are built inside component bodies so they re-translate on language change

## Gotchas

- After any OpenAPI spec change, run codegen then `pnpm run typecheck:libs` before typechecking the api-server
- Vehicle/blog seed only inserts missing rows (idempotent). To force-update, delete the row first
- `wouter` base is `import.meta.env.BASE_URL.replace(/\/$/, "")` so the site works under any path prefix

## Pointers

- See the `pnpm-workspace` skill for workspace structure & TS setup
