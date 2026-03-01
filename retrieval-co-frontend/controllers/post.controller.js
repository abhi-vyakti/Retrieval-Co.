const Post = require('../models/Post');
const User = require('../models/User');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
    try {
        let { type, title, category, description, location, datetime, imageUrl, isAnonymous, isUrgent, needUntil } = req.body;

        // Normalize optional fields
        if (category === '') category = null;
        if (description === '') description = null;

        // Base Required Fields
        if (!type || !title) {
            return res.status(400).json({ error: 'Type and title are strictly required fields.' });
        }

        if (type !== 'borrow' && !datetime) {
            return res.status(400).json({ error: 'Datetime is required for lost and found items.' });
        }

        if (type !== 'borrow' && !location) {
            return res.status(400).json({ error: 'Location is required for lost and found items.' });
        }

        // Auto-fill datetime for simulated targeted borrow requests
        if (type === 'borrow' && !datetime) {
            datetime = new Date().toISOString();
        }

        // Validate type
        const validTypes = ['lost', 'found', 'borrow'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ error: 'Invalid post type specified.' });
        }

        // Conditional Validation
        if (type === 'lost' && !description) {
            return res.status(400).json({ error: 'Description is mandatory for lost items.' });
        }

        if (type === 'found' && !imageUrl) {
            return res.status(400).json({ error: 'Image is mandatory for found items as proof.' });
        }

        if (type === 'borrow' && (!category || !needUntil)) {
            return res.status(400).json({ error: 'Category and needUntil time are mandatory for borrow requests.' });
        }

        const newPost = new Post({
            type,
            title,
            category,
            description,
            location,
            datetime,
            imageUrl,
            isAnonymous,
            isUrgent,
            needUntil,
            author: req.user.id
        });

        const savedPost = await newPost.save();

        // Populate author before returning
        await savedPost.populate('author', 'name collegeId role');

        res.status(201).json({ message: 'Post created successfully', post: savedPost });
    } catch (error) {
        console.error('Error in createPost:', error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get posts with filtering
// @route   GET /api/posts
// @access  Public (or Private depending on frontend)
const getPosts = async (req, res) => {
    try {
        const { type, category, status, search, location } = req.query;

        let query = {};

        if (type) query.type = type;
        if (category) query.category = category;
        if (status) query.status = status;
        if (location) query.location = location;

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Sort by isUrgent first, then newest
        const posts = await Post.find(query)
            .populate('author', 'name collegeId')
            .sort({ isUrgent: -1, createdAt: -1 });

        // Mask author details if the post is anonymous
        const maskedPosts = posts.map(post => {
            const postObj = post.toObject();
            if (postObj.isAnonymous && postObj.author) {
                postObj.author = {
                    _id: postObj.author._id,
                    name: 'Anonymous Student',
                    collegeId: 'Hidden'
                };
            }
            return postObj;
        });

        res.json({ message: 'Posts fetched successfully', posts: maskedPosts });
    } catch (error) {
        console.error('Error in getPosts:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Update post status
// @route   PUT /api/posts/:id/status
// @access  Private
const updatePostStatus = async (req, res) => {
    try {
        const { status, isUrgent } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Only author can update status for now
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to update this post' });
        }

        if (status) post.status = status;
        if (typeof isUrgent !== 'undefined') post.isUrgent = isUrgent;

        const updatedPost = await post.save();
        await updatedPost.populate('author', 'name collegeId');

        res.json({ message: 'Post updated successfully', post: updatedPost });
    } catch (error) {
        console.error('Error in updatePostStatus:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Get user's posts
// @route   GET /api/posts/my-posts
// @access  Private
const getMyPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.user.id })
            .sort({ createdAt: -1 });

        res.json({ message: 'User posts fetched', posts });
    } catch (error) {
        console.error('Error in getMyPosts:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Add a reply to a post
// @route   POST /api/posts/:id/replies
// @access  Private
const addReply = async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (!text) {
            return res.status(400).json({ error: 'Reply text is required' });
        }

        post.replies.push({
            user: req.user.id,
            text
        });

        await post.save();
        await post.populate('replies.user', 'name collegeId');

        res.json({ message: 'Reply added', post });
    } catch (error) {
        console.error('Error in addReply:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

module.exports = {
    createPost,
    getPosts,
    updatePostStatus,
    getMyPosts,
    addReply
};
