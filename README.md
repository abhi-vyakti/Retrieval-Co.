# Retrieval Co.

Retrieval Co. is a full-stack web application built to solve a common problem on college campuses: lost items and temporary borrowing of everyday essentials.

Instead of relying on scattered WhatsApp messages, the platform provides a centralized place where students can report lost or found items, borrow equipment, and coordinate returns through a structured workflow.

Originally developed during a hackathon, the project has since been refactored into a portfolio project with improved architecture, documentation, and deployment.

---

## Why this project?

During college events, hundreds of messages about lost wallets, ID cards, calculators, lab coats, and chargers are buried inside WhatsApp groups. Retrieval Co. was built to make these requests searchable, organized, and easier to manage.

---

## Features

- Lost & Found management
- Equipment borrowing workflow
- AI-assisted post parsing
- AI-based matching suggestions
- QR-based item return verification
- Campus hotspot visualization
- Community karma leaderboard
- Offline Demo Mode for portfolio evaluation

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS

### Backend

- Node.js
- Express.js

### Database

- MongoDB

### Other

- JWT Authentication
- REST APIs
- Vercel Deployment

---

## Running the project

### Demo Mode

No backend setup is required.

```bash
cd retrieval-co-frontend
npm install
npm run dev
```

Choose **Continue as Demo User** on the login screen.

---

### Full Stack

Backend

```bash
cd retrieval-co-backend
cp .env.example .env
npm install
npm run seed
npm start
```

Frontend

```bash
cd retrieval-co-frontend
npm install
npm run dev
```

---

## Repository Structure

```
retrieval-co/
│
├── retrieval-co-frontend/
├── retrieval-co-backend/
├── docs/
└── README.md
```

---

## Documentation

Additional documentation is available inside the `docs/` directory.

- Architecture
- API Documentation
- Project Structure
- Product Requirements
- Design Specifications
- Technology Stack

---

## Future Improvements

Some planned improvements include:

- OAuth authentication
- Real-time notifications
- Push notifications
- Production cloud storage
- Better AI-assisted matching

---

## License

This project is licensed under the MIT License.
