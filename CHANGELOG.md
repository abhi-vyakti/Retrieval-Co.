# Changelog

All notable changes to the **Retrieval Co.** project will be documented in this file.

---

## [v1.1.0] - Portfolio Edition - 2026-07-04

This release updates the hackathon prototype into a professional, recruiter-ready full-stack portfolio project.

### Added
* **Demo Mode**: Enabled a client-side database-free evaluation mode (using `window.fetch` interception and `localStorage` persistence).
* **Demo Bypass Button**: Added a "Continue as Demo User" button on the LoginPage to easily sign in with a pre-seeded student account (`Kiran Sharma`).
* **Handoff Simulation**: Added simulation controls to the QR handoff modal so developers/reviewers can test the secure transfer workflow in a single tab.
* **Footer Component**: Created and integrated a consistent, modern footer across the Landing and Dashboard views.
* **Open Source Scaffolding**: Added `.editorconfig`, `LICENSE` (MIT), `CONTRIBUTING.md`, and GitHub issue templates.
* **Comprehensive Documentation**: Authored `SYSTEM_DESIGN.md`, `PROJECT_STRUCTURE.md`, and guides under `docs/` covering architecture, API endpoints, key engineering decisions, and a future development roadmap.

### Fixed
* **Landing Page Routing**: Exposed the fully-designed campus landing page at `/` (which was previously inaccessible and forced a redirect to login).
* **Auto-Redirects**: Configured the login page to immediately redirect active sessions to `/dashboard`.
* **Clean Code**: Refactored the folder layout by deleting empty root directories and removing ESLint logs.

---

## [v1.0.0] - Hackathon Submission - 2026-07-03

Initial functional prototype developed during the campus hackathon.

### Added
* Full-stack Lost & Found listing with categories and search filters.
* Temporary borrow/lend equipment request matching.
* Secure handoff verification using dual-scan QR sessions.
* AI-assisted post creation (NLP text parsing & image vision checks).
* Integrated interactive campus loss hotspots using Leaflet maps.
* Gamified trust framework utilizing student Karma points.
