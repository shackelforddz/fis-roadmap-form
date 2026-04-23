# CLS Roadmap Feedback

Single-page wizard form for collecting CLS roadmap feedback on a shared iPad.
Responses persist to Supabase.

- Stack: Next.js 16 (App Router) · React 19 · Tailwind v4 · shadcn/ui · Supabase · Zod
- Canonical viewport: iPad (portrait + landscape, responsive)
- Dark mode only, large touch targets
- Kiosk flow: splash → wizard → thank-you → auto-reset

## Setup

### 1. Install and run

```bash
npm install
cp .env.local.example .env.local   # then fill in Supabase values (below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 2. Create a Supabase project

1. Create a new project at [supabase.com](https://supabase.com/dashboard).
2. In **Project Settings → API**, copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys → anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Paste both into `.env.local`.

### 3. Run the migration

Open the Supabase dashboard → **SQL Editor** → paste the contents of
`supabase/migrations/0001_initial.sql` and run it. This creates the
`public.submissions` table with an anon-insert RLS policy.

### 4. Deploy (Vercel)

Push to GitHub, import into Vercel, and set the same two env vars in the
Vercel project settings. The form is fully static except the submit action.

## Project layout

```
src/
  app/
    actions.ts            # submitFeedback server action
    layout.tsx            # dark-mode shell
    page.tsx              # renders <Wizard />
  components/
    wizard/
      wizard.tsx          # state machine + layout
      question-*.tsx      # open / single / multi renderers
    ui/                   # shadcn primitives
  lib/
    form-config.ts        # ALL form content + branching rules
    submission-schema.ts  # zod validator
    supabase/server.ts    # SSR client
supabase/
  migrations/0001_initial.sql
```

All form copy and the branching rules live in `src/lib/form-config.ts`.
Add/edit questions there — the wizard picks them up automatically.
# fis-roadmap-form
