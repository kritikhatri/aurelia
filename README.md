# ⚜️ Aurelia — Luxury Beauty E-Commerce Platform

Aurelia is a **complete, production-ready, deployable** luxury beauty e-commerce platform built as a Node/Express and React/Vite monorepo. It features high-end editorial aesthetics (glassmorphism UI, theme sync), an AI Skin Finder quiz, interactive AM/PM routine diaries, makeup expiration tracking, tiered membership subscription boxes, and a fully equipped Recharts admin console.

---

## 📂 Project Architecture

```
aurelia/ (workspace root)
├── client/              # React 18 + Vite + Tailwind CSS + Framer Motion
├── server/              # Node.js + Express.js + Mongoose (MongoDB)
├── BRAND.md             # Editorial brand guides (palette, typography, tone)
├── DECISIONS.md         # Engineering decisions log (Stripe simulator, dual uploader)
└── README.md            # Setup and deployment manual (this file)
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Tailwind CSS, Framer Motion, Zustand (State), TanStack Query v5 (Caching), Axios, Sonner (Toasts), Recharts |
| **Backend** | Node.js, Express.js, MongoDB + Mongoose, JWT (Access + Refresh Cookie), Bcrypt, Multer, Node-Cron, Express-Rate-Limit, Helmet, Cors, Stripe SDK |
| **DevOps / Infra** | Docker, Docker Compose, GitHub Actions CI Workflow, Vercel configuration, Render blueprints |

---

## 🚀 Quick Start (Local Run)

### 1. Prerequisites
- **Node.js** (v18 or higher)
- No local database is required! If a local MongoDB instance is missing, the backend will automatically spin up an **In-Memory MongoDB Server** and seed itself.

### 2. Manual Setup

#### Step A: Run the Backend API
1. Navigate to the `/server` folder:
   ```bash
   cd server
   ```
2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
   *Logs will show: `Server running in development mode on port 5500`*

#### Step B: Run the Frontend Client
1. Open a **new terminal window** and navigate to `/client`:
   ```bash
   cd client
   ```
2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the Vite server:
   ```bash
   npm run dev
   ```
   *Open the URL shown in your terminal (typically `http://localhost:5173` or `http://localhost:5174`)*

---

## 🔑 Test Credentials
Once the site is open, you can log in directly using these pre-seeded test accounts:

* **Administrator Account** (Grants access to the Admin Panel routes):
  - **Email**: `admin@aurelia.com`
  - **Password**: `admin123`
* **Customer Account** (For order checking, routine building, and quiz logs):
  - **Email**: `customer@aurelia.com`
  - **Password**: `customer123`

---

## 📝 Environment Variables Configuration

### Backend Config (`server/.env`)
- `PORT`: Port the server runs on (Default: `5500`)
- `MONGO_URI`: MongoDB connection URL (Falls back to Memory Server if empty)
- `JWT_ACCESS_SECRET`: Secret key for signing short-lived Access Tokens
- `JWT_REFRESH_SECRET`: Secret key for signing HttpOnly Refresh Cookies
- `JWT_ACCESS_EXPIRES`: Access Token lifespan (Default: `15m`)
- `JWT_REFRESH_EXPIRES`: Refresh Token lifespan (Default: `30d`)
- `STRIPE_SECRET_KEY`: Stripe Private Key (Falls back to Stripe Simulator if empty)
- `CLIENT_URL`: URL pointing to the client app (Default: `http://localhost:5173`)

### Frontend Config (`client/.env`)
- `VITE_API_BASE_URL`: URL pointing to the backend API endpoints (Default: `http://localhost:5500/api`)

---

## ✨ Advanced Features & Workflows

1. **AI Skin Finder Quiz**: Takes users through an animated 3-step skincare evaluation, saves their skin type to their profile, and serves matching recommendations.
2. **Virtual AM/PM Routine Diary**: Allows users to sequence catalog formulas, append notes (e.g. *Apply on damp skin*), and schedule reminder alerts.
3. **Makeup Collection Tracker**: Monitors shelf life and opened dates for cosmetics, displaying warnings for items nearing expiration.
4. **Subscription Box Builder**: Allows selection of Essential ($29.99/mo), Signature ($49.99/mo), or Prestige ($89.99/mo) beauty boxes with cron-job simulated billing.
5. **Rewards & Referrals Dashboard**: Automatically credits 1 point per $1 spent. Users can share their unique referral link to award points to themselves and their friends.
6. **Recharts Admin Console**: Provides analytics timelines showing daily sales, product CRUD management, promo coupon creations, and community comment moderation.
