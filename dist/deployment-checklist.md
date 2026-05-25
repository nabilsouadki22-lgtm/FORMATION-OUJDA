Deployment Checklist

1. Server choices
   - Option A: Render (recommended for quick deploy)
   - Option B: VPS or traditional host

2. Required environment variables (backend)
   - `JWT_SECRET` — random string
   - `DATABASE_URL` — e.g. `file:./dev.db` (for SQLite) or a production DB URL
   - `STRIPE_SECRET_KEY` — Stripe API secret
   - `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
   - `FRONTEND_URL` — `https://www.centreformationoujda.com`

3. Render deploy (backend)
   - Create a Web Service on Render using the `backend/` directory as root.
   - Build command: `npm ci && npx prisma generate && npm run build` (or `npm ci && npx prisma generate` if you run server without building)
   - Start command: `npm start` (from repo root the `start` script runs concurrently).
   - Add environment variables in Render dashboard.

Render YAML (optional)

If you want Render to auto-create services from the repo, push the included `render.yaml` to the repository root. When you connect the repository to Render, it will read the blueprint and create the backend and frontend services automatically (replace `repo` values in the blueprint first).

CI / GitHub Actions

The repo already includes a GitHub Action workflow `.github/workflows/render-deploy.yml` that can trigger a deployment to Render when you push to `main`. Set the following GitHub secrets in your repository:

- `RENDER_API_KEY` — your Render API key
- `RENDER_BACKEND_SERVICE_ID` — the backend service ID (if using separate service IDs)
- `RENDER_FRONTEND_SERVICE_ID` — the frontend service ID
- or `RENDER_SERVICE_ID` — a generic service ID if you use a single service

Once the secrets are set, pushing to `main` will run the workflow and invoke the Render deploy API.

4. Render deploy (frontend)
   - Create a Static Site on Render (or use Render static hosting) with `frontend/` as root.
   - Build command: `npm ci && npm run build`
   - Publish directory: `frontend/dist`
   - Set `FRONTEND_URL` to the deployed domain in the backend environment.

5. Manual VPS deploy (concise)
   - Copy repository to server.
   - Install Node.js (LTS), Git.
   - In repo: `npm ci`
   - `cd backend && npx prisma generate` and ensure `DATABASE_URL` is set.
   - `npm run build` (frontend) then serve `frontend/dist` via nginx, or run the backend and serve static files from Express.
   - Use process manager (PM2/systemd) to run backend.

6. Stripe setup
   - Add `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` to backend env.
   - Configure webhook endpoint on Stripe to `https://<YOUR_BACKEND>/api/payments/webhook` and copy the signing secret.

7. Post-deploy checks
   - Visit `https://<your-frontend>/` and sign up a test user.
   - Verify product browsing, add to cart, place order (direct and via Stripe), and check order status in admin.

8. Notes
   - For production DB use PostgreSQL/MySQL; update `DATABASE_URL` accordingly and run migrations.
   - If not using Render, make sure the backend `FRONTEND_URL` points to the correct frontend domain.
