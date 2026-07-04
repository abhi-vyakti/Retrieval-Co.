# Contributing to Retrieval Co.

Thank you for your interest in contributing to **Retrieval Co.**! We want to make it easy and rewarding to improve this campus platform.

---

## Code of Conduct
Please be respectful and helpful. We aim to maintain a welcoming, collaborative community.

## Getting Started

1. **Fork** the repository and clone it to your local machine.
2. **Setup environment variables** in both the frontend and backend folders:
   * Copy `.env.example` to `.env` and fill in your keys (such as `MONGO_URI`, `JWT_SECRET`, etc.).
3. **Install dependencies** in each folder:
   * `cd retrieval-co-frontend && npm install`
   * `cd retrieval-co-backend && npm install` (if running backend separately).

---

## Coding Standards

### Git Branching
* Create descriptive branches from `main` (e.g. `feat/oauth-login`, `fix/qr-scanner`).
* Keep commits focused, descriptive, and atomic.

### Formatting & Styles
* Follow the `.editorconfig` rules (4 spaces indentation for Javascript, 2 spaces for JSON/Markdown).
* Use custom Tailwind CSS variables mapped in `src/index.css` rather than raw hardcoded values.
* Ensure all files end with a final newline.

---

## Submitting Pull Requests

1. **Verify your code** builds and runs locally without errors:
   ```bash
   npm run build
   ```
2. **Commit changes** to your branch and push to your fork.
3. **Open a Pull Request** (PR) detailing:
   * What features/fixes are included.
   * Steps to manually verify.
   * Any visual changes (include screenshots/recordings if applicable).
