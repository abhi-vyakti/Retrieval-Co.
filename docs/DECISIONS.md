# Engineering Decisions

This document outlines key technical decisions made during the post-hackathon refactoring of **Retrieval Co.**

---

## 1. Why Demo Mode?

### Problem
Authentication and database server connectivity issues after deploying full-stack MERN apps to serverless architectures (like Vercel) often block recruiters and reviewers. If they cannot sign up or log in, they cannot explore the core functionality of the application.

### Decision
We introduced a client-side **Demo Mode** bypass.
* Real authentication logic (Mongoose/MongoDB/JWT) remains in the codebase and can be turned on for local development or production environments.
* When Demo Mode is active, all backend API calls are intercepted on the client.

### Trade-offs & Benefits
* **Trust & Transparency**: The original code is fully visible, proving we can build production authentication.
* **Frictionless Review**: Reviewers can explore every single page and interaction instantly without running a local database.

---

## 2. Why Client-Side LocalStorage Persistence?

### Problem
Mocking API endpoints statically (returning hardcoded static arrays) prevents reviewers from seeing how the UI handles state changes (e.g. creating a post, adding a reply, or confirming a handoff).

### Decision
We implemented a client-side database layer utilizing `window.fetch` interception and browser `localStorage`.
* Features like creating a lost/found post, replying to a thread, updating post statuses, and earning Karma points write directly to `localStorage`.
* State is preserved across page reloads.

### Benefits
* **Dynamic Experience**: The application behaves like a real MERN-stack application.
* **Zero Infrastructure Overhead**: No remote databases or API gateways are queried, removing network latency and API timeouts.

---

## 3. Future Path

To transition the project to a production-ready system:
1. Enable production-grade OAuth (GitHub/Google Login) for verified student directory logins.
2. Replace local storage mocks with real Express backend routes.
3. Add MongoDB database indexing for text searches.
