# ⚡ Jetpack — Production-Grade Auth Boilerplate

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Express%205-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-Session%20Cache-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-Auth-black?style=for-the-badge&logo=jsonwebtokens" />
</p>

> **Jetpack** is a hackathon-ready, production-grade authentication boilerplate. It eliminates the repetitive setup of auth systems so developers can focus on building their actual product — not wiring up JWT, OTP emails, Redis token blacklisting, and Google OAuth from scratch every time.

---

## 📌 Why Jetpack?

Every hackathon wastes the first 2–3 hours on the same boilerplate work: register, login, OTP verification, JWT, Google OAuth, password reset. Jetpack packages all of it into a single, ready-to-clone repository with production-level security built in.

**Built for:**
- 🏆 Hackathon developers who need to move fast without sacrificing security
- 🔒 Projects that require real-world auth security out of the box
- 🚀 Full-stack teams working with a React + Node.js stack

---

## 🏗️ Project Structure

```
Jetpack/
├── Backend/                        # Express.js API Server
│   ├── server.js                   # Entry point — connects DB and starts server
│   ├── .env                        # Environment variables (git-ignored)
│   └── src/
│       ├── app.js                  # Express app setup (CORS, Helmet, Rate Limit, Passport)
│       ├── config/
│       │   ├── config.js           # ENV loader with validation
│       │   ├── db.js               # MongoDB connection
│       │   └── cache.js            # Redis client (ioredis)
│       ├── Routes/
│       │   └── auth.route.js       # All auth API route definitions
│       ├── controllers/
│       │   └── auth.controller.js  # Business logic for all auth flows
│       ├── models/
│       │   └── user.model.js       # Mongoose User schema with bcrypt hooks
│       ├── Middleware/
│       │   └── authtoken.middleware.js  # JWT access token verifier + Redis blacklist check
│       ├── services/
│       │   └── mailer.service.js   # Brevo transactional email client
│       ├── utils/
│       │   └── sendotp.js          # OTP generator and email sender
│       └── validator/
│           └── auth.validator.js   # Input validation rules (express-validator)
│
└── Frontend/                       # React + Vite Application
    ├── index.html
    ├── vite.config.js              # Vite config with /api proxy to backend
    └── src/
        ├── main.jsx                # Root render (Redux Provider + Toast)
        └── app/
            ├── App.jsx             # App root — fetches user session on load
            ├── app.routes.jsx      # React Router route definitions
            ├── app.store.js        # Redux store configuration
            └── features/auth/
                ├── auth.slice.js           # Redux slice (user, loading, error)
                ├── hook/useauth.js         # Custom hook for all auth actions
                ├── services/auth.api.js    # Axios instance with interceptors
                ├── pages/
                │   ├── Login.jsx           # Login page with Forgot Password flow
                │   ├── Register.jsx        # Registration page with OTP verification
                │   ├── JetpackPanel.jsx    # Protected user dashboard
                │   ├── NotFound.jsx        # 404 page
                │   ├── Auth.css            # Auth pages stylesheet
                │   └── JetpackPanel.css    # Dashboard stylesheet
                └── components/
                    ├── Protected.jsx           # Route guard (redirects unauthenticated users)
                    ├── Logo.jsx                # Jetpack SVG logo component
                    └── GoogleSignInButton.jsx  # Google OAuth link button
```

---

## ✅ Features

### 🔐 Authentication Flows

| Feature | Description |
|---|---|
| **Register** | Email + password registration with OTP email verification |
| **Login** | Email + password login with JWT cookie-based sessions |
| **Google OAuth** | One-click Google sign-in via Passport.js |
| **OTP Verification** | 6-digit OTP delivered via Brevo email, expires in 10 minutes |
| **Forgot Password** | Two-step password reset using an email OTP |
| **Logout** | Invalidates both access and refresh tokens via Redis blacklisting |
| **Delete Account** | Removes user from the database and invalidates all active tokens |

### 🛡️ Security

| Feature | Details |
|---|---|
| **JWT Access Token** | Short-lived (15 min), stored in an `httpOnly` cookie |
| **JWT Refresh Token** | Long-lived (7 days), rotated on every use to prevent replay attacks |
| **Redis Blacklist** | Revoked tokens stored in Redis — prevents reuse after logout |
| **Helmet.js** | Sets secure HTTP response headers automatically |
| **Rate Limiting** | 100 requests per 15 minutes per IP on all `/api/auth` routes |
| **bcryptjs** | All passwords hashed with a salt factor of 10 |
| **Input Validation** | Server-side validation on all inputs via `express-validator` |

### 🌐 Frontend

