# HK InsuPlan

A web application for comparing and planning insurance riders.

## Features
- **Company & Rider Management**: Manage insurance companies and their specific riders/contracts.
- **Comparison Feed**: Create "A vs B vs C" comparison boards for riders.
- **Plan Builder**: Mix riders from different companies into a personalized plan.
- **Rider Limits**: Customize limits (max amount, age, etc.) for each rider in a plan.
- **Public Sharing**: Generate read-only public links for plans and comparisons.

## Tech Stack
- Framework: [Next.js 16](https://nextjs.org/) (App Router)
- Language: TypeScript
- Styling: Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/)
- Backend: [Supabase](https://supabase.com/) (Postgres, Auth, RLS)
- Icons: Lucide React

## Getting Started

### 1. Prerequisites
- Node.js 18+ installed.
- A Supabase project created.

### 2. Environment Setup
Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

You need:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (Required for Public Sharing feature to bypass RLS)

### 3. Database Setup
Run the SQL commands in `schema.sql` in your Supabase SQL Editor to create tables and RLS policies.
Optionally, run `seed.sql` to populate initial data.

### 4. Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deployment

Deploy to Vercel:
1. Push code to GitHub.
2. Import project in Vercel.
3. Add Environment Variables (same as `.env.local`).
4. Deploy.

## Security & Privacy
- **RLS**: All user data is protected by Row Level Security. Users can only edit their own plans/comparisons.
- **Public Sharing**: Shared via unique tokens. Read-only access is granted via a secure admin client on the server side.
- **Disclaimer**: Use official company documents for actual contracts. This tool is for planning purposes only.

## License
Private / Proprietary.
