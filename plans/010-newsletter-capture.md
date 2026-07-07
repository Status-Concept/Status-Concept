# Plan 010: Wire the homepage newsletter form to a real subscribers table

> **Executor instructions**: Follow step by step; verify each step. On any
> STOP condition, stop and report. Update `plans/README.md` when done.
>
> **Drift check (run first)**: `git diff --stat f56df33..HEAD -- src/pages/status-concept-homepage.jsx supabase-schema.sql src/components/TranslationLayer.jsx`
> On mismatch with "Current state", STOP.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: 002 (reuses its DDL/policy pattern and sanitize convention)
- **Category**: direction
- **Planned at**: commit `f56df33`, 2026-07-07

## Why this matters

The homepage newsletter form does `onSubmit={(e)=>e.preventDefault()}` — it captures nothing, gives no feedback, and quietly teaches visitors the site's forms don't work, right before the enquiry form asks for their trust. Second-home furniture purchases run on months-long consideration; a low-frequency "notes from the showroom" list is exactly the right capture for not-ready-yet buyers. This wires the form to a `subscribers` table with honest success/error states.

## Current state

- `src/pages/status-concept-homepage.jsx:155-160` (newsletter section):

```jsx
<h2 …>Notas do showroom…</h2>   {/* rendered via translation; source EN string "Notes from the showroom" */}
<p  …>New collections, private project features and seasonal care notes, a few times a year.</p>
<form onSubmit={(e)=>e.preventDefault()} style={{display:"flex",maxWidth:480,margin:"0 auto"}}>
  <input … type="email" …/>
  <button className="cb cg" …>Subscribe</button>
</form>
```

(Exact JSX may differ slightly — read the block before editing; the load-bearing fact is the inert `preventDefault` submit and an email input with no state.)

- Error/success pattern to copy: `src/pages/status-concept-contact.jsx` — `status` state (`idle|sending|sent|error`), honest failure banner, `try { if (!supabase) throw …; const { error } = await supabase.from(…).insert(…); if (error) throw error; setStatus('sent') } catch { setStatus('error') }`. NOTE: if plan 009 landed, use `const supabase = await getSupabase()` instead of the static import.
- Schema conventions: see `supabase-schema.sql` favorites/enquiries blocks (plan 002).
- PT translations: every new visible EN string needs a key in `TranslationLayer.jsx`'s `pt` dict.

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Build | `npm run build` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Tests | `npm test` | pass |

## Scope

**In scope**:
- `supabase-schema.sql` (append `subscribers` DDL)
- `src/pages/status-concept-homepage.jsx` (form state + submit)
- `src/components/TranslationLayer.jsx` (PT keys for new strings)
- Apply SQL live (Supabase MCP if available; else hand to operator)

**Out of scope**:
- Email delivery/sending (capture list only — record as open question in the commit body).
- Double-opt-in flows, marketing consent checkboxes beyond a simple consent line (add a single static line "By subscribing you agree to receive occasional emails." with PT key).

## Git workflow

- Branch `loop`; one commit: `Wire newsletter form to subscribers table with honest states`.

## Steps

### Step 1: Schema

Append to `supabase-schema.sql` (mirroring plan 002's style):

```sql
-- Newsletter signups from the homepage.
create table if not exists public.subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique check (char_length(email) <= 320),
  source text check (char_length(source) <= 60),
  created_at timestamptz not null default now()
);

alter table public.subscribers enable row level security;
grant insert on public.subscribers to anon, authenticated;

drop policy if exists "Anyone can subscribe" on public.subscribers;
create policy "Anyone can subscribe"
  on public.subscribers
  for insert
  to anon, authenticated
  with check (true);
```

Apply live via MCP `apply_migration` (name `add_subscribers_table`) or hand to operator.

**Verify**: `grep -c "public.subscribers" supabase-schema.sql` → ≥ 3.

### Step 2: Form state + submit

In the homepage component: add `const [nlEmail, setNlEmail] = useState(""); const [nlStatus, setNlStatus] = useState("idle");` and an async submit copying the contact pattern, inserting `{ email: nlEmail.trim().toLowerCase().slice(0,320), source: "homepage_newsletter" }`. Handle the unique-violation case as success-ish: if the insert error code is `23505` (duplicate), still show the success message (do not leak whether an email is already subscribed). Render states: button label `Subscribe` → `Sending…` while pending; on `sent` replace the form row with a single line `Thank you — you're on the list.`; on `error` show a small inline `Something went wrong. Please try again.` under the form. Add the consent line under the input.

**Verify**: `npm run lint` → 0; `npm run build` → 0.

### Step 3: PT keys

Add to the `pt` dict: `'Thank you — you're on the list.'` → `'Obrigado — está na lista.'` (mind the apostrophe: use a double-quoted JS key), `'Something went wrong. Please try again.'` → `'Algo correu mal. Tente novamente.'`, `'Sending…'` → `'A enviar…'` (already exists — reuse, do not duplicate), `'By subscribing you agree to receive occasional emails.'` → `'Ao subscrever aceita receber emails ocasionais.'`.

**Verify**: `/#/pt` homepage shows PT strings for the new states (trigger error by stopping network in DevTools).

### Step 4: End-to-end

`npm run dev`: subscribe with a fresh email → success line; subscribe again with the same email → still success (duplicate path); malformed email is blocked by the input's `type="email"` validation.

**Verify**: a row exists in `subscribers` (MCP query or Supabase dashboard).

## Test plan

If 001 landed: no new test file required (form logic is thin); optionally assert the homepage renders the Subscribe button in `App.test.jsx`.

## Done criteria

- [ ] `subscribers` DDL committed and applied (or handed off)
- [ ] Form has pending/success/error/duplicate behavior; no more inert preventDefault
- [ ] PT strings render on `/#/pt`
- [ ] Tests/build/lint exit 0
- [ ] `plans/README.md` updated

## STOP conditions

- The newsletter block was redesigned away (drift).
- Insert fails with an RLS error after applying the policy — report the live policy state; do not widen policies beyond insert.

## Maintenance notes

- Open question recorded: no email delivery exists; the list is capture-only until a sender (e.g. Resend/Mailchimp) is chosen.
- GDPR: the cookies/privacy pages (plan 003) should mention the subscribers list once both land.
