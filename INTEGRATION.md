# MMICS Portal — Backend/Frontend Integration

Everything below reflects the work done in this pass: the backend and frontend
are now wired together, the member portal from the proposal is built, the admin
dashboard is fast, and image upload works in every environment.

The **public website was deliberately left alone** — Home, About, Products,
Gallery, Contact, Board of Directors, Navbar and Footer and their CSS are
untouched, since that design is still in progress. Only routing was added
around them.

---

## 1. Do this first

### Rotate the leaked database credential

`backend/.env` is committed to git and contains a live Neon password
(`npg_qPWy1Ka…`). Anyone with repo access has your database.

```bash
# 1. Rotate the password in the Neon console, then update backend/.env
# 2. Stop tracking the file (it is now in .gitignore)
git rm --cached backend/.env
git commit -m "Stop tracking backend/.env"
```

The old value stays in git history, so rotating in Neon is the part that
actually matters.

### Set a real JWT secret

`JWT_SECRET` is currently the literal string
`"your-super-secret-jwt-key-change-this-in-production"`. Anyone who has seen the
repo can forge an admin token.

```bash
openssl rand -base64 48
```

Put the result in `backend/.env`. Changing it signs everyone out, which is what
you want.

---

## 2. Running it

```bash
# ---------- Backend ----------
cd backend
cp .env.example .env          # then fill in DATABASE_URL and JWT_SECRET
npm install
npm run setup                 # prisma generate + migrate deploy + seed
npm run dev                   # http://localhost:5000

# ---------- Frontend ----------
cd ..
npm install
npm run dev                   # http://localhost:5173
```

`npm run setup` is a new script that runs generate, migrate and seed in order.
Run the pieces individually if you prefer:

```bash
npm run db:generate
npm run db:migrate     # applies migrations (production-safe)
npm run db:seed        # creates the first admin + a demo member
```

### Logins created by the seed

| Portal | URL | Credentials |
|---|---|---|
| Staff / admin | `/login` | `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env` |
| Member | `/member/login` | `DEMO_MEMBER_EMAIL` / `DEMO_MEMBER_PASSWORD` from `.env` |

There was previously **no way to create the first admin user** — no seed script
and `/api/auth/register` requires an existing logged-in admin. That is fixed.

---

## 3. What was broken, and what fixed it

### Integration

| Problem | Fix |
|---|---|
| `src/routes.jsx` was dead code. `main.jsx` renders `App.jsx`, which had no member routes. The member portal was unreachable. | Deleted `routes.jsx`; all routes now live in `App.jsx`. |
| No member backend at all. The `Member` model existed but had no controller, routes or auth. | Added `memberAuthController`, `memberController`, `memberAuth` middleware and their routes. |
| Editing a product was impossible. `ProductForm` called `getBySlug(id)` with a database id; the slug endpoint filters on `slug + isActive` and 404'd every time. `getProductById` existed but had no route. | Added `GET /api/products/id/:id`, declared before `/:slug` so Express does not match `id` as a slug. Form now calls `getById`. |
| Admin sidebar linked to six pages that did not exist — blank 404s. | Routes added for all of them; the six without screens yet render a clear "not built" placeholder instead of a blank page. |
| `Object.keys(data).forEach(key => data[key] && formData.append(...))` dropped every falsy value, so `isActive: false` and `sortOrder: 0` were never sent. Unchecking "Active" silently did nothing. | Replaced with a `toFormData()` helper that only skips `null`/`undefined`. |
| Manually setting `Content-Type: multipart/form-data` produced a boundary-less header on some requests. | Request interceptor now deletes the header when the body is `FormData`, letting the browser set the boundary. |
| Rate limiters were defined but never mounted. | `authLimiter` on `/api/auth/login`, `apiLimiter` on `/api`. |

### Dashboard speed

The dashboard fired **six parallel requests**, each pulling up to 100 full rows
with joined categories and image arrays, then called `.length` on the result.
Slow, and the counts were capped at 100 so they were wrong once you had real
data.

