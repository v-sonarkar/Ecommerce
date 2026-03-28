# Ecommerce

Monorepo for a full-stack ecommerce application with three parts:

- `backend`: Express API with MongoDB, JWT auth, Cloudinary image uploads, and Stripe/Razorpay payment hooks.
- `frontend`: Customer storefront built with React and Vite.
- `admin/admin`: Admin dashboard built with React and Vite for managing products and orders.

## Tech stack

- Frontend: React, Vite, React Router, Tailwind CSS, Axios
- Admin: React, Vite, React Router, Axios, Tailwind CSS
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Cloudinary, Stripe, Razorpay

## Project structure

```text
Ecommerce/
├── backend/         # Express.js API server
│   ├── config/      # Database and Cloudinary config
│   ├── controllers/ # Route handler logic (user, product, cart, order)
│   ├── middleware/  # Auth, file upload, and request middleware
│   ├── models/      # Mongoose models (User, Product, Order)
│   ├── routes/      # Express route definitions
│   ├── uploads/     # Uploaded product images
│   ├── package.json # Backend dependencies and scripts
│   └── server.js    # API entry point
│
├── frontend/        # Customer-facing React app
│   ├── public/      # Static assets
│   ├── src/
│   │   ├── assets/      # Images, icons, etc.
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React context providers
│   │   ├── pages/       # Route-based pages
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── package.json     # Frontend dependencies and scripts
│   └── index.html       # HTML template
│
└── admin/
    └── admin/       # Admin dashboard React app
        ├── public/      # Static assets
        ├── src/
        │   ├── assets/      # Images, icons, etc.
        │   ├── Components/  # Admin UI components
        │   ├── Pages/       # Admin pages (products, orders, login)
        │   ├── App.jsx      # Main admin app component
        │   └── main.jsx     # Entry point
        ├── package.json     # Admin dependencies and scripts
        └── index.html       # HTML template
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB connection string
- Cloudinary account
- Stripe account for card payments
- Razorpay account if that payment flow is enabled

## Environment variables

Create local `.env` files as needed.

### `backend/.env`

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### `frontend/.env`

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### `admin/admin/.env`

```env
VITE_BACKEND_URL=http://localhost:4000
```

## Install dependencies

Run these commands from the repository root:

```powershell
cd backend
npm install

cd ..\frontend
npm install

cd ..\admin\admin
npm install
```

## Run locally

Start each app in a separate terminal.

### 1. Backend API

```powershell
cd backend
npm run dev
```

The API runs on `http://localhost:4000` by default.

### 2. Storefront

```powershell
cd frontend
npm run dev
```

### 3. Admin dashboard

```powershell
cd admin\admin
npm run dev
```

## Available scripts

### Backend

- `npm run dev`
- `npm start`

### Frontend

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

### Admin

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

## Main features

- Product listing and product detail pages
- Cart and checkout flow
- User login and order history
- Admin login, product management, and order management
- Image upload support through Cloudinary
- Payment integration hooks for Stripe and Razorpay

## Notes

- `.env` files are ignored by git in this repository.
- The backend CORS configuration currently allows local Vite origins on ports `5173` through `5176`.
