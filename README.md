# 🛒 Suvidha Mart — Full-Stack Grocery E-Commerce Platform

A production-ready, full-stack grocery and essentials e-commerce application built with **Next.js (App Router)**, **React**, **Node.js API Routes**, and **MongoDB (Mongoose)**.

---

## 🌟 Key Features

### 🛍️ Customer Experience
- **Product Catalog & Search**: Instant real-time filtering by category, search query, and sorting (price, rating, name).
- **Cart & Wishlist**: Persistent cart with quantity controls and real-time total calculation.
- **Seamless Checkout**: Address validation and Cash-on-Delivery (COD) / instant order placement.
- **Customer Account & Orders**: Real-time order tracking (`pending`, `processing`, `shipped`, `delivered`), profile management, and order history.

### 🛡️ Confidential Admin Portal
- **Dedicated Route**: Located securely at [`/admin/login`](http://localhost:3000/admin/login) (hidden from public customer view).
- **Store Dashboard**: Live revenue metrics, total orders, active customer counts, and category distribution.
- **Product Management**: Add, update pricing/stock, and delete products in real time.
- **Order Management**: Update live order fulfillment stages.
- **Customer Insights**: View all registered customers, order history, and spending analytics.

---

## 🏗️ Architecture

```
suvidha-mart/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # RESTful API Backend Handlers
│   │   │   ├── auth/             # /api/auth/register, /api/auth/login, /api/auth/me
│   │   │   ├── products/         # /api/products (GET, POST), /api/products/[id] (PUT, DELETE)
│   │   │   ├── categories/       # /api/categories (GET, POST, DELETE)
│   │   │   ├── orders/           # /api/orders (GET, POST), /api/orders/[id] (PATCH)
│   │   │   ├── users/            # /api/users, /api/users/profile
│   │   │   └── seed/             # /api/seed (Auto-seeds initial catalog & admin)
│   │   ├── admin/                # Admin Portal & Sub-routes
│   │   ├── auth/                 # Customer Login & Signup
│   │   ├── cart/                 # Cart Page
│   │   ├── checkout/             # Checkout Flow
│   │   ├── orders/               # Customer Order Tracking
│   │   ├── products/             # Product Catalog & Detail Pages
│   │   └── profile/              # Customer Profile
│   ├── context/                  # React Context State Layer
│   │   ├── AuthContext.js        # Authentication & JWT Management
│   │   ├── ProductContext.js     # Catalog & Categories State
│   │   ├── CartContext.js        # Cart State
│   │   ├── OrderContext.js       # Orders State
│   │   └── WishlistContext.js    # Wishlist State
│   ├── models/                   # Mongoose Database Schemas
│   │   ├── User.js               # Customers & Admin
│   │   ├── Product.js            # Products
│   │   ├── Category.js           # Categories
│   │   └── Order.js              # Customer Orders
│   └── lib/
│       ├── mongodb.js            # Cached Serverless MongoDB Connection
│       ├── auth.js               # JWT & bcrypt utilities
│       └── data.js               # Seed & mock data
```

---

## 🚀 Getting Started (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your MongoDB Atlas URI (or leave blank to use local fallback during initial test):
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/suvidhamart?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters
```

### 3. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ How to Set Up a Free Database (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Click **Create a Deployment** and select the **M0 Free Tier** cluster.
3. Under **Security → Database Access**, create a user (e.g. `admin`) with a secure password.
4. Under **Security → Network Access**, add IP address `0.0.0.0/0` (Allow access from anywhere, required for Vercel serverless hosting).
5. Click **Connect → Drivers**, copy the connection string, and replace `<password>` with your database user password:
   ```
   mongodb+srv://admin:yourpassword@cluster0.abcde.mongodb.net/suvidhamart?retryWrites=true&w=majority
   ```
6. Paste this URI into your `MONGODB_URI` environment variable.
7. **Auto-Seed**: The database will automatically seed itself with products, categories, demo users, and orders the first time you launch the app!

---

## 🌐 Deploying to Vercel (1-Click Deployment)

1. Push your repository to **GitHub**.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `suvidha-mart` repository.
4. In the **Environment Variables** section, add:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure random secret string.
5. Click **Deploy**.
6. That's it! Vercel will build and host your frontend and serverless API backend with zero configuration.

---

## 🔑 Default Credentials

### Administrator Portal
- **URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `admin@suvidhamart.com`
- **Password**: `admin123`

### Demo Customer Accounts
- **Rahul Sharma**: `rahul@example.com` / `rahul123`
- **Priya Patel**: `priya@example.com` / `priya123`
- **Amit Verma**: `amit@example.com` / `amit123`
