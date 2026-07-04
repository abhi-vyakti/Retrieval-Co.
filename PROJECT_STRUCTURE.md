# Project Repository Structure

This document details the file and folder layout of the **Retrieval Co.** repository. The project is organized as a unified full-stack codebase.

---

## Directory Overview

```directory
retrieval-co/
├── .github/                      # GitHub configurations
│   └── ISSUE_TEMPLATE/           # Issue templates for bug reports/feature requests
├── docs/                         # Extended project documentation
│   ├── assets/                   # Folder for real application UI screenshots
│   ├── API.md                    # REST API endpoint documentation
│   ├── Architecture.md           # Structural layout, data flow, and Vercel hosting
│   ├── DECISIONS.md              # Engineering trade-offs (Demo Mode, LocalStorage)
│   ├── FutureRoadmap.md          # Technical debt, features backlog, and v2 plans
│   ├── SYSTEM_DESIGN.md          # Technical design, request flows, database schema
│   └── retrieval-co (UI).html    # Initial UI HTML mockup
├── retrieval-co-backend/         # Dedicated Express backend server (for standalone run)
│   ├── controllers/              # Request handlers (AI parsing, posts, return confirmation)
│   ├── middlewares/              # Express authentication middleware
│   ├── models/                   # Mongoose schemas for MongoDB
│   ├── routes/                   # Router declarations
│   ├── services/                 # AI parsers and image helpers
│   ├── db.json                   # Mock database file used by mongoose-mock
│   ├── mongoose-mock.js          # Local in-memory / JSON database driver
│   ├── server.js                 # Entry point for backend Express app
│   └── seed.js                   # Pre-populates database with mock data
├── retrieval-co-frontend/        # Main deployment folder (Vite Client + Vercel Functions)
│   ├── api/                      # Serverless router entry (points to server.js)
│   │   └── index.js              # Exports Express server for Vercel functions
│   ├── controllers/              # Production handler copies run as Serverless Functions
│   ├── middlewares/              # Authentication middleware copies
│   ├── models/                   # Mongoose schema copies
│   ├── routes/                   # API router copies
│   ├── services/                 # AI utility copies
│   ├── server.js                 # Unified server configuration for Vercel
│   ├── mongoose-mock.js          # Database driver copy
│   ├── public/                   # Static browser assets
│   ├── src/                      # React frontend codebase
│   │   ├── assets/               # Local icons and CSS variables
│   │   ├── components/           # Reusable UI parts (Card, Input, Modal, Footer)
│   │   ├── config/               # API base settings & Demo Mode Fetch interceptor
│   │   ├── context/              # Global states (Auth, Theme)
│   │   ├── pages/                # Router pages (Landing, Dashboard, Leaderboard, Map)
│   │   ├── App.jsx               # Main React entry & routes
│   │   ├── main.jsx              # React app mount
│   │   └── index.css             # Main stylesheet & theme mappings
│   ├── index.html                # App HTML scaffold
│   ├── package.json              # Client dependencies and npm scripts
│   ├── vercel.json               # Serverless path rewrites configuration
│   └── vite.config.mjs           # Vite settings & Tailwind CSS integration
├── tests/                        # Automated integration test scripts
│   ├── test_ai.js                # Test for NLP post parsing
│   └── test_create_post.js       # Test for database post entry
├── .editorconfig                 # IDE styling and formatting rules
├── .gitignore                    # Files ignored by Git control
├── CHANGELOG.md                  # Release version history
├── CONTRIBUTING.md               # Guidelines for developers
├── LICENSE                       # MIT License
└── README.md                     # Main portfolio page entry
```

---

## Structural Highlights

1. **Unified Vercel Deployment**:
   * The `retrieval-co-frontend` folder is the primary workspace deployed on Vercel. 
   * `/api/(.*)` requests are routed to `retrieval-co-frontend/api/index.js`, which launches the Express app exported by `server.js` as serverless functions.
   * This allows the entire React UI and Express backend to be served together under the same origin.

2. **Decoupled Backend Reference**:
   * `retrieval-co-backend/` provides a separate, clean folder to run Node.js on `localhost:5000` during local MongoDB development.

3. **Demo Mode Interceptor**:
   * In `retrieval-co-frontend/src/config/mockFetch.js`, the React app intercepts frontend API calls during Demo Mode to fetch from and persist directly inside the browser's `localStorage`, rendering the app fully offline and serverless-capable for reviewers.
