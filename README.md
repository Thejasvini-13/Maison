# MAISON LUNE — Beauty & Style Store

An elegant, responsive ecommerce starter for women's beauty, skincare, makeup and fashion. Built with a React/JavaScript frontend and Node.js/Express backend.

## Features
- Editorial luxury storefront with responsive layout
- Product collection cards, category filters and search
- Wishlist toggles and quick add-to-bag interactions
- Cart drawer with quantity controls, subtotal and free-shipping progress
- Newsletter signup feedback
- Express API for product catalogue, categories and demo checkout
- Accessible buttons, mobile navigation and polished hover states

## Tech stack
- Frontend: React, Vite, plain JavaScript, CSS
- Backend: Node.js, Express
- Product images: Unsplash image URLs
- Data: sample in-memory catalogue (no database required to run)

## Run locally
Requires Node.js 18+.

```bash
npm install
npm run install:all
npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:5000/api/products

## API routes
- `GET /api/health` — server status
- `GET /api/products` — list products; optional `?category=Beauty` and `?search=serum`
- `GET /api/categories` — available categories
- `POST /api/checkout` — validates a demo order and returns a confirmation (no real payment is processed)
- `POST /api/newsletter` — demo newsletter signup

## Production notes
This is a polished starter/demo, not a production payment system. Before launch, connect a database, authentication, inventory, shipping, email provider and a payment gateway such as Razorpay or Stripe. Never store card details directly.
