# Retrieval Co. — Best Free Tech Stack

> **For:** Google Antigravity — Read this before writing any code.
> Every tool listed here is 100% free to use. No credit card required unless noted.
> This document tells you exactly what to use, why, how to install it, and how each piece connects.

---

## Quick Reference — Full Stack at a Glance

```
┌─────────────────────────────────────────────────────────────────┐
│                     RETRIEVAL CO. TECH STACK                    │
├──────────────┬──────────────────────────────────────────────────┤
│ LAYER        │ TECHNOLOGY                                        │
├──────────────┼──────────────────────────────────────────────────┤
│ Frontend     │ React 18 + Vite + TailwindCSS                    │
│ Routing      │ React Router v6                                   │
│ State        │ Zustand                                           │
│ Backend      │ Node.js + Express.js                              │
│ Database     │ MongoDB Atlas (free 512MB cloud)                  │
│ ODM          │ Mongoose                                          │
│ Auth         │ JWT (jsonwebtoken) — dummy for hackathon          │
│ AI Matching  │ Google Gemini API (free tier)                     │
│ AI Chatbot   │ Google Gemini API (free tier)                     │
│ Image Check  │ Hugging Face Inference API (free)                 │
│ Maps         │ Leaflet.js + OpenStreetMap (free forever)         │
│ QR Codes     │ qrcode.js (client-side, no API)                  │
│ Icons        │ Lucide React (free, open source)                  │
│ Charts       │ Recharts (free, open source)                      │
│ Deploy FE    │ Vercel (free tier)                                │
│ Deploy BE    │ Render (free tier)                                │
│ Deploy DB    │ MongoDB Atlas M0 (free forever)                   │
└──────────────┴──────────────────────────────────────────────────┘
```

---

## 1. Frontend

### React 18 + Vite

**What it is:** React is the UI library. Vite is the build tool that starts your dev server in under 1 second.

**Why not Create React App (CRA)?** CRA is slow, outdated, and unmaintained. Vite is 10–20× faster.

**Cost:** Free. Open source.

**Install:**
```bash
npm create vite@latest retrieval-co-frontend -- --template react
cd retrieval-co-frontend
npm install
npm run dev
```

**Runs at:** `http://localhost:5173`

---

### TailwindCSS v3

**What it is:** Utility-first CSS framework. Write styles directly in your JSX using class names like `bg-blue-600`, `rounded-xl`, `flex`, `gap-4`.

**Why:** No separate CSS files. Consistent spacing. Responsive by default. Works perfectly with the design tokens in the design spec.

**Cost:** Free. Open source.

**Install (inside frontend folder):**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**`tailwind.config.js` — add brand colors:**
```js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue:       "#3e5271",
          "blue-light": "#5a6f8f",
          "blue-deep":  "#2c3d56",
          "blue-pale":  "#eef1f5",
          green:      "#30c698",
          "green-light": "#e6faf4",
          "green-dark":  "#22a07f",
        },
        text: {
          primary: "#1e2b3c",
          muted:   "#6b7a90",
        }
      },
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        body:    ["DM Sans", "sans-serif"],
        mono:    ["DM Mono", "monospace"],
      },
      borderRadius: {
        sm: "8px",
        DEFAULT: "12px",
        lg: "18px",
        xl: "24px",
      },
      boxShadow: {
        sm:  "0 1px 4px rgba(62,82,113,0.08)",
        DEFAULT: "0 4px 20px rgba(62,82,113,0.10)",
        lg:  "0 12px 40px rgba(62,82,113,0.14)",
      }
    }
  },
  plugins: [],
}
```

**`src/index.css` — add at top:**
```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### React Router v6

**What it is:** Handles navigation between pages without full page reloads.

**Cost:** Free. Open source.

**Install:**
```bash
npm install react-router-dom
```

**Setup in `src/main.jsx`:**
```jsx
import { BrowserRouter } from "react-router-dom";

<BrowserRouter>
  <App />
</BrowserRouter>
```

**Routes in `src/App.jsx`:**
```jsx
import { Routes, Route, Navigate } from "react-router-dom";

