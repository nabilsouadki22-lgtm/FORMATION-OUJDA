---
name: ready-to-port
description: "Prepare this full-stack project for porting to a new deployment target or hosting environment."
user-invocable: true
---

# Ready to Port

This skill audits and prepares the current `CentreFormationOujda` repository for porting to a new host, deployment platform, or runtime environment.

## Use when

- you want to move this full-stack Vite + React + Express + Prisma app to a new host
- you need a reproducible readiness checklist for backend, frontend, environment, and deployment
- you want to confirm the repo can build, run, and deploy cleanly before porting

## Workflow

1. Choose the port target
   - separate frontend and backend hosting
   - combined full-stack server
   - containerized deployment
   - platform-specific deployment (Render, Fly, Railway, VPS, static host)

2. Review repository structure and build flow
   - confirm `frontend/` is a Vite static app
   - confirm `backend/` is Express + Prisma API
   - note the root scripts: `dev`, `build`, `start`, `serve`

3. Verify backend readiness
   - check `backend/src/index.js` and middleware for production port/config usage
   - ensure environment variables are documented and required values are clear
   - confirm Prisma setup and database strategy (`SQLite` vs production DB)
   - verify Stripe and auth secrets are not committed
   - ensure CORS and `FRONTEND_URL` are configured for the target host

4. Verify frontend readiness
   - confirm `frontend/src` uses the correct API base URL for the chosen port target
   - confirm build command `npm run build` succeeds
   - confirm static host compatibility for `frontend/dist`
   - if frontend and API are separated, verify runtime URL and CORS requirements

5. Validate environment and config
   - list required environment variables for runtime
   - identify any host-specific values such as `DATABASE_URL`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `FRONTEND_URL`
   - identify development-only scripts and local-only tools

6. Review deployment and platform files
   - inspect `backend.Dockerfile`, `frontend.Dockerfile`, `render.yaml`, `fly-backend.toml`, `fly-frontend.toml`
   - decide whether to use existing platform manifests or simplify for the new host
   - confirm build and start commands match the target environment

7. Create a porting checklist and action plan
   - environment variables to set in the target host
   - host-specific configuration changes to make
   - runtime commands to use after deployment
   - any required migration or data persistence changes for SQLite

## Completion criteria

- `npm install` works in both `frontend/` and `backend/`
- `npm run build` produces a valid frontend `dist`
- backend starts successfully with required env vars
- frontend and backend can connect using the target runtime URLs
- deployment config files are aligned with the chosen target
- the port plan clearly documents the host, command flow, and required secrets

## Example prompts

- `Use ready-to-port to audit this repo and return a porting checklist for Render.`
- `Run the port readiness workflow for a combined frontend/backend deployment.`
- `Review this project and tell me what to change before porting to Fly.`
