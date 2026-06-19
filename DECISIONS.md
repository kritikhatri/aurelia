# Aurelia — Technical & Architectural Decisions

This document details key engineering decisions made during the construction of the **Aurelia** e-commerce platform.

---

## 1. Naming: Aurelia over GlowVerse
We chose **Aurelia** (derived from the Latin word for "golden") instead of "GlowVerse". GlowVerse sounds web3/tech-heavy. "Aurelia" is softer, evokes editorial skincare aesthetics, and coordinates with our champagne gold and deep plum branding.

---

## 2. File Upload Strategy: Dual-Mode Engine
- **Problem**: Cloudinary is required for image uploads, but requiring developer-specific credentials causes setup friction.
- **Solution**: We created a custom utility in `server/src/config/cloudinary.js` that checks for environment variables.
  - If `CLOUDINARY_CLOUD_NAME` is missing, the service transparently switches to **Local Storage Mode**.
  - It saves uploads into `server/public/uploads/` and generates static URLs (e.g. `http://localhost:5000/uploads/filename.jpg`).
  - This ensures that image uploads in product creation, community posts, and review images work right out of the box.

---

## 3. Payment Gateway: Stripe Checkout + Simulator
- **Problem**: Stripe requires secret keys. If missing, checkout crashes.
- **Solution**: The order controller checks for `STRIPE_SECRET_KEY`.
  - If present, it creates a real Stripe checkout session.
  - If missing, it prints a console warning, creates a mock `paymentIntentId`, and returns a simulated success redirect payload.
  - The client dashboard displays warning alerts showing "Stripe Simulator Mode Enabled" so the tester knows no real API calls were made.

---

## 4. State Management Splits
- **Zustand**: Used for high-frequency client-side state:
  - User cart items (synced with LocalStorage for guests).
  - Auth token states.
  - Dark/light mode theme selection.
- **React Query (TanStack Query)**: Used for server-side state (products, reviews, blogs, admin analytics) to manage cache invalidation and loading skeletons easily.

---

## 5. Token Authentication Pattern
We implement a robust Access Token (JSON body, short lifespan, ~15m) + Refresh Token (HttpOnly Cookie, long lifespan, ~30d) flow:
- Access tokens are passed as `Bearer` headers in requests.
- When an API request fails with a 401, a client Axios interceptor automatically requests a token refresh `/api/auth/refresh` using the cookie.
- If successful, it retries the original request; if not, it logs out the user.

---

## 6. Monorepo Structure
We relocated the root level Vite configuration to `/client` to create a clean, standardized monorepo structure:
- `/client` (React front-end)
- `/server` (Express backend)
- Root contains system orchestrators: `docker-compose.yml`, `README.md`, `BRAND.md`, `DECISIONS.md`.
