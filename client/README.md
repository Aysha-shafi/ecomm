# E-commerce Catalog Client

A simple React + Vite client to manage admin and public storefront pages.

## Quick start

```bash
cd client
npm install
npm run dev # opens http://localhost:3000
```

This client expects the server to run on http://localhost:4000 (proxy is configured in vite.config.js). If you run the server on another port, change the proxy accordingly.

If you prefer not to rely on Vite proxy, you may set `VITE_API_URL` environment variable in `client/.env` with the backend URL, for example `VITE_API_URL=http://localhost:4000`.

Pages:
- /admin/categories -> CRUD for categories
- /admin/products -> CRUD for products + image uploads
- / -> public product listing
- /products/:slug -> product detail

