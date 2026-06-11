# Centre Formation Oujda — Backend

Quick scaffold for the Centre Formation Oujda backend.

Setup

1. Install dependencies:

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

2. Seed sample products:

```bash
curl -X POST http://localhost:4000/api/products/seed
```

3. To use admin order endpoints, set `isAdmin` to `true` for a user in your database using Prisma Studio or a direct update.

```bash
npx prisma studio
```

Then call admin endpoints at `/api/admin/orders` with an admin user's Bearer token.


## Initial demo data

The backend now seeds demo data at startup when the database is empty:

- Products are created automatically.
- A default admin user is created if none exists:
  - email: `admin@centreoujda.com`
  - password: `Admin123!`
- A default teacher user and sample courses are created automatically.
