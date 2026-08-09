# Amazon-style E-Commerce Backend

A complete REST API backend for an Amazon-like e-commerce platform, built with **Node.js, Express, and MongoDB**. Built as a college project — includes auth, product catalog, search, cart, orders, reviews, and a mock payment flow.

## Features

- **Auth**: JWT-based register/login, role-based access (`customer`, `seller`, `admin`), profile + address management
- **Products**: Full CRUD (seller/admin only for write), filtering by category/price, sorting, pagination
- **Search**: MongoDB full-text search across name, description, brand, category
- **Cart**: Add/update/remove items, auto-created per user
- **Orders**: Place order from cart (with stock validation + auto stock decrement), order history, cancel, admin status updates
- **Reviews**: One review per user per product, auto-recalculates product's average rating
- **Payments**: Mock payment endpoint that marks an order as paid (no real gateway — simulates success for demo purposes)

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken) for auth
- bcryptjs for password hashing

## Project Structure

```
amazon-backend/
├── config/db.js              # MongoDB connection
├── models/                   # Mongoose schemas
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   ├── Order.js
│   └── Review.js
├── middleware/
│   ├── auth.js                # protect + role authorize
│   └── errorHandler.js
├── controllers/               # business logic
├── routes/                    # API route definitions
├── utils/
│   ├── generateToken.js
│   └── seedData.js            # demo data seeder
├── server.js                  # app entry point
├── .env.example
└── package.json
```

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**

   Copy `.env.example` to `.env` and fill in values:
   ```bash
   cp .env.example .env
   ```
   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/amazon_clone
   JWT_SECRET=some_long_random_string
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ```

   If you don't have MongoDB installed locally, use a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster and paste its connection string into `MONGO_URI`.

3. **(Optional) Seed demo data**
   ```bash
   npm run seed
   ```
   Creates an admin, seller, customer, and 5 sample products. Login credentials are printed to the console after seeding.

4. **Run the server**
   ```bash
   npm run dev     # with nodemon (auto-restart)
   # or
   npm start
   ```

   Server starts on `http://localhost:5000`. Check `GET /api/health` to confirm it's running.

## API Reference

### Auth — `/api/auth`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register (`name`, `email`, `password`, optional `role: 'seller'`) |
| POST | `/login` | Public | Login, returns JWT |
| GET | `/profile` | Private | Get own profile |
| PUT | `/profile` | Private | Update name/phone/password |
| POST | `/addresses` | Private | Add a shipping address |

### Products — `/api/products`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List products (`?category=&minPrice=&maxPrice=&sort=price_asc|price_desc|rating&page=&limit=`) |
| GET | `/search?q=keyword` | Public | Full-text search |
| GET | `/:id` | Public | Get one product |
| POST | `/` | seller/admin | Create product |
| PUT | `/:id` | seller (owner)/admin | Update product |
| DELETE | `/:id` | seller (owner)/admin | Delete product |
| GET | `/:productId/reviews` | Public | List reviews for a product |
| POST | `/:productId/reviews` | Private | Add a review (`rating`, `comment`) |

### Cart — `/api/cart` (all routes require login)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get current cart |
| POST | `/` | Add item (`productId`, `quantity`) |
| PUT | `/:productId` | Update quantity |
| DELETE | `/:productId` | Remove one item |
| DELETE | `/` | Clear cart |

### Orders — `/api/orders` (all routes require login)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Private | Place order from cart (`shippingAddress`, `paymentMethod`) |
| GET | `/my` | Private | My order history |
| GET | `/:id` | Private (owner/admin) | Get one order |
| GET | `/` | admin | List all orders |
| PUT | `/:id/status` | admin | Update order status |
| PUT | `/:id/cancel` | Private (owner) | Cancel own pending/confirmed order |

### Reviews — `/api/reviews`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| PUT | `/:id` | Private (owner) | Edit own review |
| DELETE | `/:id` | Private (owner/admin) | Delete review |

### Payments — `/api/payments`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/:orderId` | Private (owner) | **Mock** payment — marks order as paid |

> ⚠️ The payment endpoint is a simulation for demo purposes. It does not integrate with Razorpay/Stripe/any real gateway — swap in a real SDK before using this in production.

## Example Request Flow

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Sannidhi","email":"sannidhi@example.com","password":"pass123"}'

# 2. Login -> copy the token from the response
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sannidhi@example.com","password":"pass123"}'

# 3. Add to cart (use token from step 2)
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"productId":"<PRODUCT_ID>","quantity":2}'

# 4. Place an order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"shippingAddress":{"line1":"123 MG Road","city":"Hubballi","state":"Karnataka","pincode":"580001"},"paymentMethod":"upi"}'

# 5. Pay for it (mock)
curl -X POST http://localhost:5000/api/payments/<ORDER_ID> \
  -H "Authorization: Bearer <TOKEN>"
```

## Notes for Presentation / Viva

- **Auth**: JWT is signed with `JWT_SECRET`, sent as `Authorization: Bearer <token>`, verified in `middleware/auth.js`.
- **Roles**: `customer` (default), `seller` (can list/manage products), `admin` (full access + order management).
- **Search**: Uses MongoDB's built-in text index (`productSchema.index({ name: 'text', ... })`) — no external search engine needed, good for keeping the demo self-contained.
- **Order → Payment flow**: Order is created as `pending` (stock is reserved/decremented immediately); calling the payment endpoint marks it `isPaid: true` and moves status to `confirmed`.
- **Extensible**: Could swap the mock payment controller for Razorpay/Stripe, or add MongoDB Atlas Search / Elasticsearch for more advanced search, without touching the rest of the app.
