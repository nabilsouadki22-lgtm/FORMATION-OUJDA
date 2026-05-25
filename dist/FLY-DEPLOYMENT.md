# Fly.io Deployment Guide

## Prerequisites
1. Create a free account at https://fly.io
2. Install Fly CLI: https://fly.io/docs/hands-on/install-flyctl/
3. Log in: `flyctl auth login`

## Deployment Steps

### 1. Deploy Backend

```bash
# Navigate to project root
cd C:\xampp\php\htdocs\CentreFormationOujda

# Create and deploy backend app (use fly-backend.toml)
flyctl launch --config fly-backend.toml --no-deploy

# Set secrets (replace with your actual keys)
flyctl secrets set -a formation-oujda-backend \
  JWT_SECRET="your-secure-random-key-here" \
  STRIPE_SECRET_KEY="sk_test_your_key" \
  STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret" \
  FRONTEND_URL="https://formation-oujda-frontend.fly.dev"

# Deploy
flyctl deploy --config fly-backend.toml

# Get backend URL
flyctl status -a formation-oujda-backend
```

### 2. Deploy Frontend

```bash
# Create and deploy frontend app (use fly-frontend.toml)
flyctl launch --config fly-frontend.toml --no-deploy

# Set environment variable with backend URL
flyctl secrets set -a formation-oujda-frontend \
  VITE_API_URL="https://formation-oujda-backend.fly.dev"

# Deploy
flyctl deploy --config fly-frontend.toml

# Get frontend URL
flyctl status -a formation-oujda-frontend
```

### 3. Update Backend Environment Variable

Once you have the frontend URL from step 2, update the backend:

```bash
flyctl secrets set -a formation-oujda-backend \
  FRONTEND_URL="https://formation-oujda-frontend.fly.dev"
```

## URLs After Deployment

- **Backend**: https://formation-oujda-backend.fly.dev
- **Frontend**: https://formation-oujda-frontend.fly.dev

## For Production

Before going live, update:
- `JWT_SECRET` — with a secure random string (at least 32 characters)
- `STRIPE_SECRET_KEY` — with your real Stripe key (not test key)
- `STRIPE_WEBHOOK_SECRET` — with your real webhook secret

Update secrets:
```bash
flyctl secrets set -a formation-oujda-backend \
  JWT_SECRET="your-new-secure-key" \
  STRIPE_SECRET_KEY="sk_live_your_real_key"
```

## Monitoring

View logs:
```bash
flyctl logs -a formation-oujda-backend
flyctl logs -a formation-oujda-frontend
```

Scale apps:
```bash
flyctl scale vm dedicated-cpu-1x -a formation-oujda-backend
flyctl scale count 2 -a formation-oujda-frontend  # 2 instances
```

## Free Tier Limits

- 3 shared-cpu-1x 256MB VMs
- 3 GB persistent storage per app
- 160 GB outbound data transfer per month

Good enough for development/testing!
