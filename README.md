# LUXE — Full-Stack E-Commerce Application

A complete, production-ready e-commerce platform built with React, Node.js/Express, and PostgreSQL.

---

## 🏗 Project Structure

```
ecommerce/
├── backend/                  # Node.js + Express REST API
│   ├── config/
│   │   ├── db.js             # PostgreSQL connection
│   │   └── schema.sql        # Database schema + seed data
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── auth.js           # JWT auth + admin guard
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   ├── payments.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/                 # React SPA
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   └── ProductCard.js
│   │   ├── context/
│   │   │   └── AppContext.js  # Auth + Cart global state
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── ProductsPage.js
│   │   │   ├── ProductDetailPage.js
│   │   │   ├── CartPage.js
│   │   │   ├── CheckoutPage.js
│   │   │   ├── AuthPages.js
│   │   │   ├── OrdersPage.js
│   │   │   ├── ProfilePage.js
│   │   │   └── AdminDashboard.js
│   │   ├── services/
│   │   │   └── api.js         # Axios API client
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── package.json              # Root with run scripts
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+
- **PostgreSQL** v14+
- **npm** v9+

---

### Step 1 — Database Setup

```bash
# Log into PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE ecommerce_db;
\q

# Run the schema (creates all tables + seeds sample data)
psql -U postgres -d ecommerce_db -f backend/config/schema.sql
```

---

### Step 2 — Backend Setup

```bash
cd backend

# Copy env file and configure it
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/ecommerce_db
JWT_SECRET=your_super_secret_key_change_this_in_production
FRONTEND_URL=http://localhost:3000
```

```bash
# Install dependencies
npm install

# Start the backend server
npm start
# or for development with auto-reload:
npm run dev
```

Backend runs at: **http://localhost:5000**

---

### Step 3 — Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the React app
npm start
```

Frontend runs at: **http://localhost:3000**

---

## 🔑 Default Credentials (from seed data)

| Role  | Email             | Password |
|-------|-------------------|----------|
| Admin | admin@shop.com    | password |
| User  | john@example.com  | password |

> ⚠️ Change these passwords immediately in production!

---

## 🌐 API Reference

### Authentication
| Method | Endpoint           | Description       | Auth |
|--------|--------------------|-------------------|------|
| POST   | /api/auth/register | Register new user | ❌   |
| POST   | /api/auth/login    | Login             | ❌   |
| GET    | /api/auth/me       | Get current user  | ✅   |

### Products
| Method | Endpoint             | Description         | Auth  |
|--------|----------------------|---------------------|-------|
| GET    | /api/products        | List products       | ❌    |
| GET    | /api/products/:id    | Get product         | ❌    |
| GET    | /api/products/featured | Featured items   | ❌    |
| GET    | /api/products/categories | Categories    | ❌    |
| POST   | /api/products        | Create product      | Admin |
| PUT    | /api/products/:id    | Update product      | Admin |
| DELETE | /api/products/:id    | Delete product      | Admin |

**Query Parameters for GET /api/products:**
- `category` — filter by category name
- `search` — full-text search
- `sort` — `price_asc`, `price_desc`, `rating`, `newest`
- `page` — page number (default: 1)
- `limit` — items per page (default: 12)

### Cart
| Method | Endpoint             | Description      | Auth |
|--------|----------------------|------------------|------|
| GET    | /api/cart            | Get user's cart  | ✅   |
| POST   | /api/cart            | Add item         | ✅   |
| PUT    | /api/cart/:productId | Update quantity  | ✅   |
| DELETE | /api/cart/:productId | Remove item      | ✅   |
| DELETE | /api/cart/clear      | Clear all        | ✅   |

### Orders
| Method | Endpoint              | Description         | Auth  |
|--------|-----------------------|---------------------|-------|
| POST   | /api/orders           | Create order        | ✅    |
| GET    | /api/orders/my        | My orders           | ✅    |
| GET    | /api/orders/:id       | Order detail        | ✅    |
| GET    | /api/orders/all       | All orders          | Admin |
| PUT    | /api/orders/:id/status | Update status      | Admin |

