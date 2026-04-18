# Event Management System (MERN Stack)

A complete MERN stack application built from the flow chart and UI designs in the requirements PDF. Supports three roles — **Admin**, **Vendor**, and **User** — with full authentication, product management, cart/checkout, order tracking, and membership management.

---

## 📁 Folder Structure

```
event-management-system/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Login/signup for all 3 roles
│   │   ├── productController.js     # Product CRUD
│   │   ├── cartController.js        # Cart operations
│   │   ├── orderController.js       # Orders + vendor requests
│   │   └── adminController.js       # User/Vendor/Membership admin
│   ├── middleware/
│   │   └── auth.js                  # JWT protect + role guards
│   ├── models/
│   │   ├── User.js
│   │   ├── Vendor.js
│   │   ├── Admin.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Membership.js
│   │   └── RequestItem.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── adminRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── ProtectedRoute.js    # Role-based route guard
    │   │   └── ChartLink.js
    │   ├── context/
    │   │   └── AuthContext.js       # Session handling
    │   ├── pages/                   # All 25 screens
    │   │   ├── Index.js
    │   │   ├── Chart.js
    │   │   ├── AdminLogin.js, VendorLogin.js, UserLogin.js
    │   │   ├── VendorSignUp.js, UserSignUp.js
    │   │   ├── VendorHome.js, YourItem.js, AddNewItem.js
    │   │   ├── ProductStatus.js, RequestItem.js, ViewProduct.js
    │   │   ├── UpdateStatus.js, VendorTransaction.js
    │   │   ├── UserHome.js, VendorList.js, VendorProducts.js
    │   │   ├── Cart.js, Checkout.js, GuestList.js, OrderStatus.js
    │   │   └── AdminHome.js, AdminMaintenance.js,
    │   │       MaintainUser.js, MaintainVendor.js, MembershipManage.js
    │   ├── styles/
    │   │   └── style.css            # Matches PDF blue/gray theme
    │   ├── api.js                   # Axios instance with JWT interceptor
    │   ├── App.js                   # All routes wired
    │   └── index.js
    └── package.json
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js (v16+)
- MongoDB running locally on default port 27017 *(or update `MONGO_URI` in `backend/.env`)*

### 1. Backend Setup

```bash
cd backend
npm install
npm start
```

Backend will run on **http://localhost:5000**.

On first launch, a default admin is auto-created:
- **User Id:** `Admin`
- **Password:** `Admin`

### 2. Frontend Setup

Open a **new terminal**:

```bash
cd frontend
npm install
npm start
```

Frontend will run on **http://localhost:3000** and proxy API calls to the backend.

---

## 🧑‍💼 Default Credentials

| Role   | Login        | Notes                              |
|--------|--------------|------------------------------------|
| Admin  | Admin / Admin | Auto-created on server startup    |
| Vendor | Sign up      | Must choose a category             |
| User   | Sign up      | Just name / email / password       |

---

## 🗺️ Route Map

### Public
| Path | Screen |
|------|--------|
| `/` | Index (Landing) |
| `/chart` | Flow Chart view |
| `/admin/login` | Admin Login |
| `/vendor/login` | Vendor Login |
| `/vendor/signup` | Vendor Sign Up |
| `/user/login` | User Login |
| `/user/signup` | User Sign Up |

### Vendor (protected, role=vendor)
| Path | Screen |
|------|--------|
| `/vendor/home` | Main Page (Your Item / Add / Transaction / LogOut) |
| `/vendor/your-item` | Product CRUD with Insert / Delete |
| `/vendor/add-item` | Add New Item menu |
| `/vendor/product-status` | Shipment status list |
| `/vendor/request-item` | User requests grid |
| `/vendor/view-product` | View product catalog |
| `/vendor/update-status/:id` | Radio button status update (Received / Ready for Shipping / Out For Delivery) |
| `/vendor/transaction` | User Request transactions |

### User (protected, role=user)
| Path | Screen |
|------|--------|
| `/user/home` | Vendor / Cart / Guest List / Order Status / LogOut |
| `/user/vendor-list/:category` | Vendors by category |
| `/user/vendor-products/:vendorId` | Vendor's products → Add to Cart |
| `/user/cart` | Shopping Cart with Grand Total / Delete All |
| `/user/checkout` | Payment form → Thank You popup |
| `/user/guest-list` | All placed orders with Update / Cancel |
| `/user/order-status` | Order status tracker |

### Admin (protected, role=admin)
| Path | Screen |
|------|--------|
| `/admin/home` | Maintain User / Maintain Vendor |
| `/admin/maintenance` | Maintenance Menu (Membership / User / Vendor — Add / Update) |
| `/admin/maintain-user` | User CRUD + Active/Inactive toggle |
| `/admin/maintain-vendor` | Vendor CRUD + Category + Active/Inactive toggle |
| `/admin/membership` | Add/Update Membership (6 months / 1 year / 2 years — default 6 months) |

---

## 🔌 API Endpoints (all under `/api`)

### Auth
- `POST /auth/user/signup` — User signup
- `POST /auth/user/login`
- `POST /auth/vendor/signup`
- `POST /auth/vendor/login`
- `POST /auth/admin/login`

### Products
- `GET /products/categories` — List of 4 categories
- `POST /products` *(vendor)* — Add product
- `GET /products/vendor` *(vendor)* — Own products
- `PUT /products/:id` *(vendor)* — Update
- `DELETE /products/:id` *(vendor)* — Delete
- `GET /products/category/:category` — Vendors in a category
- `GET /products/vendor/:vendorId` — Products of a vendor

### Cart *(user)*
- `GET /cart`
- `POST /cart/add`
- `PUT /cart/update` — change quantity
- `DELETE /cart/item/:productId`
- `DELETE /cart/clear` — Delete All

### Orders
- `POST /orders` *(user)* — Place order
- `GET /orders/user` *(user)* — My orders
- `PUT /orders/cancel/:id` *(user)*
- `GET /orders/vendor/requests` *(vendor)* — User requests
- `PUT /orders/vendor/request/:id` *(vendor)* — Update status
- `DELETE /orders/vendor/request/:id` *(vendor)*

### Admin
- `GET|POST /admin/users`, `PUT|DELETE /admin/users/:id`
- `GET|POST /admin/vendors`, `PUT|DELETE /admin/vendors/:id`
- `GET|POST /admin/memberships`, `PUT|DELETE /admin/memberships/:id`

---

## ✅ Requirement Compliance (from PDF)

| # | Rule | Implementation |
|---|------|---------------|
| 1 | Flow matches chart | `App.js` route tree mirrors the flow chart |
| 2 | Maintenance mandatory for reports/transactions | Admin maintenance screens gated by `adminOnly` middleware |
| 3 | Basic formatting | Yes — blue/gray theme matching PDF |
| 4 | Chart link on pages | Chart button on every top-level page |
| 5 | Radio buttons — one selectable | `UpdateStatus.js` + `MembershipManage.js` use native radio groups |
| 6 | Checkbox = yes/no | Active/Inactive toggles in admin maintenance |
| 7 | Passwords hidden | All password fields use `type="password"` |
| 8 | Admin accesses maintenance, reports, transactions | Admin routes protected with `adminOnly` |
| 9 | User has access to reports/transactions, not maintenance | User can reach Cart/Orders; admin routes blocked by role check |
| 10 | Form validations | Client-side + server-side (Mongoose + controller checks) |
| 11 | Session | JWT persisted in `localStorage` via AuthContext |
| 12 | Maintenance Menu (Admin only) | `AdminMaintenance.js` at `/admin/maintenance` |
| 13 | Flow matches chart | Routes mirror the chart structure |
| — | Add Membership — all fields mandatory, default 6 months | `MembershipManage.js` enforces both |
| — | Update Membership | Same page, pre-filled, editable |

---

## 🧪 Quick Test Walkthrough

1. Start backend (`cd backend && npm start`) — watch for `Default admin created`.
2. Start frontend (`cd frontend && npm start`).
3. Open http://localhost:3000
4. Click **Vendor Login** → **Sign Up**, create a vendor in category "Catering".
5. Add a few products on `Your Item`.
6. Log out, click **User Login** → **Sign Up**.
7. Click **Vendor** → pick "Catering" → click **Shop Item** on a vendor → **Add to Cart**.
8. Go to **Cart** → **Proceed to CheckOut** → fill form → **Order Now** → see Thank You popup.
9. Log out, log in as **Admin** (Admin/Admin) → **Maintain User** / **Maintain Vendor** / **Manage Memberships**.
10. Log back in as vendor → **Transaction** or **Product Status** → **Update** status to Ready for Shipping / Out For Delivery.

---

## 📦 Tech Stack

**Backend:** Node.js, Express 4, MongoDB (Mongoose 7), bcryptjs, jsonwebtoken, express-session, cors, dotenv

**Frontend:** React 18, React Router 6, Axios, vanilla CSS

---

## 📝 Notes

- CSS closely mirrors the PDF's blue `#4472C4` / gray `#C0C0C0` palette, rounded corners, and layout.
- Images stored as base64 data URLs directly in MongoDB (fine for the scope of this project; swap for S3/Cloudinary in production).
- The `ChartLink` button appears on the login screens as specified — "Chart link is on all pages to help navigate the user to the chart. It is not required in the working application."
