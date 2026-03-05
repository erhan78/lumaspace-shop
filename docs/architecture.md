# Architecture — LumaSpace

## Stack overview

| Layer     | Technology                                       |
| --------- | ------------------------------------------------ |
| Framework | Next.js 16 (App Router, React Server Components) |
| Language  | TypeScript 5 (strict mode)                       |
| Styling   | Tailwind CSS v4                                  |
| Runtime   | Node.js 22                                       |

---

## Database

**Technology:** PostgreSQL via [Prisma ORM](https://www.prisma.io/) (or Drizzle — TBD).

- Schema lives in `prisma/schema.prisma` (single source of truth).
- Migrations are committed to the repo (`prisma/migrations/`).
- Connection string is provided via `DATABASE_URL` in `.env`.
- In production: managed Postgres (Neon / Supabase / Railway).

### Core models (planned)

```
User → Session (NextAuth managed)
Product → ProductImage, ProductVariant
Order  → OrderItem
Cart   → CartItem
```

---

## Authentication

**Technology:** [Auth.js v5](https://authjs.dev/) (`next-auth` package, App Router edition).

- Configuration: `lib/auth.ts` (providers, callbacks, session strategy).
- Route handler: `app/api/auth/[...nextauth]/route.ts`.
- Session type is extended in `types/next-auth.d.ts`.
- Supported providers: Credentials, Google, GitHub (configured via `.env`).
- Protected routes use `auth()` middleware in `middleware.ts`.

---

## Payment

**Technology:** [Stripe](https://stripe.com/) — Checkout Sessions + Webhooks.

| Concern                 | Location                           |
| ----------------------- | ---------------------------------- |
| Create checkout session | `app/api/checkout/route.ts`        |
| Webhook handler         | `app/api/webhooks/stripe/route.ts` |
| Stripe client singleton | `lib/stripe.ts`                    |
| Product/price sync      | `lib/stripe-sync.ts` (optional)    |

Flow:

1. Client POSTs to `/api/checkout` → server creates a Stripe Checkout Session.
2. User completes payment on Stripe-hosted page.
3. Stripe fires `checkout.session.completed` webhook → order is created in DB.
4. Webhook signature is validated with `STRIPE_WEBHOOK_SECRET`.

---

## Cart

**Technology:** Server-side cart stored in the database, keyed by `userId` (authenticated) or a guest `cartId` cookie (anonymous).

| Concern               | Location                                            |
| --------------------- | --------------------------------------------------- |
| Cart state (server)   | `lib/cart.ts` (read/write via Prisma)               |
| Cart context (client) | `components/cart/cart-provider.tsx` (optimistic UI) |
| Add to cart action    | `app/actions/cart.ts` (Next.js Server Action)       |
| Cart drawer / page    | `app/(shop)/cart/page.tsx`                          |

Merge strategy: on login, guest cart items are merged into the user cart.

---

## Directory structure (target)

```
app/
  (shop)/          # storefront routes
  (dashboard)/     # vendor/admin routes
  api/             # route handlers
  actions/         # server actions
components/        # shared UI (shadcn/ui base)
lib/               # auth, db, stripe, utils
prisma/            # schema + migrations
types/             # global TypeScript declarations
docs/              # this file and testing.md
```