<Routes>
  <Route path="/"            element={<LandingPage />} />
  <Route path="/login"       element={<LoginPage />} />
  <Route path="/dashboard"   element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
  <Route path="/create"      element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
  <Route path="/my-posts"    element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
  <Route path="*"            element={<Navigate to="/" />} />
</Routes>
```

---

### Zustand (State Management)

**What it is:** Simple global state manager. Think of it as a shared storage box any component can read from or write to. Replaces the need for Redux (which is complex) or prop-drilling.

**Why not Context API?** Context causes unnecessary re-renders. Zustand is faster and simpler.

**Cost:** Free. Open source.

**Install:**
```bash
npm install zustand
```

**Usage example — auth store:**
```js
// src/store/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      login: (user, token) => set({ user, token, isLoggedIn: true }),
      logout: () => set({ user: null, token: null, isLoggedIn: false }),
    }),
    { name: "auth-storage" }  // persists to localStorage automatically
  )
);
```

---

### Lucide React (Icons)

**What it is:** Beautiful, consistent icon library. Over 1,000 icons as React components.

**Cost:** Free. Open source. MIT license.

**Install:**
```bash
npm install lucide-react
```

**Usage:**
```jsx
import { Search, MapPin, Star, AlertTriangle, QrCode } from "lucide-react";

<Search size={16} className="text-brand-blue" />
```

---

### Recharts (Charts for Stats/Leaderboard)

**What it is:** React charting library. Used for the landing page stats bar chart and any data visualisations.

**Cost:** Free. Open source.

**Install:**
```bash
npm install recharts
```

**Usage:**
```jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
```

---

### Leaflet.js + React-Leaflet (Maps)

**What it is:** Open-source interactive maps. Uses OpenStreetMap tiles which are completely free forever.

**Why not Google Maps?** Google Maps requires a credit card and charges after a free quota. Leaflet + OpenStreetMap = 100% free, no limits.

**Cost:** Free forever.

**Install:**
```bash
npm install leaflet react-leaflet
```

**Add to `index.html`:**
```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
```

**Basic map setup:**
```jsx
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

<MapContainer center={[17.3850, 78.4867]} zoom={16} style={{ height: "300px", borderRadius: "18px" }}>
  <TileLayer
    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
    attribution='&copy; OpenStreetMap contributors &copy; CARTO'
  />
  {/* Hotspot circles go here */}
  <CircleMarker
    center={[17.385, 78.4867]}
    radius={20}
    fillColor="#ef4444"
    fillOpacity={0.85}
    stroke={false}
  >
    <Popup>📍 Canteen — 5 wallets lost</Popup>
  </CircleMarker>
</MapContainer>
```

**Why CartoDB tiles?** They look clean, minimal, and match the design aesthetic better than the default OpenStreetMap tiles.

---

### QRCode.js (QR Code Generation)

**What it is:** Generates QR codes entirely in the browser. No server, no API, no cost.

**Cost:** Free. Open source.

**Install:**
```bash
npm install qrcode.react
```

**Usage:**
```jsx
import { QRCodeSVG } from "qrcode.react";

<QRCodeSVG
  value={`retrieval-co://return/${transactionId}`}
  size={120}
  fgColor="#3e5271"
  bgColor="#ffffff"
  level="H"
/>
```

---

## 2. Backend

### Node.js + Express.js

**What it is:** Node.js is the JavaScript runtime that runs your server. Express.js is the framework that makes building APIs easy.

**Cost:** Free. Open source.

**Install (create a separate backend folder):**
```bash
mkdir retrieval-co-backend
cd retrieval-co-backend
npm init -y
npm install express cors dotenv mongoose jsonwebtoken bcryptjs multer
npm install -D nodemon
```

**`package.json` scripts:**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

**Runs at:** `http://localhost:5000`

