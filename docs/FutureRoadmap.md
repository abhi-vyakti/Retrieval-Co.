# Future Roadmap

This document outlines upcoming developmental milestones to expand the functionality and reliability of **Retrieval Co.**

---

## 1. Production Authentication
* **Goal**: Replace Demo Mode / local JSON credentials with verified institutional login.
* **Tech Stack**: OAuth 2.0 (Google/GitHub/Microsoft Login) restricted to college domain accounts (e.g. `@university.edu`).

## 2. Real-Time Interactions (WebSockets)
* **Goal**: Enable instant notifications when an item matches or when someone replies to a claim.
* **Tech Stack**: Socket.io on Express, integrated with frontend toast updates.

## 3. Advanced AI Enhancements
* **Goal**: Automate details entry and match verification.
* **Features**:
  * **OCR Scanner**: Scan student ID cards using mobile cameras to automatically detect name, registration number, and notify the owner directly.
  * **Image Embeddings Similarity**: Use lightweight vector databases (like ChromaDB or Pinecone) to compare visual representations of items.

## 4. Mobile App Integration
* **Goal**: Reach students on their phones where they check notifications most.
* **Tech Stack**: React Native or Flutter to compile existing components into iOS and Android apps.
