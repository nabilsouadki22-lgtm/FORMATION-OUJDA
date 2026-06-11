# Centre Formation Oujda — Deployment Guide

## Current Status ✅

Your app is **fully prepared for deployment**:

- ✅ Frontend built and optimized (`npm run build` completed)
- ✅ Backend dependencies installed
- ✅ Docker containers configured
- ✅ Deployment configs ready (Fly.io & Render)
- ✅ Environment variables documented

---

## Deployment Options

### Option 1: Render.com (Recommended for Free Tier) 🚀

Render offers a **free tier** with no payment method required initially.

#### Steps:

1. **Push your code to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/your-repo.git
   git branch -M main
   git push -u origin main
   ```

2. **Connect to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click **New** → **Blueprint**
   - Select your GitHub repository
   - Render will automatically detect `render.yaml` and deploy both services

3. **Configure Environment Variables in Render Dashboard**
   - Backend service: Add `JWT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `DATABASE_URL`
   - Frontend service: Ensure `VITE_API_BASE` points to your backend URL

4. **Public URLs**
   - Backend: `https://centre-formation-oujda-backend.onrender.com`
   - Frontend: `https://centre-formation-oujda-frontend.onrender.com`

---

### Option 2: Fly.io (After adding payment) 💳

Once you add a payment method to Fly.io:

#### Steps:

1. **Add Payment Method**
   - Visit: https://fly.io/dashboard/nabil-souadki22-ump-ac-ma/billing
   - Add credit card (Fly.io provides free credits monthly)

2. **Deploy Backend**
   ```powershell
   cd c:\xampp\php\htdocs\CentreFormationOujda
   flyctl deploy --config fly-backend.toml
   ```

3. **Deploy Frontend**
   ```powershell
   flyctl deploy --config fly-frontend.toml
   ```

4. **Public URLs**
   - Backend: `https://CentreFormationOujda-backend.fly.dev`
   - Frontend: `https://CentreFormationOujda-frontend.fly.dev`

---

## Environment Variables

### Backend (.env)
```
JWT_SECRET=your-secure-random-secret
DATABASE_URL=file:/data/dev.db
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
FRONTEND_URL=https://your-frontend-url.com
```

### Frontend (.env)
```
VITE_API_BASE=https://your-backend-url.com
```

---

## Files Ready for Deployment

| File | Purpose |
|------|---------|
| `fly-backend.toml` | Fly.io backend config (region: Ashburn, VA) |
| `fly-frontend.toml` | Fly.io frontend config (region: Ashburn, VA) |
| `render.yaml` | Render blueprint (free tier) |
| `backend.Dockerfile` | Backend container (Node 18 Alpine) |
| `frontend.Dockerfile` | Frontend container (Vite + Serve) |
| `frontend/dist/` | Built frontend ready to serve |

---

## Quick Commands

### Build Frontend
```bash
npm --prefix frontend run build
```

### Test Locally Before Deploying
```bash
npm run dev:windows        # Local dev mode
npm run public:windows     # Expose with LocalTunnel
```

### Deploy to Fly.io
```bash
cd c:\xampp\php\htdocs\CentreFormationOujda
flyctl deploy --config fly-backend.toml
flyctl deploy --config fly-frontend.toml
```

### Deploy to Render
1. Push to GitHub
2. Connect repo to Render Dashboard
3. Render will auto-deploy from `render.yaml`

---

## Domain Setup

Once deployed, you can:

1. **Map custom domain** (e.g., `www.centreformationoujda.com`)
   - Render: Add custom domain in service settings
   - Fly.io: Use `flyctl certs create`

2. **Update DNS records** to point to your deployment

---

## Support & Troubleshooting

- **Fly.io Issues**: `flyctl status -a app-name`
- **Render Issues**: Check deployment logs in Render Dashboard
- **Local Testing**: `npm run dev:windows` then visit `http://localhost:5173`

---

## Next Steps

1. **Immediate (free)**:
   - Push code to GitHub
   - Deploy to Render
   - Share public frontend URL

2. **Later (optional payment)**:
   - Add payment to Fly.io
   - Deploy backend API separately
   - Map custom domain

---

**Generated:** 2026-06-11 | **App Version:** 0.1.0