**Basic `server.js`:**
```js
const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth",  require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/karma", require("./routes/karma"));
app.use("/api/users", require("./routes/users"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

### Mongoose (MongoDB ODM)

**What it is:** Lets you define schemas and interact with MongoDB using JavaScript objects instead of raw database queries.

**Cost:** Free. Open source.

**Connect in `server.js`:**
```js
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));
```

**Example Post schema:**
```js
// models/Post.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type:         { type: String, enum: ["lost", "found", "borrow"], required: true },
  title:        { type: String, required: true, maxlength: 100 },
  category:     { type: String, enum: ["Electronics","Stationery","ID Cards","Books","Clothing","Lab Equipment","Others"], required: true },
  description:  { type: String, required: true, maxlength: 500 },
  photoUrl:     { type: String },
  location:     { type: String, required: true },
  datetime:     { type: Date, required: true },
  needUntil:    { type: Date },           // Borrow only
  isUrgent:     { type: Boolean, default: false },
  isAnonymous:  { type: Boolean, default: false },
  status:       { type: String, enum: ["open","claimed","returned","expired","closed"], default: "open" },
  matchIds:     [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  replies:      [{
    userId:       { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text:         String,
    isAnonymous:  { type: Boolean, default: false },
    isAccepted:   { type: Boolean, default: false },
    createdAt:    { type: Date, default: Date.now }
  }],
  karmaAwarded: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
```

---

### JWT Authentication (Dummy for Hackathon)

**What it is:** JSON Web Tokens — a small encrypted string that proves a user is logged in. Passed with every API request.

**Cost:** Free. Open source.

**Install:**
```bash
npm install jsonwebtoken
```

**Login route (dummy — any credentials work):**
```js
// routes/auth.js
const express = require("express");
const jwt     = require("jsonwebtoken");
const router  = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // HACKATHON DUMMY AUTH — accept anything
  if (!email) return res.status(400).json({ message: "Email required" });

  const user = {
    _id: "demo_user_" + email.replace(/[^a-z]/gi, ""),
    name: email.split("@")[0].replace(/[._]/g, " "),
    email,
    collegeId: email,
    karma: 72,
  };

  const token = jwt.sign(user, process.env.JWT_SECRET || "retrieval_co_secret", { expiresIn: "7d" });

  res.json({ token, user });
});

module.exports = router;
```

**Auth middleware (protect routes):**
```js
// middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "retrieval_co_secret");
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
```

**Frontend: send token with every request:**
```js
// src/utils/api.js
const API = "http://localhost:5000/api";

