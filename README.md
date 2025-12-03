# E-commerce Catalog (Starter)

This is a compact full-stack e-commerce catalog starter that includes an Admin panel and a simple public storefront.

## Quick start

1. Install server deps and run:
```bash
cd server
npm install
cp .env.example .env # update if needed
npm run seed  # optional: seed sample data
npm run dev
```

2. Install client deps and run:
```bash
cd client
npm install
npm run dev
# open http://localhost:3000
```

API server runs on http://localhost:4000 by default.

## Features
- Category & Product CRUD (admin side)
- Image upload endpoint using Multer
- Public product listing and product detail pages
- Seed script for sample data

## Next steps / Optional features
- Add auth (JWT) for admin routes
- Add Cart & Checkout UI
- Add tests
- Styling (Tailwind CSS)


