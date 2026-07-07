# Plan 018: SPIKE — Close the enquiry loop (account history + showroom inbox)

> **Executor instructions**: This is a DESIGN SPIKE, not a build plan. The
> deliverable is a written design document + a thin proof-of-concept, NOT a
> finished feature. Follow steps; on any STOP condition, stop and report.
> Update `plans/README.md` when done.
>
> **Drift check (run first)**: `git diff --stat f56df33..HEAD -- supabase-schema.sql src/pages/status-concept-contact.jsx src/pages/client/ClientDashboard.jsx`
> On mismatch with "Current state", STOP.

## Status

- **Priority**: P3 (direction — largest scope)
- **Effort**: L (spike itself: M)
- **Risk**: MED (RLS design)
- **Depends on**: 002 (enquiries DDL must be versioned first)
- **Category**: direction
- **Planned at**: commit `f56df33`, 2026-07-07

## Why this matters

Enquiries are the site's core conversion and today they are write-only into a black box: no `user_id`, no status, no read surface for anyone. The client dashboard explicitly promises "os pedidos feitos no site aparecerão aqui com estado, notas e histórico" (`ClientDashboard.jsx:28-30` quote-placeholder) — a stated-but-undelivered feature. Closing the loop means: (a) logged-in customers see their requests with status; (b) the showroom team gets an in-app inbox instead of the raw Supabase table view.

## Current state

- `src/pages/status-concept-contact.jsx:85` — anonymous-or-authenticated insert into `enquiries`; payload has `source` but no `user_id`.
- `enquiries` columns (after plan 002): `id, name, email, phone, interest, message, source, created_at` — RLS: insert-only for anon/authenticated, no select.
- `src/pages/client/ClientDashboard.jsx:28-31` — the placeholder block to replace eventually.
- Auth: `useAuth()` provides `user` (Supabase auth user) and `profile`. No role/staff concept exists anywhere in the schema (`profiles` has `id,name,phone` only).
- Client area routing: `/cliente` (ProtectedRoute) with nested `perfil`, `favoritos` (`src/App.jsx`).

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Build | `npm run build` | exit 0 |
| Tests | `npm test` | pass |

## Scope

**In scope (spike deliverables)**:
1. `docs/design/enquiry-loop.md` (create) — the design document (Step 1-3)
2. Migration DRAFT appended to the design doc (NOT applied): `user_id`, `status`, staff role mechanism
3. Proof-of-concept: stamp `user_id` on insert when a session exists (small, safe, shippable — Step 4)

**Out of scope**:
- Building the account history view or the staff inbox UI (follow-up plans come from the accepted design).
- Applying any migration beyond the PoC needs (the PoC column addition IS applied — see Step 4).
- Email notifications.

## Git workflow

- Branch `loop`; commits: `Design doc: enquiry loop` and `Stamp user_id on enquiries when logged in`.

## Steps

### Step 1: Design — data model

Write `docs/design/enquiry-loop.md` covering:
- New columns: `user_id uuid null references auth.users(id) on delete set null`, `status text not null default 'new' check (status in ('new','in_progress','replied','closed'))` — justify the vocabulary against the business flow (enquiry → consultation → proposal → won/closed) and note the open question: does the team want pipeline stages or inbox states? RECOMMEND inbox states now (matches "estado" promise; pipeline is CRM territory).
- Staff model options: (a) `profiles.role text` column + RLS `using (exists(select 1 from profiles where id = auth.uid() and role = 'staff'))`; (b) Supabase custom claims; (c) a `staff_users` table. RECOMMEND (a) — smallest, self-contained; document the tradeoffs of each in 2-3 sentences.
- RLS policy set (draft SQL in the doc): customer SELECT `using (user_id = (select auth.uid()))`; staff SELECT/UPDATE via the role check; INSERT unchanged. Explicitly: anon can never select.

### Step 2: Design — surfaces

In the same doc: wireframe-level description (text, no images needed) of
- `/cliente` history panel: list of own enquiries (date, interest, status chip, message excerpt) replacing the quote-placeholder; empty state copy.
- Staff inbox: route options — `/cliente/inbox` gated by role vs a separate `/admin` shell; RECOMMEND `/cliente/inbox` behind a role check (reuses ProtectedRoute + Layout). List + detail + status dropdown; no notes/threading in v1 (defer).

### Step 3: Design — open questions for the operator

List explicitly: status vocabulary sign-off; who gets staff role (emails); GDPR retention window for enquiries; whether email notification on new enquiry is wanted in v1. The doc ends with a "Proposed follow-up plans" list (019+ numbering as available): migration+RLS, account history view, staff inbox.

**Verify (Steps 1-3)**: doc exists, contains draft SQL, recommendations marked RECOMMEND, and the open-questions section.

### Step 4: Proof-of-concept — stamp user_id now

Small shippable slice proving the model: add the `user_id` column (nullable) via migration (apply through Supabase MCP if available: `alter table public.enquiries add column if not exists user_id uuid references auth.users(id) on delete set null;` — also append to `supabase-schema.sql`), and in `contact.jsx` include `user_id: user?.id ?? null` in the payload (get `user` from `useAuth()`). NO select policies yet — the table stays write-only until the design is approved.

**Verify**: build+lint+tests green; logged-in submit writes a row with `user_id` set (check via MCP query or dashboard); anonymous submit still works with `user_id` null.

## Test plan

PoC only: existing suites stay green; manual verification of both submit paths.

## Done criteria

- [ ] `docs/design/enquiry-loop.md` complete (model, surfaces, open questions, follow-up plan list)
- [ ] `user_id` column live + stamped on authenticated submits; anonymous path unaffected
- [ ] `supabase-schema.sql` updated with the column
- [ ] Tests/build/lint exit 0
- [ ] `plans/README.md` updated

## STOP conditions

- Plan 002 has not landed (no versioned enquiries DDL to build on).
- The live table rejects the column addition — report the live schema.
- You find yourself building the inbox UI — that is the next plan, not this one.

## Maintenance notes

- The operator must answer the open questions before the follow-up build plans are written.
- Privacy page (plan 003) should mention enquiry retention once a window is chosen.
