# API Endpoint Reference

This document documents the REST API endpoints implemented in **Retrieval Co.** (supported by both the real Express server and the offline Demo Mode interceptor).

---

## 1. Authentication Endpoints

### `POST /api/auth/login`
Authenticates a student and yields a JWT session token.

* **Request Body:**
  ```json
  {
    "code": "22BCE1234",
    "password": "password123"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "message": "Login successful",
    "token": "jwt_session_token_here",
    "user": {
      "id": "user_kiransharma",
      "code": "22BCE1234",
      "name": "Kiran Sharma",
      "role": "student",
      "karma": 312
    }
  }
  ```

---

## 2. Post Endpoints

### `GET /api/posts`
Fetches open lost, found, and borrow postings on campus.

* **Query Parameters (Optional):**
  * `type`: Filter by post type (`lost`, `found`, or `borrow`).
  * `category`: Filter by item category (e.g. `Electronics`, `ID Cards`).
  * `search`: Match text patterns in titles/descriptions.
* **Success Response (200 OK):**
  ```json
  {
    "message": "Posts fetched successfully",
    "posts": [
      {
        "_id": "post_1",
        "type": "lost",
        "title": "Student ID Card",
        "category": "ID Cards",
        "description": "Lost my ID card near the canteen...",
        "location": "Canteen",
        "datetime": "2026-07-04T06:00:00.000Z",
        "status": "open",
        "isUrgent": true,
        "author": {
          "_id": "user_ananyasingh",
          "name": "Ananya Singh",
          "collegeId": "24CIV8765"
        },
        "replies": [],
        "createdAt": "2026-07-04T06:00:00.000Z"
      }
    ]
  }
  ```

### `POST /api/posts`
Creates a new listing.

* **Request Body:**
  ```json
  {
    "type": "found",
    "title": "Casio Calculator",
    "category": "Electronics",
    "description": "Found Casio FX-991ES in Lab room 302",
    "location": "Department Lab",
    "datetime": "2026-07-04T07:30:00.000Z",
    "imageUrl": "https://url-to-uploaded-image.png"
  }
  ```

---

## 3. Secure Return Endpoints

### `POST /api/return/:postId/generate-qr`
Generates a secure verification session token (only callable by the post author).

* **Success Response (200 OK):**
  ```json
  {
    "message": "QR Token generated",
    "qrData": {
      "postId": "post_1",
      "ownerId": "user_ananyasingh",
      "token": "secure_qr_jwt_token"
    }
  }
  ```

### `POST /api/return/confirm-qr`
Confirms physical return handoff and transfers Karma points (called by the scanner/finder).

* **Request Body:**
  ```json
  {
    "postId": "post_1",
    "ownerId": "user_ananyasingh",
    "token": "secure_qr_jwt_token"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "message": "Return confirmed successfully and Karma awarded!"
  }
  ```