| Feature | Description |
|---|---|
| **Redux Toolkit** | Global auth state management (user, loading, error) |
| **Protected Routes** | Automatically redirects unauthenticated users to `/login` |
| **Silent Token Refresh** | Axios interceptor transparently refreshes expired access tokens |
| **Toast Notifications** | User-facing success and error feedback via `react-hot-toast` |
| **Responsive UI** | Clean, iOS-inspired design with subtle glassmorphism |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- A MongoDB Atlas cluster (or local MongoDB instance)
- A Redis Cloud instance (or local Redis server)
- A [Brevo](https://brevo.com) account for transactional email (free tier available)
- Google Cloud OAuth 2.0 credentials

---

### 1. Clone the Repository

```bash
git clone https://github.com/Notanormaldev/Jetpack.git
cd Jetpack
```

---

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>
JWT=your_super_secret_jwt_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
BREVO_API_KEY=your_brevo_api_key
GOOGLE_EMAIL=your_sender_email@example.com
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
NODE_ENVIRONMENT=development
```

Start the backend server:

```bash
npm run dev
```

The API server will run on `http://localhost:3000`.

---

### 3. Frontend Setup

```bash
cd ../Frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`.

> **Note:** Vite's dev proxy automatically forwards all `/api` requests to `http://localhost:3000`. No additional configuration needed.

---

## 🌍 API Reference

**Base URL:** `http://localhost:3000/api/auth`

| Method | Endpoint | Description | Requires Auth |
|---|---|---|---|
| `POST` | `/register` | Register a new user and send an OTP | ❌ |
| `POST` | `/verify-otp` | Verify OTP and issue JWT cookies | ❌ |
| `POST` | `/login` | Log in and issue JWT cookies | ❌ |
| `GET` | `/get-me` | Retrieve the currently authenticated user | ✅ |
| `POST` | `/refresh-token` | Rotate and reissue access and refresh tokens | ❌ (needs refresh cookie) |
| `POST` | `/forgot-password` | Send a password reset OTP to the user's email | ❌ |
| `POST` | `/reset-password` | Reset password using a valid OTP | ❌ |
| `POST` | `/logout` | Log out and blacklist both tokens | ❌ |
| `DELETE` | `/delete-account` | Permanently delete the account and revoke tokens | ✅ |
| `GET` | `/google` | Initiate the Google OAuth flow | ❌ |
| `GET` | `/google/callback` | Handle the Google OAuth callback | ❌ |

---

## 🔄 Authentication Flow

```
Register ──► OTP Sent to Email ──► Verify OTP ──► JWT Cookies Set ──► Dashboard
                                                          │
Login ────────────────────────────────────────────────── │
                                                          │
Google OAuth ──► Passport Callback ───────────────────── │
                                                          ▼
                                              Access Token Expires (15 min)
                                                          │
                                       Axios Interceptor detects 401 + expired
                                                          │
                                           POST /refresh-token
                                                          │
                                         New tokens issued via cookies
                                                          │
                                        Original request retried silently
```

---

## 🧠 Technical Details

### JWT Strategy

- **Access Token** (15 min): Signed with payload `{ id, user: { _id, email, role, fullname } }`. Short-lived to minimize exposure risk.
- **Refresh Token** (7 days): Contains only `{ id }`. Rotated on every use — old refresh tokens are immediately blacklisted after rotation, preventing replay attacks.
- Both tokens are stored in `httpOnly; SameSite=Lax` cookies, making them inaccessible to JavaScript (XSS-safe).

### Redis Token Blacklisting

- On logout or account deletion, both the access and refresh tokens are stored in Redis with their remaining TTL.
- Every request to a protected endpoint checks Redis for the token before verifying the JWT signature.
- This effectively makes token revocation instant, regardless of the token's remaining lifetime.

### Silent Token Refresh

- The Axios instance in `auth.api.js` includes a response interceptor.
- When a `401` response is received with `expired: true`, the interceptor automatically calls `POST /refresh-token`.
- On success, the original failed request is retried transparently.
- If the refresh token has also expired, the user is redirected to `/login`.

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | ✅ | MongoDB connection string |
| `JWT` | ✅ | Secret key for signing JWT tokens |
| `GOOGLE_CLIENT_ID` | ✅ | Google OAuth 2.0 Client ID |
| `GOOGLE_CLIENT_SECRET` | ✅ | Google OAuth 2.0 Client Secret |
| `BREVO_API_KEY` | ✅ | Brevo (Sendinblue) API key for email delivery |
| `GOOGLE_EMAIL` | ✅ | Sender email address used for OTP emails |
| `REDIS_HOST` | ✅ | Redis server hostname |
| `REDIS_PORT` | ✅ | Redis server port |
| `REDIS_PASSWORD` | ✅ | Redis server authentication password |
| `NODE_ENVIRONMENT` | ✅ | Set to `development` or `production` |

> ⚠️ **Never commit your `.env` file to version control.** It is already listed in `.gitignore`, but always double-check before pushing.

---

## 🛠️ Tech Stack

### Backend
- **Express.js v5** — Web application framework
- **Mongoose** — MongoDB object modeling
- **jsonwebtoken** — JWT signing and verification
- **bcryptjs** — Password hashing
- **ioredis** — Redis client for token blacklisting
- **Passport.js + passport-google-oauth20** — Google OAuth strategy
- **express-rate-limit** — API rate limiting
- **helmet** — Secure HTTP headers
- **morgan** — HTTP request logging
- **sib-api-v3-sdk (Brevo)** — Transactional email delivery
- **express-validator** — Request input validation

### Frontend
- **React 19** — UI library
- **Vite 8** — Build tool and development server
- **Redux Toolkit** — Predictable global state management
- **React Router v7** — Client-side routing
- **Axios** — HTTP client with request/response interceptors
- **react-hot-toast** — Non-intrusive toast notifications
- **react-icons** — Icon component library
- **Tailwind CSS v4** — Utility-first CSS (loaded via Vite plugin)

---

## 👤 Author

**Harsh Patel** — [@Notanormaldev](https://github.com/Notanormaldev)

---

## 📄 License

MIT © 2026 Jetpack
