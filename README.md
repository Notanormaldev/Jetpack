# ⚡ Jetpack — Production-Grade Auth Boilerplate

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Express%205-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-Session%20Cache-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-Auth-black?style=for-the-badge&logo=jsonwebtokens" />
</p>

> **Jetpack** ek hackathon-ready, production-grade authentication boilerplate hai jo developers ko zero se auth setup karne ka jhanjhat bachata hai. Bas clone karo, `.env` fill karo, aur apna actual project banao — baaki sab ready hai.

---

## 📌 Project Ka Matlab (Why Jetpack?)

Har hackathon mein pehle 2-3 ghante sirf auth setup mein waste ho jaate hain — register, login, OTP, JWT, Google OAuth, password reset... Jetpack in sab ko **already packaged** karke deta hai taaki aap apni unique features pe focus kar sako.

**Ye project banaya gaya hai:**
- 🏆 Hackathon developers ke liye jo time bachana chahte hain
- 🔒 Production-level security chahne walon ke liye (JWT rotation, Redis blacklisting, Helmet, Rate limiting)
- 🚀 Full-stack React + Node.js stack use karne walon ke liye

---

## 🏗️ Project Structure

```
Jetpack/
├── Backend/                    # Express.js API Server
│   ├── server.js               # Entry point — DB connect & server start
│   ├── .env                    # Environment variables (git-ignored)
│   └── src/
│       ├── app.js              # Express app setup (CORS, Helmet, Rate Limit, Passport)
│       ├── config/
│       │   ├── config.js       # ENV loader + validation
│       │   ├── db.js           # MongoDB connection
│       │   └── cache.js        # Redis (ioredis) connection
│       ├── Routes/
│       │   └── auth.route.js   # All auth API routes
│       ├── controllers/
│       │   └── auth.controller.js  # Business logic for all auth flows
│       ├── models/
│       │   └── user.model.js   # Mongoose User schema
│       ├── Middleware/
│       │   └── authtoken.middleware.js  # JWT access token verifier
│       ├── services/
│       │   └── mailer.service.js   # Brevo (email) client setup
│       ├── utils/
│       │   └── sendotp.js      # OTP generator + email sender
│       └── validator/
│           └── auth.validator.js    # express-validator rules
│
└── Frontend/                   # React + Vite App
    ├── index.html
    ├── vite.config.js          # Vite config with /api proxy to backend
    └── src/
        ├── main.jsx            # Root render (Redux Provider + Toast)
        └── app/
            ├── App.jsx         # App root — calls getMe on load
            ├── app.routes.jsx  # React Router routes
            ├── app.store.js    # Redux store
            └── features/auth/
                ├── auth.slice.js           # Redux slice (user, loading, error)
                ├── hook/useauth.js         # Custom hook — all auth actions
                ├── services/auth.api.js    # Axios instance + interceptors
                ├── pages/
                │   ├── Login.jsx           # Login + Forgot Password flow
                │   ├── Register.jsx        # Register + OTP verification flow
                │   ├── JetpackPanel.jsx    # Protected dashboard
                │   ├── Auth.css            # Auth pages styling
                │   ├── JetpackPanel.css    # Dashboard styling
                │   └── NotFound.jsx        # 404 page
                └── components/
                    ├── Protected.jsx       # Route guard (redirects if not logged in)
                    ├── Logo.jsx            # Jetpack SVG logo
                    └── GoogleSignInButton.jsx  # Google OAuth link button
```

---

## ✅ Features (Kya-kya hai Jetpack mein?)

### 🔐 Authentication
| Feature | Description |
|---|---|
| **Register** | Email + Password registration with OTP email verification |
| **Login** | Email + Password login with JWT cookie-based auth |
| **Google OAuth** | One-click Google sign-in via Passport.js |
| **OTP Verification** | 6-digit OTP sent via Brevo email service, 10 min expiry |
| **Forgot Password** | Email OTP-based password reset (2-step flow) |
| **Logout** | Access + Refresh tokens blacklisted in Redis |
| **Delete Account** | User deleted from DB + tokens invalidated |

### 🛡️ Security
| Feature | Details |
|---|---|
| **JWT Access Token** | Short-lived (15 min), stored in `httpOnly` cookie |
| **JWT Refresh Token** | Long-lived (7 days), rotated on every use |
| **Redis Blacklist** | Revoked tokens stored in Redis to prevent replay attacks |
| **Helmet.js** | Sets secure HTTP headers |
| **Rate Limiting** | 100 requests per 15 minutes per IP on `/api/auth` |
| **bcryptjs** | Passwords hashed with salt rounds = 10 |
| **express-validator** | Input validation on register/login |

### 🌐 Frontend
| Feature | Description |
|---|---|
| **Redux Toolkit** | Global auth state (user, loading, error) |
| **Protected Routes** | Auto-redirect to `/login` if not authenticated |
| **Auto Token Refresh** | Axios interceptor silently refreshes expired access tokens |
| **Toast Notifications** | `react-hot-toast` for all success/error feedback |
| **Responsive Design** | iOS-inspired clean UI with glassmorphism |

---

## 🚀 Local Setup (Kaise chalao?)

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (ya local MongoDB)
- Redis Cloud account (ya local Redis)
- Brevo account (free email service)
- Google Cloud OAuth credentials

---

### Step 1: Clone the repo

```bash
git clone https://github.com/Notanormaldev/Jetpack.git
cd Jetpack
```

---

