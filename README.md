# JobTracker

A job application tracker built with React, TypeScript, Vite, and Supabase.

## Features

- Record company, application site, salary, position, location, stage, and notes
- View all applications in a table (desktop) or cards (mobile)
- Filter by stage and search across fields
- Stats dashboard (total / in progress / accepted / rejected)
- Sign in to sync data across PC and mobile via Supabase

## Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com)
2. In **SQL Editor**, run the script in [`supabase/schema.sql`](supabase/schema.sql)
3. In **Project Settings → API**, copy the **Project URL** and **anon public** key
4. Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

5. In **Authentication → Providers**, ensure **Email** is enabled

Existing `localStorage` data is migrated automatically on first sign-in.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
npm run preview
```

## Deploy

Deploy the built app to [Vercel](https://vercel.com) or [Netlify](https://netlify.com). Add the same `VITE_SUPABASE_*` environment variables in the hosting dashboard.