### Admin
| Method | Endpoint            | Description         | Auth  |
|--------|---------------------|---------------------|-------|
| GET    | /api/admin/dashboard | Stats + analytics  | Admin |
| GET    | /api/admin/users    | All users           | Admin |

### Users
| Method | Endpoint                   | Description        | Auth |
|--------|----------------------------|--------------------|------|
| PUT    | /api/users/profile         | Update profile     | ✅   |
| GET    | /api/users/wishlist        | Get wishlist       | ✅   |
| POST   | /api/users/wishlist        | Add to wishlist    | ✅   |
| DELETE | /api/users/wishlist/:id    | Remove from wish.  | ✅   |

---

## 🎨 Frontend Pages

| Page              | Route              | Description                   |
|-------------------|--------------------|-------------------------------|
| Home              | `/`                | Hero, featured, categories    |
| Products          | `/products`        | Grid with filter + search     |
| Product Detail    | `/products/:id`    | Images, details, add to cart  |
| Cart              | `/cart`            | Review + update cart          |
| Checkout          | `/checkout`        | Shipping + payment            |
| Login             | `/login`           | JWT authentication            |
| Register          | `/register`        | Create new account            |
| My Orders         | `/orders`          | Order history + tracking      |
| Order Detail      | `/orders/:id`      | Full order info               |
| Profile           | `/profile`         | Edit user info                |
| Admin Dashboard   | `/admin`           | Stats, orders, users mgmt     |

---

## 🗄 Database Schema

### Tables
- **users** — id, name, email, password, role, phone, address, avatar_url, created_at
- **products** — id, name, description, price, category, stock, image_url, rating, review_count, is_featured, created_at
- **carts** — id, user_id, product_id, quantity, created_at
- **orders** — id, user_id, total_amount, status, shipping_address, created_at
- **order_items** — id, order_id, product_id, quantity, price
- **payments** — id, order_id, amount, payment_method, payment_status, transaction_id, created_at
- **reviews** — id, user_id, product_id, rating, comment, created_at
- **wishlist** — id, user_id, product_id, created_at

### Relationships
```
users    1──*  orders
users    1──*  carts
users    1──*  wishlist
users    1──*  reviews
orders   1──*  order_items
orders   1──1  payments
products 1──*  order_items
products 1──*  carts
products 1──*  wishlist
products 1──*  reviews
```

---

## 🔐 Security Features

- **bcryptjs** — Password hashing (salt rounds: 10)
- **JWT** — Stateless authentication (7-day expiry)
- **Role-based access** — User vs Admin routes
- **SQL injection prevention** — Parameterized queries
- **CORS** — Configured for frontend origin only
- **Input validation** — Required field checks on API

---

## ⚡ Performance Features

- PostgreSQL **indexes** on frequently queried columns
- **Pagination** on product listings
- **Sticky cart sidebar** to reduce re-renders
- **Lazy image loading** via native browser
- **Optimistic UI** updates on cart operations
- **CSS animations** with `animation-delay` stagger

---

## 🛠 Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, React Router v6, Context API  |
| Styling    | Custom CSS (no CSS framework)           |
| Charts     | Recharts                                |
| HTTP       | Axios                                   |
| Toasts     | React Hot Toast                         |
| Backend    | Node.js, Express                        |
| Auth       | JWT (jsonwebtoken), bcryptjs            |
| Database   | PostgreSQL with `pg` driver             |
| Dev Tools  | nodemon, concurrently                   |

---

## 🌍 Deployment

### Backend (e.g. Railway / Render)
1. Set environment variables from `.env.example`
2. Provision a PostgreSQL database
3. Run `npm start`

### Frontend (e.g. Vercel / Netlify)
1. Set `REACT_APP_API_URL=https://your-backend-url.com/api`
2. Run `npm run build`
3. Deploy the `build/` folder

---

## 📦 Sample Products Included

The seed data includes 12 products across 6 categories:
- Electronics (headphones, fitness band, portable charger, speaker)
- Accessories (watch, sunglasses)
- Footwear (running sneakers, canvas shoes)
- Bags (leather backpack)
- Home (coffee mug, desk lamp)
- Sports (yoga mat)

---

## 📝 License

MIT License — free to use, modify, and distribute.
