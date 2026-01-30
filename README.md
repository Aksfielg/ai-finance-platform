# AI Finance Platform

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

**Notes & operational details**
- The project uses Prisma migrations — review `prisma/migrations/` before running migrations in a production DB.
- Seeding: you can run `actions/seed.js` or call the seed API route at `app/api/seed/route.js` to populate sample data.
- Background processing: Inngest functions are wired under `lib/inngest` and the API route. Configure Inngest or replace with your preferred job worker for production.

**Development tips**
- Tailwind config is in `tailwind.config.js` and PostCSS settings in `postcss.config.mjs`.
- If you need to debug DB calls, `lib/prisma.js` centralizes the Prisma client instance.

**Contributing**
- Fork, create a branch, open a PR. Keep changes focused and include small, testable commits.

**Questions or next steps**
- Want me to run the dev server and fix errors shown on your machine? I can start it and iterate on any runtime issues.

---

Updated: concise project README covering features, files and run instructions.
# Full Stack AI Fianace Platform with Next JS, Supabase, Tailwind, Prisma, Inngest, ArcJet, Shadcn UI Tutorial 🔥🔥
## https://youtu.be/egS6fnZAdzk

<img width="1470" alt="Screenshot 2024-12-10 at 9 45 45 AM" src="https://github.com/user-attachments/assets/1bc50b85-b421-4122-8ba4-ae68b2b61432">

### Make sure to create a `.env` file with following variables -

```
DATABASE_URL=
DIRECT_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

GEMINI_API_KEY=

RESEND_API_KEY=

ARCJET_KEY=
```
