<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# CLS Feedback — project notes

- Canonical viewport: iPad (both portrait and landscape, responsive).
- Dark mode is forced (`<html className="dark">`) — do not add a light theme.
- Large touch targets: buttons/tap cards are ≥ 16 (h-16) on the main nav and ≥ 88px on option cards. Keep parity in new UI.
- Submissions write to Supabase via the Server Action in `src/app/actions.ts`. Schema: `supabase/migrations/0001_initial.sql`. Env vars in `.env.local.example`.
- Form content lives in `src/lib/form-config.ts`. Edit there, not in components.
- Wizard pacing is **one screen per priority** — each selected priority renders all its sub-questions on a single screen.
- All fields are optional — users can advance with the Next button at any time.
- Kiosk mode: after submit, the Thanks screen auto-resets after 60s back to the splash ("Tap to begin") screen.
- **Supabase permissions**: anon has INSERT on `submissions` but NOT SELECT. Never add `.select()` or `.update()` / `.delete()` against `submissions` from anon/server action code — the request will 403 with "permission denied". To read submissions, use the service-role key in a separate admin route, or view them via the Supabase dashboard Table Editor.