export const apiFetch = async (endpoint, options = {}) => {
  const token = JSON.parse(localStorage.getItem("auth-storage"))?.state?.token;

  const res = await fetch(`${API}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  return res.json();
};
```

---

### Multer (File Uploads)

**What it is:** Handles image/file uploads from forms to your server.

**Cost:** Free. Open source.

**Install:** Already included above.

**Usage:**
```js
const multer  = require("multer");
const path    = require("path");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB max

// In route:
router.post("/posts", auth, upload.single("photo"), async (req, res) => {
  const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;
  // ...
});
```

---

## 3. Database

### MongoDB Atlas (Free M0 Cluster)

**What it is:** Cloud-hosted MongoDB database. Free M0 cluster gives you 512MB storage — more than enough for a hackathon.

**Cost:** Free forever on M0 tier. No credit card required.

**Setup steps:**
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Create free account
2. Create a new project → Build a Cluster → Select **M0 Free**
3. Choose a cloud provider (any) → Region closest to you
4. Create a database user (username + password — save these)
5. Add IP `0.0.0.0/0` to Network Access (allows all IPs — fine for hackathon)
6. Click "Connect" → "Connect your application" → Copy the connection string

**`.env` file in backend:**
```
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/retrieval-co?retryWrites=true&w=majority
JWT_SECRET=retrieval_co_super_secret_key_2026
PORT=5000
GEMINI_API_KEY=your_gemini_key_here
HUGGINGFACE_API_KEY=your_hf_key_here
```

**Collections (auto-created by Mongoose):**
```
retrieval-co/
  ├── users        (user profiles + karma)
  ├── posts        (lost, found, borrow posts)
  ├── transactions (QR return records)
  └── reports      (abuse reports)
```

---

## 4. AI Features

### Google Gemini API (AI Matching + Chatbot)

**What it is:** Google's most powerful AI model. Free tier is extremely generous for a hackathon.

**Free tier limits:**
- Gemini 2.0 Flash: **1,500 requests/day** free
- Gemini 1.5 Flash: **1,500 requests/day** free
- No credit card required

**Cost:** Free.

**Get API key:**
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with Google account
3. Click "Get API Key" → "Create API key" → Copy it

**Install:**
```bash
# In backend folder
npm install @google/generative-ai
```

**AI Auto-Match implementation:**
```js
// services/aiMatch.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function matchLostToFound(lostPost, foundPosts) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
You are a lost & found matching assistant for a college campus.

LOST ITEM:
Title: ${lostPost.title}
Category: ${lostPost.category}
Description: ${lostPost.description}
Location: ${lostPost.location}

FOUND ITEMS (list):
${foundPosts.map((p, i) => `${i + 1}. Title: ${p.title} | Category: ${p.category} | Description: ${p.description} | Location: ${p.location}`).join("\n")}

For each found item, give a match score from 0–100 based on how likely it matches the lost item.
Consider: same category, similar description keywords, same/nearby location.

Respond ONLY with valid JSON in this exact format:
{"matches": [{"index": 1, "score": 85, "reason": "Same category, similar description"}, ...]}
Only include items with score above 60.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(text);
  } catch {
    return { matches: [] };
  }
}

module.exports = { matchLostToFound };
```

**AI Chatbot implementation:**
```js
// services/chatbot.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function chatbotResponse(userMessage, context) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
You are the Campus AI Assistant for Retrieval Co., a college lost & found and borrowing platform.
Be helpful, friendly, and concise (max 3 sentences).

Platform context:
- Open Found posts: ${JSON.stringify(context.foundPosts?.slice(0, 5))}
- Current timetable suggestions: ${JSON.stringify(context.timetableSuggestions)}
- User karma: ${context.userKarma}

User message: "${userMessage}"

If the user describes a lost item, search the found posts and suggest matches.
If they need to borrow something, suggest which class sections may have it based on the timetable.
If they ask about karma, explain the points system.
Keep responses short and actionable.
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { chatbotResponse };
```

---

### Hugging Face Inference API (AI Image Detection)

**What it is:** Free API to run AI image analysis models. Used to detect if uploaded photos might be AI-generated.

**Free tier:** 30,000 characters/month inference. Enough for hundreds of image checks.

**Cost:** Free tier is sufficient. No credit card required.

**Get API key:**
1. Go to [huggingface.co](https://huggingface.co) → Create free account
2. Settings → Access Tokens → New Token (read) → Copy

**Install:**
```bash
npm install @huggingface/inference
```

**AI image detection:**
```js
// services/imageDetection.js
const { HfInference } = require("@huggingface/inference");
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

async function checkIfAIGenerated(imageBuffer) {
  try {
    // Uses a classifier trained to detect AI-generated images
    const result = await hf.imageClassification({
      model: "umm-maybe/AI-image-detector",
      data: imageBuffer,
    });

    // result is array like: [{ label: "artificial", score: 0.87 }, { label: "human", score: 0.13 }]
    const artificialScore = result.find(r => r.label === "artificial")?.score || 0;
    return {
      isAIGenerated: artificialScore > 0.75,
      confidence: Math.round(artificialScore * 100),
    };
  } catch (err) {
    // Fail gracefully — don't block the upload
    console.error("Image detection error:", err.message);
    return { isAIGenerated: false, confidence: 0 };
  }
}

module.exports = { checkIfAIGenerated };
```

**Frontend: show warning banner if flagged:**
```jsx
// In UploadZone component
const handleUpload = async (file) => {
  const formData = new FormData();
  formData.append("photo", file);

  const res = await fetch("/api/posts/check-image", { method: "POST", body: formData });
  const { isAIGenerated, confidence } = await res.json();

  if (isAIGenerated) {
    setWarning(`⚠️ This image may be AI-generated (${confidence}% confidence). Please upload a real photo.`);
  }
};
```

---

## 5. Deployment (All Free)

### Frontend — Vercel

**What it is:** Deploys your React + Vite app to a live URL in 2 minutes. Completely free for personal projects.

**Free tier:** Unlimited deployments · Custom domain · HTTPS · CDN

**Deploy steps:**
```bash
# Option A: Vercel CLI (recommended for hackathon)
npm install -g vercel
cd retrieval-co-frontend
vercel

# Follow the prompts — it auto-detects Vite
# Your app will be live at: https://retrieval-co.vercel.app
```

**Or:**
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import repository → Deploy

**Environment variable to add on Vercel dashboard:**
```
VITE_API_URL=https://your-backend.onrender.com/api
```

**Update your frontend API calls:**
```js
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
```

---

### Backend — Render

**What it is:** Deploys your Node.js + Express server to a live URL. Free tier is reliable and easy.

**Free tier:** 750 hours/month (enough for 24/7) · Automatic HTTPS · Free subdomain  
**Note:** Free tier spins down after 15 minutes of inactivity (first request takes ~30s to wake up). For a hackathon demo, ping it every 10 minutes using a free uptime monitor like [uptimerobot.com](https://uptimerobot.com).

**Deploy steps:**
1. Push backend code to GitHub
2. Go to [render.com](https://render.com) → Create free account
3. New → Web Service → Connect GitHub repo
4. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** Node
5. Add environment variables (same as your `.env` file)
6. Deploy → get URL like: `https://retrieval-co-api.onrender.com`

---

### Database — MongoDB Atlas M0

Already covered in Section 3. Free forever, no action needed beyond initial setup.

---

### File Storage for Images — Cloudinary (Free Tier)

**What it is:** Stores uploaded photos in the cloud. Better than storing on Render (files reset on redeploy).

**Free tier:** 25GB storage · 25GB bandwidth/month · Plenty for a hackathon.

**Cost:** Free.

**Setup:**
1. Go to [cloudinary.com](https://cloudinary.com) → Create free account
2. Dashboard → Copy: Cloud Name, API Key, API Secret

**Install:**
```bash
npm install cloudinary multer-storage-cloudinary
```

**Configure in backend:**
```js
// config/cloudinary.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key:    process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: "retrieval-co", allowed_formats: ["jpg", "jpeg", "png", "webp"] },
});

module.exports = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
```

**Add to `.env`:**
```
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
```

---

## 6. Complete API Routes Reference

```
AUTH
  POST   /api/auth/login          → dummy login, returns JWT token

POSTS
  GET    /api/posts                → get all posts (with filters via query params)
  GET    /api/posts/:id            → get single post
  POST   /api/posts                → create post (auth required)
  PATCH  /api/posts/:id/status     → update post status (auth, owner only)
  DELETE /api/posts/:id            → delete post (auth, owner only)
  POST   /api/posts/check-image    → AI image detection check

REPLIES
  POST   /api/posts/:id/replies    → add reply to post (auth required)
  PATCH  /api/posts/:id/replies/:replyId/accept → accept reply (auth, owner only)

AI
  POST   /api/ai/match             → run AI matching on a lost post
  POST   /api/ai/chat              → chatbot message endpoint

KARMA
  GET    /api/karma/me             → current user's karma history
  GET    /api/karma/leaderboard    → weekly + all-time leaderboard

USERS
  GET    /api/users/me             → current user profile + stats
  GET    /api/users/me/posts       → current user's posts

REPORTS
  POST   /api/reports              → submit abuse report

TRANSACTIONS (QR)
  POST   /api/transactions         → create QR transaction for a return
  PATCH  /api/transactions/:id/scan → record a scan (called when user clicks "I scanned")
  GET    /api/transactions/:id     → get transaction status
```

---

## 7. Environment Variables — Complete List

**Backend `.env`:**
```bash
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/retrieval-co

# Auth
JWT_SECRET=retrieval_co_secret_2026_hackathon

# AI
GEMINI_API_KEY=AIzaSy...           # from aistudio.google.com
HUGGINGFACE_API_KEY=hf_...         # from huggingface.co

# File Storage
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Frontend `.env.local`:**
```bash
VITE_API_URL=http://localhost:5000/api
```

**Frontend `.env.production` (for Vercel):**
```bash
VITE_API_URL=https://retrieval-co-api.onrender.com/api
```

---

## 8. Complete Dependency List

### Frontend `package.json`
```json
{
  "dependencies": {
    "react":              "^18.3.0",
    "react-dom":          "^18.3.0",
    "react-router-dom":   "^6.26.0",
    "zustand":            "^4.5.0",
    "leaflet":            "^1.9.4",
    "react-leaflet":      "^4.2.1",
    "lucide-react":       "^0.400.0",
    "recharts":           "^2.12.0",
    "qrcode.react":       "^3.1.0",
    "html5-qrcode":       "^2.3.8"
  },
  "devDependencies": {
    "vite":               "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "tailwindcss":        "^3.4.0",
    "postcss":            "^8.4.0",
    "autoprefixer":       "^10.4.0"
  }
}
```

### Backend `package.json`
```json
{
  "dependencies": {
    "express":                    "^4.19.0",
    "cors":                       "^2.8.5",
    "dotenv":                     "^16.4.0",
    "mongoose":                   "^8.4.0",
    "jsonwebtoken":               "^9.0.0",
    "bcryptjs":                   "^2.4.3",
    "multer":                     "^1.4.5-lts.1",
    "cloudinary":                 "^2.3.0",
    "multer-storage-cloudinary":  "^4.0.0",
    "@google/generative-ai":      "^0.17.0",
    "@huggingface/inference":     "^2.8.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
```

---

## 9. One-Command Setup (Copy & Paste)

```bash
# === STEP 1: Clone / create your project ===
mkdir retrieval-co && cd retrieval-co

# === STEP 2: Frontend ===
npm create vite@latest frontend -- --template react
cd frontend
npm install react-router-dom zustand leaflet react-leaflet lucide-react recharts qrcode.react html5-qrcode
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
cd ..

# === STEP 3: Backend ===
mkdir backend && cd backend
npm init -y
npm install express cors dotenv mongoose jsonwebtoken bcryptjs multer cloudinary multer-storage-cloudinary @google/generative-ai @huggingface/inference
npm install -D nodemon
cd ..

# === STEP 4: Create .env files ===
# Fill in backend/.env and frontend/.env.local with your keys

# === STEP 5: Run both ===
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev

# Frontend: http://localhost:5173
# Backend:  http://localhost:5000
```

---

## 10. Why NOT These (Common Alternatives to Avoid)

| Tool | Why to avoid |
|------|-------------|
| Create React App | Deprecated, extremely slow build times |
| Redux | Way too complex for a hackathon; Zustand does the same in 10 lines |
| MySQL / PostgreSQL | Harder setup; MongoDB's flexible schema suits varied post types better |
| Firebase | Free tier is limited; vendor lock-in; harder to customise AI features |
| OpenAI API | Requires credit card; expensive after free credits expire |
| Google Maps | Requires credit card; charges beyond free quota |
| AWS / GCP / Azure | Overkill, complex, easy to accidentally incur charges |
| Heroku | No longer has a free tier |
| Railway | Free tier is very limited (only $5 credit) |
| Netlify Functions | More complex than a simple Express server for this use case |
| Socket.io | Not needed for this project; adds complexity |

---

## 11. Free Tier Limits Summary

| Service | Free Limit | Sufficient? |
|---------|-----------|-------------|
| MongoDB Atlas M0 | 512MB storage | ✅ Yes — easily |
| Vercel | Unlimited deployments | ✅ Yes |
| Render | 750 hrs/month | ✅ Yes |
| Cloudinary | 25GB storage + 25GB bandwidth | ✅ Yes |
| Gemini 2.0 Flash | 1,500 requests/day | ✅ Yes |
| Hugging Face | 30,000 chars/month inference | ✅ Yes |
| OpenStreetMap / CartoDB | Unlimited map tile requests | ✅ Yes |
| Google Fonts | Unlimited | ✅ Yes |

---

*All technologies listed are open-source or have permanently free tiers sufficient for this hackathon project.*
*No credit card required for any service listed above.*
