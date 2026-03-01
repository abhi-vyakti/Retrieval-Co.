const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    collegeId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    karma: {
        type: Number,
        default: 0,
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student',
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
