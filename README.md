<div align="center">
  <h1>Retrieval Co.</h1>
  <p><b>The smart campus platform for recovering lost items and borrowing resources.</b></p>
  
  <p>
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" /></a>
    <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" /></a>
  </p>
</div>

---

## ⚡ Overview

**Retrieval Co.** centralizes the chaotic process of reporting lost items and borrowing campus equipment. It replaces noisy WhatsApp groups with a sleek, gamified portal.

- 🤖 **AI Matching**: Automatically parses descriptions and links lost & found reports.
- 🗺️ **Loss Hotspots**: Visual heatmap of where items are frequently lost.
- 📱 **QR Handoffs**: Secure dual-scan QR system for verifying item returns.
- 🏆 **Karma System**: Gamified trust-building through a student leaderboard.

## 🚀 Quick Start

### Play in Demo Mode (No backend required)

Want to see the UI immediately?
1. `cd retrieval-co-frontend`
2. `npm install && npm run dev`
3. Click **Continue as Demo User** on the login screen to explore fully offline.

### Full Stack Setup (MongoDB + Express)

1. **Backend**:
   ```bash
   cd retrieval-co-backend
   cp .env.example .env # Add your MONGO_URI
   npm install && npm run seed && npm start
   ```
2. **Frontend**:
   ```bash
   cd retrieval-co-frontend
   npm install && npm run dev
   ```

## 📚 Documentation

Detailed documentation and planning specs have been neatly organized in the [`docs/`](./docs) folder:

- 🏛️ [System Architecture & API Specs](./docs/Architecture.md)
- 🏗️ [Project Structure](./docs/PROJECT_STRUCTURE.md)
- 📝 [Product Requirements (PRD)](./docs/Retrieval_Co_PRD.md)
- 🎨 [Design Specifications](./docs/RetrievalCo_Design_Spec.md)
- ⚙️ [Technology Stack](./docs/RetrievalCo_Tech_Stack.md)

## 🤝 Contributing & License

- Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.
- See [CHANGELOG.md](./CHANGELOG.md) for recent updates.
- This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