- New `GET /api/dashboard/stats` returns every figure as a database `COUNT`
  inside a single `$transaction` — one round trip, integers not rows.
- 15-second in-process cache (`DASHBOARD_CACHE_MS`), bypassed with `?refresh=true`.
- **The migration named `add_performance_indexes` contained zero indexes** — it
  was the initial `CREATE TABLE` migration with a misleading name. Every foreign
  key and filter column was doing a sequential scan. A new migration adds ~26
  real indexes, including `pg_trgm` GIN indexes so the `ILIKE` product search can
  use an index.
- Prisma is now a singleton guarded on `globalThis`. Without this, every nodemon
  reload created a fresh connection pool — a common cause of Neon "too many
  connections" and of the dashboard degrading the longer the dev server ran.
- The pool is opened at boot, so the first dashboard load no longer pays for the
  TLS handshake to Neon.
- Product image uploads went from a sequential `for` loop (10 uploads then 10
  inserts, one at a time) to parallel uploads plus a single `createMany`.

### Images

The root cause: `CLOUDINARY_*` in `.env` are placeholder strings, so every
upload threw a 500.

- New `backend/src/config/storage.js` with two drivers. Cloudinary when real
  credentials are present, **local disk otherwise** — files land in
  `backend/uploads/` and are served from `/uploads`. Both return
  `{ url, publicId }`, so no controller knows the difference. Uploads now work
  on a fresh checkout with no Cloudinary account.
- If a Cloudinary upload fails mid-flight (bad key, network blip) it falls back
  to local rather than losing the file.
- Helmet's default `Cross-Origin-Resource-Policy: same-origin` was blocking
  API-served images from displaying on the frontend origin. Now set to
  `cross-origin`.
- `resolveImageUrl()` normalises the five shapes the backend can return
  (absolute Cloudinary URL, absolute local URL, `/uploads/...`, bare storage key,
  null). Relative paths were previously rendered as-is, pointing the browser at
  port 5173 instead of 5000.
- New `<SmartImage>` component: inline-SVG placeholder when there is no image,
  `onError` fallback when one 404s (deleted from storage but still referenced in
  the DB), lazy loading, and Cloudinary resize params for thumbnails.
- Path traversal is blocked on both write and delete — folder names come from
  controllers as `products/<id>`, so they are sanitised.

### Member portal (per the proposal)

Built to the proposal's *Member Portal* and *Member Management System* sections.

**Member Login** — secure credentials, authentication, access to a personal
dashboard. Members live in their own table with their own endpoint. Tokens carry
an `accountType` claim, so an admin token cannot be used on member endpoints and
vice versa (both directions are covered by tests).

**Member Dashboard** — personal profile details, membership information, account
details, all from one request. Plus a self-service profile page for editing
contact details, photo and password.

**Member Management (admin)** — add members (auto-generated `MEM-2026-0001`
numbers, one-time temporary passwords), view list, search, edit, update, delete,
activate/deactivate. All seven *Member Information Fields* from the proposal are
present: Name, Contact Number, Email, Address, Membership Number, Profile Image,
Account Status.

**Styling** — `MemberLayout` and the member dashboard were written in Tailwind
classes, but this project has no Tailwind build step, so every one of them was
inert and the portal rendered as raw unstyled HTML. Rewritten with real CSS
(`styles/member.css`). Similarly, the admin pages referenced `.btn`,
`.form-control`, `.form-card` and `.page-header`, none of which existed in any
stylesheet — those are now defined in `styles/portal.css`.

---

## 4. New API endpoints

### Member portal — `/api/member/auth`

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/login` | public | Member sign in (rate limited) |
| GET | `/me` | member | Own profile |
| GET | `/dashboard` | member | Profile + membership + account + org, one call |
| PUT | `/profile` | member | Update own name, phone, address, photo |
| POST | `/change-password` | member | Change own password |

### Member administration — `/api/members`

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/` | admin | Paginated, searchable list |
| GET | `/:id` | admin | Single member |
| POST | `/` | admin | Create profile + account |
| PUT | `/:id` | admin | Update details, reset password |
| PATCH | `/:id/status` | admin | Activate / deactivate |
| DELETE | `/:id` | admin | Delete |

