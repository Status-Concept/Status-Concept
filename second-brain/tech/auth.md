# Auth & Client Portal

## Provider
**Supabase** — handles auth, user sessions, and likely favorites storage.

## Auth Flow
- `src/context/AuthContext` — React context wrapping Supabase auth
- `src/components/ProtectedRoute.jsx` — Redirects unauthenticated users away from `/cliente/*`
- Login page: `/login` → `pages/Login.jsx`
- Register page: `/registar` → `pages/Register.jsx`

## Client Portal Routes
| Route | Purpose |
|-------|---------|
| `/cliente` | Dashboard overview |
| `/cliente/perfil` | Profile management |
| `/cliente/favoritos` | User's saved favorites |

## Favorites System
- `src/FavoritesContext.jsx` — React context at root src level
- `src/context/` — Additional context files
- `src/FavoriteButton.jsx` — Heart icon component used on product cards/detail
- Favorites persist via Supabase (linked to user account)
- Public `/favorites` route also exists (may work without auth)

## Supabase Setup
- Keys stored in `.env` (see `.env.example` for variable names)
- Client initialized in `src/lib/` (likely `src/lib/supabase.js` or similar)
