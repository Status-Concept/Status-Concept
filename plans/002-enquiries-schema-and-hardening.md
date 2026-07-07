# Plan 002: Version the `enquiries` table with RLS and harden the public insert path

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. If
> anything in the "STOP conditions" section occurs, stop and report — do not
> improvise. When done, update the status row in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat f56df33..HEAD -- supabase-schema.sql src/pages/status-concept-contact.jsx src/utils/sanitize.js`
> On any mismatch with the "Current state" excerpts, STOP.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: security
- **Planned at**: commit `f56df33`, 2026-07-07

## Why this matters

The contact form is the site's primary conversion action. It inserts into `public.enquiries` (`src/pages/status-concept-contact.jsx:85`), but that table does not exist in the committed `supabase-schema.sql` — a fresh environment provisioned from this repo silently loses every enquiry. The live table exists (RLS enabled, columns `name,email,phone,interest,message,source,created_at`, no `user_id`), but its DDL/policies are unversioned. Additionally, the payload is only `.trim()`ed — the repo's own `sanitizeText`/`sanitizePhone` (used by the profile path in `src/context/AuthContext.jsx:32-34`) are bypassed, and there are no length caps, making the anonymous insert a spam/abuse vector and a stored-XSS risk for any future admin view.

## Current state

- `supabase-schema.sql` — defines `public.products`, `public.profiles`, `public.favorites` with RLS + policies. Convention to match (excerpt, lines 36-42):

```sql
create table if not exists public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id text not null,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);
```

Policies use `drop policy if exists` then `create policy` with `(select auth.uid())` (lines 51-101). `enquiries` appears nowhere in this file (`grep -c enquiries supabase-schema.sql` → 0).

- `src/pages/status-concept-contact.jsx:74-90` (approximate excerpt):

```jsx
const payload = {
  name: form.name.trim(),
  email: form.email.trim(),
  phone: form.phone.trim(),
  interest: form.interest,
  message: form.message.trim(),
  source: shortlist.length ? "favorites_shortlist" : enquiryProduct ? "product_enquiry" : "contact_page",
};
try {
  if (!supabase) throw new Error("no-backend");
  const { error } = await supabase.from("enquiries").insert(payload);
  if (error) throw error;
  setStatus("sent");
```

- `src/utils/sanitize.js` — exports `sanitizeText`, `sanitizePhone`. Exemplar usage: `src/context/AuthContext.jsx:32-34`.
- Supabase project id: `zxrqufsrqmbsrceglofj`. The Supabase MCP tools (`mcp__…__execute_sql`, `apply_migration`) may be available to apply SQL; otherwise output the SQL and tell the operator to run it in the Supabase SQL editor.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Build | `npm run build` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Tests | `npm test` | all pass (if plan 001 landed) |

## Scope

**In scope**:
- `supabase-schema.sql` (append `enquiries` DDL + policies)
- `src/pages/status-concept-contact.jsx` (sanitize + length caps on payload)
- Applying the SQL to the live project (via Supabase MCP if available, else hand SQL to operator)

**Out of scope**:
- Adding `user_id`/status workflow to enquiries (that is plan 018's spike).
- CAPTCHA / edge-function rate limiting — record as follow-up; do not add third-party services without operator approval.
- Any other table's policies.

## Git workflow

- Current branch (`loop`); one commit: `Version enquiries table with RLS and sanitize the contact payload`.
- Do NOT push unless instructed.

## Steps

### Step 1: Append `enquiries` DDL to `supabase-schema.sql`

Append, matching the file's existing style:

```sql
-- Public enquiry submissions from the contact form.
create table if not exists public.enquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null check (char_length(name) <= 200),
  email text not null check (char_length(email) <= 320),
  phone text check (char_length(phone) <= 40),
  interest text check (char_length(interest) <= 100),
  message text check (char_length(message) <= 4000),
  source text check (char_length(source) <= 60),
  created_at timestamptz not null default now()
);

alter table public.enquiries enable row level security;

grant insert on public.enquiries to anon, authenticated;

drop policy if exists "Anyone can submit an enquiry" on public.enquiries;
create policy "Anyone can submit an enquiry"
  on public.enquiries
  for insert
  to anon, authenticated
  with check (true);

-- Deliberately NO select/update/delete policy for anon or authenticated:
-- submissions are write-only from the public site.
```

**Verify**: `grep -c "public.enquiries" supabase-schema.sql` → ≥ 3.

### Step 2: Apply to the live project (idempotent)

If Supabase MCP tools are available: run the Step 1 SQL via `apply_migration` (name `version_enquiries_table`). The live table already exists — `create table if not exists` and `drop policy if exists` keep this idempotent. If the live table already has check constraints with different names, do NOT fight them; the goal is that the committed file provisions a working table from scratch.

If MCP is not available: STOP after Step 1 and report that the SQL must be applied manually; continue with Step 3 regardless (frontend change is independent).

**Verify** (MCP path): `select count(*) from pg_policies where tablename = 'enquiries';` → ≥ 1.

### Step 3: Sanitize + cap the contact payload

In `src/pages/status-concept-contact.jsx`, import the sanitizers and apply them, with hard length slices matching the DB checks:

```jsx
import { sanitizePhone, sanitizeText } from "../utils/sanitize";
// ...
const payload = {
  name: sanitizeText(form.name).slice(0, 200),
  email: form.email.trim().slice(0, 320),
  phone: sanitizePhone(form.phone).slice(0, 40),
  interest: form.interest.slice(0, 100),
  message: sanitizeText(form.message).slice(0, 4000),
  source: /* unchanged */,
};
```

Keep the existing try/catch, status handling, and `source` logic byte-for-byte.

**Verify**: `npm run lint` → exit 0; `npm run build` → exit 0.

### Step 4: Manual smoke of the form

Run `npm run dev`, open `/#/en/contact`, submit a test enquiry with a `<b>bold</b>` name. Expected: success state; the stored row (or the payload logged via network tab) shows the name without `<`/`>` markup.

**Verify**: form reaches the "Thank you — your enquiry is on its way." state.

## Test plan

If plan 001 landed, add to `src/utils/sanitize.test.js`: a case asserting `sanitizeText('<b>Ana</b>')` contains no angle brackets (align with actual implementation). No new test file otherwise; the DB layer is exercised manually.

## Done criteria

- [ ] `supabase-schema.sql` contains the `enquiries` DDL + insert-only policy
- [ ] Live project accepts an insert and has ≥1 policy on `enquiries` (or operator was handed the SQL)
- [ ] `contact.jsx` payload runs through `sanitizeText`/`sanitizePhone` with length caps
- [ ] `npm run build` and `npm run lint` exit 0
- [ ] `plans/README.md` updated

## STOP conditions

- The live `enquiries` table has columns incompatible with the DDL above (e.g. extra NOT NULL columns) — report the live shape instead of altering it.
- `sanitize.js` exports differ from `sanitizeText`/`sanitizePhone`.
- The form submit path in `contact.jsx` no longer matches the excerpt.

## Maintenance notes

- Plan 018 (enquiry loop spike) will add `user_id`/`status` columns — it builds on this DDL.
- Future admin/inbox views MUST output-encode enquiry fields; sanitize here is defense-in-depth, not a rendering guarantee.
- Follow-up (deferred): rate limiting via edge function or Turnstile on the insert path.
