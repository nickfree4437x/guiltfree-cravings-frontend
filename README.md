# GuiltFree Cravings — Frontend

A modern, responsive e-commerce frontend for **GuiltFree Cravings**, a homemade sweets and healthy treats brand.

The website is designed to provide a clean, premium and user-friendly shopping experience while highlighting the brand's focus on honest ingredients, traditional recipes and guilt-free indulgence.

---

## ✨ Features

### 🛍️ Shopping Experience

- Responsive homepage
- Featured products section
- Product listing
- Product detail pages
- Product variants and pricing
- Product quantity selection
- Add to cart functionality
- Cart management
- Checkout flow
- Order review
- Payment flow
- Order confirmation

### 👤 Customer Account

- Customer authentication using mobile OTP
- Account/profile management
- Verified mobile number
- Email management
- Customer profile updates
- My Orders access

### 🔐 Authentication

- OTP-based customer authentication
- JWT authentication support
- Protected account routes
- Persistent authentication state
- Secure API requests with authorization headers

### 🎨 UI / UX

- Responsive design
- Mobile-first layout
- Clean and minimal visual style
- Warm, premium brand aesthetic
- Smooth hover and transition effects
- Accessible form controls
- Loading and error states
- Responsive navigation
- Persistent Navbar and Footer across pages

### 🛒 Checkout

The frontend supports a complete shopping flow:

```text
Browse Products
      ↓
Product Details
      ↓
Add to Cart
      ↓
Cart
      ↓
Checkout
      ↓
Review Order
      ↓
Payment
      ↓
Order Confirmation
🧰 Tech Stack
Frontend
React
TypeScript
Vite
Tailwind CSS
React Router
Axios
State Management
Zustand
API Communication
Axios
REST API integration
Backend Integration

The frontend communicates with the GuiltFree Cravings backend through REST APIs.

📁 Project Structure
frontend/
│
├── public/
│
├── src/
│   │
│   ├── api/
│   │   ├── authApi.ts
│   │   ├── orderApi.ts
│   │   ├── productApi.ts
│   │   └── userApi.ts
│   │
│   ├── components/
│   │
│   ├── data/
│   │   └── products.ts
│   │
│   ├── pages/
│   │   ├── home-page/
│   │   ├── product-details/
│   │   ├── cart-page/
│   │   ├── check-out/
│   │   ├── review-order/
│   │   ├── payment-page/
│   │   ├── account/
│   │   ├── profile/
│   │   └── admin/
│   │
│   ├── product/
│   │   └── ProductCard.tsx
│   │
│   ├── store/
│   │   ├── authStore.ts
│   │   └── ...
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
🚀 Getting Started
1. Clone the repository
git clone https://github.com/YOUR_USERNAME/guiltfree-cravings-frontend.git
2. Navigate to the project
cd guiltfree-cravings-frontend
3. Install dependencies
npm install
4. Configure environment variables

Create a .env file in the project root:

VITE_API_URL=http://localhost:5000/api

For production, replace the API URL with the deployed backend API URL.

▶️ Run Development Server
npm run dev

The application will normally be available at:

http://localhost:5173
🏗️ Production Build

To create a production build:

npm run build

To preview the production build locally:

npm run preview
🔑 Environment Variables
Variable	Description
VITE_API_URL	Base URL of the backend API

Example:

VITE_API_URL=http://localhost:5000/api
🧭 Application Routes
Customer Routes
Route	Description
/	Homepage
/products/:id	Product details
/cart	Shopping cart
/checkout	Checkout
/checkout/review	Review order
/payment	Payment
/account	Customer account
/profile	Customer profile
/orders	Customer orders
Admin Routes
Route	Description
/admin/login	Admin login
/admin/dashboard	Admin dashboard
🔐 Authentication Flow

Customer authentication uses a mobile OTP-based flow.

Enter Mobile Number
        ↓
Request OTP
        ↓
Verify OTP
        ↓
Receive JWT Token
        ↓
Store Authentication State
        ↓
Access Protected Routes

Authenticated API requests automatically include:

Authorization: Bearer <token>
🛒 Order Flow

The frontend follows a structured order process:

Product
   ↓
Product Details
   ↓
Select Variant
   ↓
Add to Cart
   ↓
Cart
   ↓
Checkout
   ↓
Review Order
   ↓
Payment
   ↓
Order Created
🎨 Brand Direction

GuiltFree Cravings follows a warm and natural visual identity.

Primary Brand Color
#8b542f
Supporting Colors
#fffaf5
#f5eadf
#eadfd3
#f3e4d3
#744324

The interface uses soft neutral backgrounds, warm brown accents and clean typography to create a premium homemade-food experience.

📱 Responsive Design

The application is designed for:

Mobile phones
Tablets
Laptops
Desktop screens

Tailwind CSS responsive utilities are used throughout the application to maintain consistent layouts across screen sizes.
