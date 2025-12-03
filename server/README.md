# E-commerce Catalog Server

This is a simple Node.js + Express server for managing categories, products and image uploads.

## Quick start

1. Copy `.env.example` to `.env` and set `MONGODB_URI`.
2. Install deps:

```bash
cd server
npm install
```

3. Seed data (optional):

```bash
npm run seed
```

4. Start server:

```bash
npm run dev
# or npm start
```
Run tests:

```bash
npm test
```


## Endpoints

- GET /api/categories
- POST /api/categories
- PUT /api/categories/:id
- DELETE /api/categories/:id

- GET /api/products?page=1&limit=12&q=search&category=<id>
- GET /api/products/slug/:slug
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id

- POST /api/uploads/products -> field name 'images' (multipart)

- GET /api/admin/summary -> { totalProducts, totalCategories, lowStock }
 - GET /api/public/products -> public listing (pagination + filters)
 - GET /api/public/products/:slug -> product detail by slug

Files are served at `/uploads/<filename>`
## Admin

There is an auth system for admin routes. Seed script will create a default admin user `admin@example.com` with password from the `ADMIN_PASSWORD` env variable (or `password` by default). Use `/api/auth/login` to obtain a JWT, which you should set in the client using the login form.


Example: Upload images using curl

```bash
curl -F "images=@./image1.jpg" -F "images=@./image2.jpg" http://localhost:4000/api/uploads/products
```
