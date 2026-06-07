# Routes & Pages

Defined in `src/App.jsx`.

## Public Routes

| Route | Component | File |
|-------|-----------|------|
| `/` | Homepage | `pages/status-concept-homepage.jsx` |
| `/products` | Products browse | `pages/status-concept-products.jsx` |
| `/product/:id` | Product detail | `pages/status-concept-product-detail.jsx` |
| `/collection` | Collection detail | `pages/status-concept-collection.jsx` |
| `/about` | About / Company | `pages/status-concept-about.jsx` |
| `/contact` | Contact & showrooms | `pages/status-concept-contact.jsx` |
| `/projects` | Portfolio | `pages/status-concept-projects.jsx` |
| `/favorites` | Saved products | `pages/status-concept-favorites.jsx` |
| `/login` | User login | `pages/Login.jsx` |
| `/registar` | User registration | `pages/Register.jsx` (note: Portuguese spelling) |

## Protected Routes (Client Portal)

| Route | Component | File |
|-------|-----------|------|
| `/cliente` | Client dashboard | `pages/client/ClientDashboard.jsx` |
| `/cliente/perfil` | User profile | `pages/client/ClientProfile.jsx` |
| `/cliente/favoritos` | Saved favorites | `pages/client/ClientFavorites.jsx` |

Protected by `components/ProtectedRoute.jsx` — requires auth via Supabase.

## Layout
- `components/Layout.jsx` wraps all public pages
- `pages/client/ClientLayout.jsx` wraps client portal pages
- `components/PageNav.jsx` — global nav header
- `src/PageNav.jsx` — (also at root of src, check which is active)
