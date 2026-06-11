Production export bundle for Centre Formation Oujda.

Backend: build-export\backend
Frontend: build-export\frontend-dist

To deploy backend: install dependencies in build-export\backend and run npm start.
To deploy frontend: serve build-export\frontend-dist as static files or host on a static CDN.

Required env vars: JWT_SECRET, DATABASE_URL, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, FRONTEND_URL
