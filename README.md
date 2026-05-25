# Centre Formation Oujda

This workspace contains a full-stack Centre Formation Oujda website with:

- `backend/` — Node + Express + Prisma (SQLite) API
- `frontend/` — React + Vite + Tailwind UI
- auth, cart, checkout, order history, and admin order management
- Suggested launch URL: `https://www.centreformationoujda.com`

Quick start:

```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev

# In another terminal: Frontend
cd frontend
npm install
npm run dev
```

Seed sample products:

```bash
curl -X POST http://localhost:4000/api/products/seed
```

CI/CD & Deployment

This repository includes a GitHub Actions workflow at `.github/workflows/ci.yml`.
It runs on `push`, `pull_request` to `main`, and on manual dispatch, and builds both the backend and frontend.

- Backend CI:
  - installs dependencies
  - generates the Prisma client
  - validates backend syntax
- Frontend CI:
  - installs dependencies
  - builds the Vite app

Deployment options

- Frontend: deploy the generated `frontend/dist` output on Vercel, Netlify, GitHub Pages, or any static host.
- Backend: deploy the `backend/` API on Render, Railway, Fly, or a VPS with Node.js and SQLite.
- Environment variables are required for backend runtime: `JWT_SECRET`, `DATABASE_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `FRONTEND_URL`.

Render deployment workflow

This project includes a Render deploy workflow at `.github/workflows/render-deploy.yml`.
It triggers on `push` to `main` and deploys both:

- backend service using `RENDER_BACKEND_SERVICE_ID` or the generic `RENDER_SERVICE_ID`
- frontend service using `RENDER_FRONTEND_SERVICE_ID` or the generic `RENDER_SERVICE_ID`

Required GitHub secrets:

- `RENDER_API_KEY`
- `RENDER_SERVICE_ID`

Optional separate service IDs:

- `RENDER_BACKEND_SERVICE_ID`
- `RENDER_FRONTEND_SERVICE_ID`

If you only have one Render service for the full app, set `RENDER_SERVICE_ID` and omit the separate backend/frontend IDs.

Render service environment variables (backend service only):

- `JWT_SECRET` = A random JWT signing secret
- `DATABASE_URL` = `file:./dev.db` or your production database URL
- `STRIPE_SECRET_KEY` = Your Stripe API secret key
- `STRIPE_WEBHOOK_SECRET` = Your Stripe webhook signing secret
- `FRONTEND_URL` = `https://your-frontend-domain` (e.g. `https://centre-formation-oujda.onrender.com`)

If you deploy frontend and backend as separate Render services, add the same `FRONTEND_URL` value to the backend service and use it in Stripe redirect URLs.

Example Render setup commands

```bash
# Install the Render CLI if needed
curl -fsSL https://api.render.com/cli/install.sh | bash

# Log in to Render via the CLI
render login

# Create a service for the full-stack app (replace values as needed)
render services create --name "centre-formation-oujda" --type web_service --env node --repo-url "https://github.com/your-org/your-repo" --branch main --build-command "cd backend && npm ci && cd ../frontend && npm ci && npm run build" --start-command "cd backend && npm start"

# If using separate services, create backend and frontend services separately
render services create --name "centre-formation-oujda-backend" --type web_service --env node --build-command "npm ci" --start-command "npm start" --root-directory backend
render services create --name "centre-formation-oujda-frontend" --type static_site --env static --build-command "npm ci && npm run build" --publish-dir frontend/dist --root-directory frontend
```

For custom server deployment, set up a target host and copy the backend files plus the built frontend assets.

Features:

- product browsing + search
- user registration and login
- cart management + checkout
- order confirmation
- user order history
- admin order listing and status updates

If you want an admin user, use Prisma Studio to set `isAdmin: true` for a registered user:

```bash
cd backend
npx prisma studio
```

## Deployment (quick)

The project is ready to deploy. Below are short, copy-paste commands for common deployment flows.

Frontend (build):

```bash
cd frontend
npm install
npm run build
```

Backend (start):

```bash
cd backend
npm install
npx prisma generate
# set environment variables (JWT_SECRET, DATABASE_URL, STRIPE_* , FRONTEND_URL)
npm start
```

Suggested hosting: Render (two services: backend + frontend) or any static host + Node host. See `dist/deployment-checklist.md` for detailed steps.