### Dashboard

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/dashboard/stats` | admin/editor | All counts + recent activity |

### Also added

- `GET /api/products/id/:id` — fetch by database id
- `GET /uploads/*` — static serving for locally stored images
- `/api/health` now reports the active storage driver

---

## 5. Verification

Three suites were run against this build, 55 checks, all passing:

- **Storage layer (17)** — driver fallback, single and batch upload, extension
  handling, nested folders, deletion, missing-file safety, path-traversal
  blocking on both write and delete.
- **Image resolver (18)** — all five URL shapes, primary-image selection,
  Cloudinary resize transforms, null handling.
- **API integration (20)** — route mounting, auth guards on every protected
  endpoint, cross-portal token rejection in both directions, malformed tokens,
  route ordering for `/products/id/:id`, static uploads, CORP header.

Frontend build: **passes** (`125 modules transformed`).
Lint: **0 errors**, 13 pre-existing `exhaustive-deps` warnings in files not
touched here.

---

## 6. Still to do

Not blocking, but worth knowing:

1. **Six admin screens are placeholders** — Contact Messages, Directors,
   Gallery, News, Testimonials, Settings. Their API endpoints are all live, so
   these are frontend-only work. `MemberList.jsx` is a good template.
2. **Gallery and Home use hardcoded data.** `Gallery.jsx` has a static array
   pointing at `/images/gallery/*.jpg`, and `Home.jsx` uses Unsplash URLs. The
   gallery API is live and ready to replace that when the design settles.
3. **Password rules differ.** Admin passwords require 6 characters, member
   passwords 8. Worth aligning on 8.
4. **`prisma migrate deploy` vs the existing migration.** Your first migration
   folder is named `add_performance_indexes` but contains the initial schema. I
   left the name alone so your migration history stays intact; the new indexes
   are in a separate migration. New indexes use `IF NOT EXISTS`, so re-running is
   safe.
5. **Email is configured but unused** for member accounts. Temporary passwords
   are shown once in the admin UI and must be passed on manually. Wiring
   `emailService` into member creation would be a natural next step.

---

## 7. Files added

```
backend/
  src/config/storage.js                 unified image storage, two drivers
  controllers/memberAuthController.js   member portal auth
  controllers/memberController.js       admin member management
  controllers/dashboardController.js    aggregated stats
  middleware/memberAuth.js              member token guard
  routes/memberAuthRoutes.js
  routes/memberRoutes.js
  routes/dashboardRoutes.js
  prisma/seed.js                        first admin + demo member
  prisma/migrations/20260909120000_member_fields_and_real_indexes/
  .env.example
  uploads/                              local image storage

src/
  utils/image.js                        URL resolver + placeholders
  components/common/SmartImage.jsx      image with fallback
  pages/Admin/Members/MemberList.jsx
  pages/Admin/Members/MemberForm.jsx
  pages/Member/MemberLogin.jsx
  pages/Member/Profile.jsx
  styles/portal.css                     buttons, forms, alerts, tables
  styles/member.css                     member portal
.env.example
```

Rewritten: `app.js`, `src/server.js`, `src/config/database.js`,
`middleware/upload.js`, `routes/productRoutes.js`, `prisma/schema.prisma`,
`src/App.jsx`, `src/services/api.js`, `src/context/AuthContext.jsx`,
`src/components/ProtectedRoute.jsx`, `src/components/layout/MemberLayout.jsx`,
`src/pages/Admin/Dashboard.jsx`, `src/pages/Member/Dashboard.jsx`,
`vite.config.js`.

Deleted: `src/routes.jsx` (dead code that contradicted `App.jsx`).
