const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { createPost, getPosts, updatePostStatus, getMyPosts, addReply } = require('../controllers/post.controller');

// GET /api/posts - Fetch all posts (public/protected depending on need, let's make it protected for MVP)
router.get('/', authMiddleware, getPosts);

// POST /api/posts - Create a new post
router.post('/', authMiddleware, createPost);

// GET /api/posts/my-posts - Get user's posts
router.get('/my-posts', authMiddleware, getMyPosts);

// PUT /api/posts/:id/status - Update post status
router.put('/:id/status', authMiddleware, updatePostStatus);

// POST /api/posts/:id/replies - Add a reply to a post
router.post('/:id/replies', authMiddleware, addReply);

module.exports = router;
