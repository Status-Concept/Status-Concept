# Plan 005: Clear persisted favorites on logout (shared-device privacy)

> **Executor instructions**: Follow step by step; verify each step. On any
> STOP condition, stop and report. Update `plans/README.md` when done.
>
> **Drift check (run first)**: `git diff --stat f56df33..HEAD -- src/FavoritesContext.jsx src/context/AuthContext.jsx`
> On mismatch with "Current state", STOP.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: security (privacy)
- **Planned at**: commit `f56df33`, 2026-07-07

## Why this matters

When a logged-in user logs out on a shared device, their favorites (product IDs + cached product details) are flushed into `localStorage` and shown to the next anonymous visitor. It is a small but real behavioral-data leak, and it also pollutes the next user's account (guest favorites migrate INTO whatever account logs in next, via the migration path).

## Current state

- `src/FavoritesContext.jsx` — storage keys `STORAGE_KEY` (`status_concept_favorites`) and `DETAILS_KEY` (`status_concept_favorite_details`). Effects (lines ~29-35):

```jsx
useEffect(() => {
  if (!user) localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}, [favorites, user]);

useEffect(() => {
  localStorage.setItem(DETAILS_KEY, JSON.stringify(favoriteDetails));
}, [favoriteDetails, user]);
```

Note the leak mechanics: on logout `user` becomes null while `favorites` still holds the account's list → the first effect writes the account favorites to guest storage. The second effect writes details unconditionally.

- Login migration (same file, `loadSupabaseFavorites`): reads `STORAGE_KEY` and upserts those IDs into the account (`rowsToMigrate`). This guest→account migration on login is a FEATURE and must keep working.
- `src/context/AuthContext.jsx` — `logout()` calls `supabase.auth.signOut()` (~line 126-133) and does not touch favorites storage. Auth state flows to FavoritesContext via `useAuth()`.

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Build | `npm run build` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Tests | `npm test` | pass (if 001 landed) |

## Scope

**In scope**:
- `src/FavoritesContext.jsx`

**Out of scope**:
- `AuthContext.jsx` logout implementation (avoid cross-context coupling; solve inside FavoritesContext where the state lives).
- The login-time guest→account migration (must remain intact).
- Supabase `favorites` table/policies.

## Git workflow

- Branch `loop`; one commit: `Clear favorites storage and state on logout`.

## Steps

### Step 1: Track auth transitions inside FavoritesContext

In `src/FavoritesContext.jsx`, add an effect that reacts to the `user` transitioning from a value to `null` (logout), distinguishing it from the initial anonymous mount. Pattern:

```jsx
const prevUserRef = useRef(null);
useEffect(() => {
  const wasLoggedIn = Boolean(prevUserRef.current);
  prevUserRef.current = user;
  if (wasLoggedIn && !user) {
    // logout: wipe both storage keys and in-memory state
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DETAILS_KEY);
    setFavorites([]);
    setFavoriteDetails({});
  }
}, [user]);
```

Place this effect BEFORE the two persistence effects in the component body so the wipe wins the same render pass; additionally guard the first persistence effect so it cannot resurrect account data on the logout render: change `if (!user)` to also skip when a wipe just happened is unnecessary if state is reset — after `setFavorites([])` the re-run persists `[]`, which is the desired end state. Confirm final `localStorage` values are empty after the dust settles.

**Verify**: `npm run lint` → exit 0.

### Step 2: Manual verification of the three flows

With `npm run dev`:
1. **Logout wipe**: log in, favorite 2 products, log out → localStorage keys `status_concept_favorites` = `[]`/absent, `status_concept_favorite_details` = `{}`/absent; favorites page shows the empty state.
2. **Guest flow intact**: while logged out, favorite a product → it persists across reload.
3. **Migration intact**: with 1 guest favorite, log in → the favorite appears in the account (row upserted), and remains after logout+login again.

**Verify**: all three behave as described (check via DevTools → Application → Local Storage).

## Test plan

If 001 landed, add `src/FavoritesContext.test.jsx`: render the provider with a mocked `useAuth` switching `user` from `{id:'u1'}` to `null`, assert `localStorage.getItem(STORAGE_KEY)` is null/empty after the switch. Model the mocking on how AuthContext is consumed (`useAuth()` import — mock the module with `vi.mock`).

## Done criteria

- [ ] Logout leaves no favorites data in localStorage and empties in-memory favorites
- [ ] Guest favorites + login migration still work (manual flows 2 and 3)
- [ ] Build, lint (and tests if present) exit 0
- [ ] `plans/README.md` updated

## STOP conditions

- The persistence effects in FavoritesContext no longer match the excerpts.
- Fixing the wipe breaks migration (flow 3) after one honest attempt — report the ordering problem instead of adding flags.

## Maintenance notes

- If "remember guest favorites separately from account favorites" is ever wanted, replace the wipe with key-namespacing by user id — out of scope today.
- Reviewer should scrutinize the initial-mount case: an anonymous visitor's stored favorites must NOT be wiped on first load (the `prevUserRef` guard is what prevents that).
