const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['lost', 'found', 'borrow'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Electronics', 'Stationery', 'ID Cards', 'Books', 'Clothing', 'Lab Equipment', 'Others', null],
        default: null
    },
    description: {
        type: String,
        default: null
    },
    location: {
        type: String,
        required: true
    },
    datetime: {
        type: Date,
        required: true
    },
    imageUrl: {
        type: String,
        // Required for found items, handled via validation/frontend
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    isUrgent: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['open', 'claimed', 'returned', 'expired'],
        default: 'open'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Used for linking a Lost post to a matched Found post
    matchIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    // For borrow posts
    needUntil: {
        type: Date
    },
    replies: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            text: {
                type: String,
                required: true
            },
            isAccepted: {
                type: Boolean,
                default: false
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    // Return & Karma Tracking
    returnConfirmedAt: {
        type: Date
    },
    returnMethod: {
        type: String,
        enum: ['manual', 'qr']
    }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
