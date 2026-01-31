# AI Finance Platform(https://ai-finance-platform-gray.vercel.app/)

A personal finance web app built with Next.js, Tailwind CSS and Prisma. It provides account and budget tracking, transaction management with receipt scanning, a dashboard overview, and authentication flows with server-side actions for seeding and background processing.

**Status:** Active development

**Live demo / deploy:** Not included (use `npm run dev` to run locally)

**Table of contents**
- **Project Overview:** high-level purpose and goals
- **Features:** user-visible features and where they live in the codebase
- **Tech Stack:** libraries, runtimes and infra used
- **Getting started:** install and run locally
- **Project structure:** important files and folders with pointers
- **Notes:** database, seeding, background jobs

**Project Overview**

This repository implements an opinionated personal finance manager with a modern React/Next.js frontend, server-side actions and API routes, Prisma ORM for structured data, and some integrations (receipt scanning UI, background functions via Inngest). It targets users who want to track accounts, budgets, and transactions and analyze simple trends.

**Features**
- **Authentication:** sign-up and sign-in flows under the auth app routes. See [app/(auth)/sign-in/[[...sign-in]]/page.jsx](app/(auth)/sign-in/[[...sign-in]]/page.jsx) and [app/(auth)/sign-up/[[...sign-up]]/page.jsx](app/(auth)/sign-up/[[...-sign-up]]/page.jsx).
- **Dashboard:** overview cards, budget progress and recent transactions are displayed on the dashboard. Key UI components: [app/(main)/dashboard/_components/account-card.jsx](app/(main)/dashboard/_components/account-card.jsx) and [app/(main)/dashboard/_components/transaction-overview.jsx](app/(main)/dashboard/_components/transaction-overview.jsx).
- **Accounts:** account detail pages and charts live in [app/(main)/account/[id]/page.jsx](app/(main)/account/[id]/page.jsx) and use `account-chart.jsx` for visuals.
- **Transactions:** full create/edit flow, transaction tables and a receipt scanner UI. See [app/(main)/transaction/create/page.jsx](app/(main)/transaction/create/page.jsx) and components in [app/(main)/transaction/_components](app/(main)/transaction/_components).
- **Receipt scanner (UI):** a client-side component to assist scanning receipts and quickly creating transactions: [app/(main)/transaction/_components/recipt-scanner.jsx](app/(main)/transaction/_components/recipt-scanner.jsx).
- **Server actions & automation:** business logic, seeding and background functions are in `actions/` and `app/api/` routes. See [actions/seed.js](actions/seed.js) and [app/api/inngest/route.js](app/api/inngest/route.js).
- **Email templates:** transactional email templates live in `emails/` (for notifications or receipts): [emails/template.jsx](emails/template.jsx).

**Tech Stack**
- **Framework:** Next.js (App Router) — server components and routing (see `app/`)
- **UI:** React + Tailwind CSS; components and UI primitives under `components/` and `components/ui/`
- **State & hooks:** small custom hooks in `hooks/` (e.g., `use-fetch.js`)
- **Database / ORM:** Prisma with schema in `prisma/schema.prisma` and migrations in `prisma/migrations` (Postgres or compatible SQL DB expected)
- **Background functions / Jobs:** Inngest integration under `lib/inngest/` and `app/api/inngest/route.js`
- **Utilities:** helper libs in `lib/` (e.g., `lib/prisma.js`, `lib/utils.js`, `lib/arcjet.js`)
- **Build & tooling:** Node.js, npm, PostCSS, Tailwind, and standard Next tooling (see `package.json`)

**Getting started (local)**
1. Copy or create your `.env` with required variables (DATABASE_URL, NEXTAUTH_URL, etc.).
2. Install dependencies:

```bash
npm install
```

3. Apply migrations and optionally seed the DB:

```bash
npx prisma migrate deploy
node ./actions/seed.js    # or run the provided seed route
```

4. Run the development server:

```bash
npm run dev
```

