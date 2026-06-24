<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:uiux-promax-design-system -->
# UI/UX Design System: Dr.Thankappan's Dental Clinic

## Source of Truth
The persisted design system lives at:
`design-system/dr.thankappans-dental-clinic/MASTER.md`

## Quick Reference
- **Style:** Accessible & Ethical (WCAG AAA target, high contrast, large text)
- **Colors:** Navy primary (#0F172A), Blue accent (#0369A1), Slate neutrals
- **Typography:** Figtree (headings) + Noto Sans (body) — optimal for healthcare
- **Pattern:** Social Proof-Focused (Hero → Features → CTA)
- **Avoid:** Neon colors, motion-heavy animations, AI purple/pink gradients, emojis as icons

## Pre-Delivery Checklist (applied during design-system integration)
- [x] SVG icons (Lucide) used consistently — no emoji-as-icon
- [x] cursor-pointer on all native clickable elements (button, a, Link)
- [x] Hover states with smooth transitions (150-300ms via Tailwind transition-all)
- [x] prefers-reduced-motion respected (globals.css)
- [x] Responsive via fluid typography tokens (clamp) + Tailwind breakpoints
- [x] Focus rings visible for keyboard nav (2px teal outline)
- [x] Skip-to-content link in layout.tsx
- [ ] Light mode text contrast 4.5:1 minimum — slate-500 on white is ~4.3:1, bump small text to slate-600 on critical pages
- [ ] 44x44px touch targets on mobile (pointer: coarse media query in globals.css)
- [ ] No horizontal scroll / content hidden behind nav on mobile

## Build Status
- `npm run build` — PASSES (0 errors, 0 warnings)
<!-- END:uiux-promax-design-system -->

<!-- BEGIN:anchored-summary -->
# Session Summary — Dental Website Project

## What we've built
A complete Next.js 16 dental clinic website for Dr.Thankappan's Dental Clinic with:

### Public Pages
- **Home** — Hero with gradient + background image, stats bar (12+ years, 4.9★), service preview cards, doctor preview, testimonials carousel, CTA banner with WhatsApp, trust section, Google Maps embed
- **Services** — Grid of all services with hover effects, individual detail pages (/services/[slug]) with related services
- **Doctors** — Grid of all doctors, individual detail pages (/doctors/[slug])
- **About** — Clinic story, values, stats
- **Contact** — Contact info, embedded Google Map, WhatsApp CTA
- **Gallery** — Service-linked thumbnails
- **FAQ** — Split-pane layout (desktop) / accordion (mobile), search filter
- **Testimonials** — Patient testimonial cards
- **Book Appointment** — Multi-step form (treatment → date/time → patient info → review → confirm), confirmation page
- **Legal** — Privacy Policy, Terms of Service

### Admin Pages (Password-Protected)
- Dashboard with stats (appointments, patients, revenue)
- Appointments management with status badges, detail modals, WhatsApp confirm/reject
- Bookings management
- Patients directory
- Doctors CRUD
- Services CRUD
- Slots (time slot) management
- Content/Testimonials management
- Settings (booking toggle, etc.)
- Login page

### Design System
- **Teal palette** (teal-600 primary) with accessible tokens
- **Fluid typography** via `clamp()` (hero → fluid-sm)
- **Plus Jakarta Sans + Playfair Display** font pairing
- **Animations:** Framer Motion page transitions, stagger children, scroll-triggered reveals
- **Glassmorphism** nav on scroll, grain texture overlays
- **Components:** Button, Badge, Container, SectionHeader, SkipLink, SkipToContent, WhatsAppFab
- **accessibility:** prefers-reduced-motion, skip-to-content link, focus-visible rings, ARIA labels, semantic HTML
- **Responsive:** Desktop/tablet/mobile (mobile nav with bottom tab bar)

### Backend (Cloudflare Worker — Hono.js)
- **URL:** `https://dental-api.dr-thankappansdentalclinic.workers.dev`
- **Database:** D1 (`dental-clinic`), R2 bucket (`dental-clinic`), KV rate limit namespace
- **Auth:** Cookie-only JWT (`auth_token`, `SameSite=None; Secure; HttpOnly`) — login returns token in body for frontend domain cookie
- **Schema:** 12 tables — `admins`, `services`, `doctors`, `slots`, `appointments`, `doctor_unavailability`, `testimonials`, `faqs`, `settings`, `uploads`, `login_attempts`, `password_resets`
- **Atomic booking:** `UPDATE slots SET status='booked' WHERE status='available'` + check `meta.changes`
- **Soft-delete:** `deleted_at` on `doctors` and `services`
- **Rate limit:** 5 login attempts/IP/15min via KV
- **All routes implemented:** auth, appointments, slots, services, doctors, unavailability, settings, testimonials, FAQs, upload
- **Middleware:** JWT validation for all admin POST/PATCH/DELETE routes

## Frontend ↔ Backend Integration
- `src/lib/api.ts` — typed wrappers for all Worker API endpoints
- `src/lib/slot-engine.ts` — async Worker API adapter (no localStorage)
- `src/proxy.ts` — replaces `middleware.ts`, validates JWT via Worker `/auth/me` for `/admin/*` routes
- **All mockData eliminated** — 14 files converted to Worker API calls. `src/lib/mock-data.ts` deleted.
- **JWT handled cross-domain:** Vercel frontend (vercel.app) → Worker API (workers.dev) with `SameSite=None` cookies
- **WhatsApp messages:** Confirmation and rejection messages sent with clinic details + Google Maps link, emoji-free
- **Settings in D1:** `clinic_address`, `clinic_phone` (`+91 94471 21519`), `google_maps_link` populated

## Design System (Separate, Not Applied)
An alternative design system was generated by the ui-ux-pro-max skill and persisted to:
`design-system/dr.thankappans-dental-clinic/MASTER.md`

Navy + blue CTA, Figtree/Noto Sans — NOT applied to live codebase.

## Build Verification
- `npm run build` — PASSES (24 routes, 0 errors)
- `npx next lint` — PASSES (0 errors, 15 warnings — all pre-existing unused vars)
- `npx tsc --noEmit` (in `packages/api/`) — PASSES
- **Vercel deploy `d27f78d`** — READY and PROMOTED to production

## Latest Session (Jun 23 2026)
- **All pages now fetch from Worker API** — services list, detail, admin CRUD, BookingForm, ServicesPreview, Gallery all use `getServices()` from Worker. No more `mockData`.
- **`src/lib/mock-data.ts` deleted** — zero mock data in codebase.
- **`@aejkatappaja/phantom-ui` installed** — skeleton loading on 10 pages (services, doctors, contact, admin dashboard/appointments/bookings/patients/services/doctors/settings).
- **Lint errors fixed** — 18 errors: unescaped entities, set-state-in-effect, preserve-manual-memoization, immutability, no-img-element, unused imports/vars.
- **pnpm-lock.yaml fixed** — phantom-ui dependency correctly resolved.
- **Vercel fresh deploy** — empty commit `d27f78d` to bypass stale build cache. Live at `dr-thankappan-s-dental-clinic.vercel.app`.
- **Production serves 8 services** from D1 (matching seed data) — confirming Worker API integration works end-to-end.

## Latest Session (Jun 24 2026)

### Session 1 (earlier):
- **D1 was empty** — no tables existed. Re-applied `schema.sql` (24 queries, 12 tables).
- **All 9 services soft-deleted** — restored via `UPDATE services SET deleted_at = NULL, is_active = 1`. Set `sort_order = id`, updated short_desc.
- **Admin services page now shows error messages** — added `error` state + red alert in modal instead of silent close (`src/app/admin/services/page.tsx`).
- **Committed `657c4bd`** — pushed to GitHub (auto-deploy triggered, but deployment was **not promoted to production** — it built but wasn't aliased).

### Session 2 (current):
- **Bangalore→Kochi fix** — Changed description from "Expert dental care in Bangalore..." to "Your trusted dental clinic in kochi. A Family Tradition of Dental Excellence." in `layout.tsx` metadata. Fixed 3 other Bangalore references in `page.tsx` description, `about/page.tsx`, and `WhyChooseUs.tsx`. Committed as `ef5bc72` (together with D1 fixes).
- **Production still serving stale cache** — Vercel CDN `X-Vercel-Cache: HIT` serving old HTML with "Bangalore" metadata. The auto-deploy from `657c4bd` was never aliased to production domain. Latest deployment URL (`dr-thankappan-s-dental-clinic-4hab4y3u6.vercel.app`) has correct Kochi text.
- **Triggered new production deploy** via Vercel API (`POST /v13/deployments` with `target: "production"`). Deployment `dpl_HpzUDhsAesyn5CdBhx1VxowzcaHh` is building.
- **Root cause of "services not showing on client page"** — Not a code issue. Worker API returns all 9 services correctly (curl-verified). The problem was stale Vercel build cache + deployment not being aliased to production.
<!-- END:anchored-summary -->
