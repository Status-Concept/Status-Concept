# Design: Close the enquiry loop

**Status:** design spike + a shipped proof-of-concept (`user_id` on enquiries).
**Author:** advisor/executor, 2026-07-07.
**Depends on:** the versioned `enquiries` table (plans/002).

The contact form is the site's core conversion, but today it is write-only:
`public.enquiries` has no `user_id`, no status, and no read surface. The client
dashboard already promises "os pedidos feitos no site aparecerão aqui com
estado, notas e histórico" (`ClientDashboard.jsx` quote-placeholder) — a
stated-but-undelivered feature. Closing the loop means (a) logged-in customers
see their own requests with status, and (b) the showroom team gets an in-app
inbox instead of the raw Supabase table view.

---

## 1. Data model

Two new columns on `public.enquiries`:

| Column | Type | Notes |
|--------|------|-------|
| `user_id` | `uuid null references auth.users(id) on delete set null` | **Shipped in this spike's PoC.** Stamped when a session exists; null for anonymous submits. |
| `status` | `text not null default 'new' check (status in ('new','in_progress','replied','closed'))` | Proposed, not yet applied. |

Draft migration for the `status` column (apply when this design is accepted):

```sql
alter table public.enquiries
  add column if not exists status text not null default 'new'
  check (status in ('new','in_progress','replied','closed'));
```

### Status vocabulary — open question

The business flow is enquiry → consultation → proposal → won/closed. Two framings:

- **Inbox states** (RECOMMEND for v1): `new → in_progress → replied → closed`.
  Matches the "estado" promise, small, and doesn't pretend to be a CRM.
- **Pipeline stages** (`enquiry / consultation / proposal / won / lost`):
  richer, but that is CRM territory and implies reporting the team may not want
  in-app. Defer unless the operator asks.

RECOMMEND inbox states now; the column's check constraint above encodes them.

### Staff model — open question

Reads for the team require a "staff" concept, which the schema has none of
(`profiles` is `id, name, phone`). Options:

- **(a) `profiles.role text`** (RECOMMEND): add a `role` column; RLS uses
  `exists (select 1 from public.profiles where id = auth.uid() and role = 'staff')`.
  Smallest, self-contained, no new infra.
- **(b) Supabase custom JWT claims**: no table change, but requires an auth hook
  and is harder to reason about/debug.
- **(c) `staff_users` table**: explicit, but another table + join for every
  policy check.

RECOMMEND (a). Tradeoff: a `role` column is app-managed data, so it must never
be writable by the user themselves — the existing profile-update policy only
lets a user set `name`/`phone`, so `role` stays out of that path (enforce by
column grants or a trigger).

### RLS policy set (draft — apply with the design)

```sql
-- Customers read only their own enquiries.
create policy "Users read own enquiries"
  on public.enquiries for select
  to authenticated
  using (user_id = (select auth.uid()));

-- Staff read and update every enquiry (role check).
create policy "Staff read all enquiries"
  on public.enquiries for select
  to authenticated
  using (exists (select 1 from public.profiles p
                 where p.id = (select auth.uid()) and p.role = 'staff'));

create policy "Staff update enquiries"
  on public.enquiries for update
  to authenticated
  using (exists (select 1 from public.profiles p
                 where p.id = (select auth.uid()) and p.role = 'staff'));

-- INSERT policy is unchanged (anyone can submit). anon can never SELECT.
```

---

## 2. Surfaces

### Customer history panel (`/cliente`)

Replace the `quote-placeholder` block in `ClientDashboard.jsx` with a list of
the signed-in user's enquiries: date, interest, a status chip, and a message
excerpt. Empty state: "Ainda não fez pedidos — explore o catálogo e peça uma
proposta." Reads via the "Users read own enquiries" policy; only rows with a
matching `user_id` appear (older anonymous submits by the same person won't,
which is acceptable).

### Staff inbox

Route options:
- **`/cliente/inbox` behind a role check** (RECOMMEND): reuses `ProtectedRoute`
  + `Layout`; the nav link renders only when `profile.role === 'staff'`.
- A separate `/admin` shell: cleaner separation, but a second layout to build.

v1 inbox = list + detail + a status dropdown (writes via "Staff update
enquiries"). No notes/threading in v1 (defer).

---

## 3. Open questions for the operator

1. **Status vocabulary** — confirm inbox states (`new/in_progress/replied/closed`) vs pipeline stages.
2. **Who is staff** — which account emails get `role = 'staff'`.
3. **Retention** — GDPR retention window for `enquiries` (feeds the privacy page, plans/003).
4. **Notifications** — is an email-on-new-enquiry wanted in v1? (Needs an email sender; out of scope here.)

## Proposed follow-up plans (once accepted)

1. **Migration + RLS**: apply the `status` column, `profiles.role`, and the policy set above.
2. **Account history view**: the `/cliente` panel reading own enquiries.
3. **Staff inbox**: `/cliente/inbox` list + detail + status control.

---

## Proof of concept (shipped in this spike)

- `user_id uuid null` added to `public.enquiries` (live + versioned in
  `supabase-schema.sql`).
- `status-concept-contact.jsx` now sends `user_id: user?.id ?? null`, so an
  authenticated submit is attributed to the account while anonymous submits
  stay null. No SELECT policy exists yet — the table remains write-only until
  the design above is approved.