**Project structure (key files)**
- **app/**: Next.js App Router routes and UI. See `app/page.js` for home and `app/(main)` for authenticated views.
- **components/**: Reusable UI components and primitives (buttons, inputs, table, drawer, sonner, etc.).
- **actions/**: Server-side actions and tasks (`account.js`, `transaction.js`, `seed.js`, etc.).
- **lib/**: helpers, `prisma.js` (Prisma client), Inngest helpers and other utilities.
- **prisma/**: schema and migrations for the app database.
- **emails/**: JSX templates used for transactional emails.

# AI Finance Platform

**AI Finance Platform** is a personal finance web application built with Next.js, Tailwind CSS, and Prisma. It provides account and budget tracking, transaction management (including a receipt-scanner UI), a dashboard with insights, authentication flows, background jobs, and seeding utilities.

**Status:** Active development

**Table of contents**
- **Project:** short description and goals
- **Features:** user-facing features and where to find them
- **Tech Stack:** core technologies and libraries
- **Quick Start:** install, run, and database steps
- **Project Structure:** important files and pointers
- **Migrations & Seeding:** Prisma and seed utilities
- **Deployment:** notes for production
- **Contributing & Next Steps**

**Project**

This repository implements a modern single-tenant personal finance manager with server and client components via the Next.js App Router. It focuses on core financial workflows: accounts, transactions, budgets, and a simple receipt scanning UI for fast data entry.

**Features**
- **Authentication:** Sign-in and sign-up routes under the auth app routes. See [app/(auth)](app/(auth)).
- **Dashboard:** Overview cards, budget progress and recent transactions. See [app/(main)/dashboard](app/(main)/dashboard).
- **Accounts:** Account list and individual account pages with charts. See [app/(main)/account](app/(main)/account).
- **Transactions:** Create/edit transactions, paginated tables and CSV-style exports (components under [app/(main)/transaction/_components](app/(main)/transaction/_components)).
- **Receipt scanner UI:** Client-side helper to scan receipts and create transactions quickly ([app/(main)/transaction/_components/recipt-scanner.jsx](app/(main)/transaction/_components/recipt-scanner.jsx)).
- **Budgets:** Track budget progress and visualize usage ([app/(main)/dashboard/_components/budget-progress.jsx](app/(main)/dashboard/_components/budget-progress.jsx)).
- **Server Actions & API Routes:** Business logic is organized in `actions/` and API routes under `app/api/` (e.g., seed and scan endpoints).
- **Background Jobs:** Inngest integration for async/background workflows (see `lib/inngest/` and [app/api/inngest/route.js](app/api/inngest/route.js)).
- **Email Templates:** JSX email templates in `emails/` for transactional notifications.

**Tech Stack**
- **Framework:** Next.js (App Router) — server components and file-based routing in `app/`.
- **Language:** JavaScript (React + JSX).
- **Styling:** Tailwind CSS and PostCSS.
- **ORM:** Prisma (schema in [prisma/schema.prisma](prisma/schema.prisma), migrations in [prisma/migrations](prisma/migrations)).
- **Background Jobs:** Inngest (helpers under `lib/inngest`).
- **Utilities & Helpers:** `lib/prisma.js`, `lib/utils.js`, and `lib/arcjet.js`.
- **UI primitives:** Local component library in `components/ui/` (buttons, inputs, table, drawer, sonner, etc.).

**Quick Start (local development)**
1. Copy `.env.example` to `.env` (create one if missing) and set required variables (at minimum `DATABASE_URL` and any auth/provider keys you plan to use).

2. Install dependencies:

```bash
npm install
```

3. Prepare the database (Prisma):

```bash
# create or update migrations locally
npx prisma migrate dev --name init

# (optional) generate prisma client
npx prisma generate
```

4. Seed sample data (optional):

```bash
# Run the seed script if present
node actions/seed.js
# or call the seed API route: POST /api/seed
```

5. Run the dev server:

```bash
npm run dev
```

6. Open http://localhost:3000

Common scripts are defined in [package.json](package.json).

**Project Structure (high level)**
- **app/**: Next.js App Router pages and layouts. Entry points and nested routes live here (public and authenticated views are separated into route groups).
- **components/**: Reusable UI and small presentational components. See `components/ui/` for primitives.
- **actions/**: Server-side actions for accounts, transactions, seeding and other business logic.
- **lib/**: Helpers and integrations (Prisma client, Inngest helpers, utility functions).
- **prisma/**: Prisma schema and migrations. Use Prisma CLI to manage schema changes.
- **emails/**: JSX templates for transactional emails.

Key files and references:
- `app/page.js` — landing/home page
- `app/(auth)` — auth routes and layouts
- `app/(main)` — main application routes (dashboard, account, transaction)
- `actions/seed.js` — data seeding script
- `lib/prisma.js` — Prisma client setup
- `prisma/schema.prisma` — DB schema

**Migrations & Seeding**
- Use Prisma to create and apply migrations: `npx prisma migrate dev` for local development.
- Review `prisma/migrations/` before applying in production.
- Use `actions/seed.js` or the API seed route at [app/api/seed/route.js](app/api/seed/route.js) to populate demo data.

**Environment variables**
Create a `.env` at the project root with at least the database connection. Typical variables you may need:

```env
DATABASE_URL=
NEXTAUTH_URL=
# Any provider keys (Clerk, Resend, ArcJet, Gemini, etc.) used by the app
```

Check the repository for any `.env.example` or comments that list additional variables.

**Deployment**
- The app is ready for deployment on Vercel (recommended) or another Node host supporting Next.js.
- In production, run `npm run build` and `npm start` (or let Vercel handle the build).
- Ensure `DATABASE_URL` and any provider keys are configured in your host environment.

**Developer notes & tips**
- Tailwind config: `tailwind.config.js` and PostCSS config: `postcss.config.mjs`.
- If you hit DB connection issues, ensure `lib/prisma.js` uses a singleton Prisma client to avoid connection storms (common in serverless).
- The receipt scanner UI is purely client-side and integrates with `app/api/scan/route.js` for backend processing.

**Contributing**
- Fork the repo, create a feature branch, add tests where appropriate, and open a PR. Keep PRs focused.

**Next steps I can help with**
- Run database migrations and seed data locally.
- Start the dev server and fix runtime errors.
- Add a `.env.example` file documenting required environment variables.

---