### Step 2: Backend Setup

```bash
cd Backend
npm install
```

**`.env` file banao** `Backend/` folder mein:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>
JWT=your_super_secret_jwt_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
BREVO_API_KEY=your_brevo_api_key
GOOGLE_EMAIL=your_email@gmail.com
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
NODE_ENVIRONMENT=development
```

**Backend start karo:**

```bash
npm run dev
```

Backend `http://localhost:3000` pe chalega.

---

### Step 3: Frontend Setup

```bash
cd ../Frontend
npm install
npm run dev
```

Frontend `http://localhost:5173` pe chalega.

> **Note:** Vite automatically `/api` requests ko `http://localhost:3000` pe proxy karta hai — koi alag configuration ki zaroorat nahi.

---

## 🌍 API Reference

Base URL: `http://localhost:3000/api/auth`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/register` | User register + OTP send | ❌ |
| `POST` | `/verify-otp` | OTP verify + JWT set | ❌ |
| `POST` | `/login` | Login + JWT set | ❌ |
| `GET` | `/get-me` | Get current user info | ✅ |
| `POST` | `/refresh-token` | Refresh access token | ❌ (needs refresh cookie) |
| `POST` | `/forgot-password` | Send reset OTP to email | ❌ |
| `POST` | `/reset-password` | Reset password with OTP | ❌ |
| `POST` | `/logout` | Logout + blacklist tokens | ❌ |
| `DELETE` | `/delete-account` | Delete user account | ✅ |
| `GET` | `/google` | Initiate Google OAuth | ❌ |
| `GET` | `/google/callback` | Google OAuth callback | ❌ |

---

## 🔄 Auth Flow Diagram

```
Register ──► OTP Email Sent ──► Verify OTP ──► JWT Cookies Set ──► Dashboard
                                                      │
Login ─────────────────────────────────────────────► │
                                                      │
Google OAuth ──► Passport Callback ──────────────────┘
                                                      │
                                          Access Token Expires (15m)
                                                      │
                                    Axios Interceptor ──► POST /refresh-token
                                                      │
                                          New Tokens Set in Cookies
```

---

## 🧠 Technical Deep Dive

### JWT Strategy
- **Access Token** (15 min): Contains `{ id, user: { _id, email, role, fullname } }` — short-lived, refreshed silently.
- **Refresh Token** (7 days): Contains only `{ id }` — rotates on every use (prevents refresh token reuse attacks).
- Both tokens stored in `httpOnly; SameSite=Lax` cookies — XSS-safe.

### Redis Token Blacklisting
- Jab user logout/delete karta hai, dono tokens Redis mein store hote hain apni original TTL ke saath.
- Har protected request pe token Redis mein check hota hai before JWT verify.
- **Prevents:** Logout bypass, session hijacking via stolen tokens.

### Silent Token Refresh
- `auth.api.js` mein Axios response interceptor hai.
- Jab 401 + `expired: true` response aata hai, interceptor silently `POST /refresh-token` call karta hai.
- Success pe original request retry hoti hai.
- Failure pe user `/login` pe redirect ho jaata hai.

---

## ⚙️ Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | ✅ | MongoDB connection string |
| `JWT` | ✅ | JWT signing secret |
| `GOOGLE_CLIENT_ID` | ✅ | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | ✅ | Google OAuth Client Secret |
| `BREVO_API_KEY` | ✅ | Brevo transactional email API key |
| `GOOGLE_EMAIL` | ✅ | Sender email address for OTPs |
| `REDIS_HOST` | ✅ | Redis server hostname |
| `REDIS_PORT` | ✅ | Redis server port |
| `REDIS_PASSWORD` | ✅ | Redis auth password |
| `NODE_ENVIRONMENT` | ✅ | `development` or `production` |

> ⚠️ **Warning:** Apna `.env` file kabhi bhi Git pe push mat karo. `.gitignore` mein already add hai, but double-check karo.

---

## 🐛 Known Issues & Fixes

| Bug | Fix Applied |
|---|---|
| CORS `Methods` typo (capital M) | Fixed to lowercase `methods` — DELETE requests were being blocked |
| `tokenresponse` returning HTTP 201 | Fixed to HTTP 200 — 201 is "Created", not appropriate for login |
| OTP emails branded as "Luomi" | Fixed to "Jetpack" branding throughout |

---

## 🛠️ Tech Stack

### Backend
- **Express.js v5** — Web framework
- **Mongoose** — MongoDB ODM
- **jsonwebtoken** — JWT sign/verify
- **bcryptjs** — Password hashing
- **ioredis** — Redis client
- **passport + passport-google-oauth20** — Google OAuth
- **express-rate-limit** — Rate limiting
- **helmet** — Secure HTTP headers
- **morgan** — HTTP request logging
- **sib-api-v3-sdk (Brevo)** — Transactional emails
- **express-validator** — Input validation

### Frontend
- **React 19** — UI library
- **Vite 8** — Build tool + dev server
- **Redux Toolkit** — State management
- **React Router v7** — Client-side routing
- **Axios** — HTTP client with interceptors
- **react-hot-toast** — Toast notifications
- **react-icons** — Icon library
- **Tailwind CSS v4** — Utility CSS (via Vite plugin)

---

## 👤 Developer

**Harsh Patel** — [@Notanormaldev](https://github.com/Notanormaldev)

Built with ❤️ for hackathons and rapid prototyping.

---

## 📄 License

MIT © 2026 Jetpack
