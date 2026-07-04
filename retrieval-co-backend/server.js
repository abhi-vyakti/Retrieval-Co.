// Intercept require('mongoose') to use our local JSON file mock database
const Module = require('module');
const originalRequire = Module.prototype.require;
const path = require('path');
Module.prototype.require = function (id) {
    if (id === 'mongoose') {
        return originalRequire.call(this, path.join(__dirname, 'mongoose-mock.js'));
    }
    return originalRequire.apply(this, arguments);
};

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/retrieval-co')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic health check route
app.get('/', (req, res) => {
    res.json({ message: 'Retrieval Co. API is running smoothly.' });
});

// Import Routes
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const userRoutes = require('./routes/user.routes');
const karmaRoutes = require('./routes/karma.routes');
const aiRoutes = require('./routes/ai.routes');
const uploadRoutes = require('./routes/upload.routes');
const returnRoutes = require('./routes/return.routes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/karma', karmaRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/return', returnRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong on the server.' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
