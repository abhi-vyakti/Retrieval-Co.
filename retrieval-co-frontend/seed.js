const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Post = require('./models/Post');
require('dns').setServers(['8.8.8.8']);

dotenv.config();

const users = [
    {
        collegeId: '22BCE1234',
        name: 'Kiran Sharma',
        karma: 312,
        role: 'student'
    },
    {
        collegeId: '23ECE4321',
        name: 'Priya Nair',
        karma: 247,
        role: 'student'
    },
    {
        collegeId: '21MEC5678',
        name: 'Rahul Verma',
        karma: 189,
        role: 'student'
    },
    {
        collegeId: '24CIV8765',
        name: 'Ananya Singh',
        karma: 134,
        role: 'student'
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/retrieval-co');
        console.log('Connected to Database for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Post.deleteMany({});
        console.log('Cleared existing data.');

        // Seed Users
        const createdUsers = await User.insertMany(users);
        console.log(`Seeded ${createdUsers.length} users.`);

        const userMap = {
            'Kiran Sharma': createdUsers[0]._id,
            'Priya Nair': createdUsers[1]._id,
            'Rahul Verma': createdUsers[2]._id,
            'Ananya Singh': createdUsers[3]._id
        };

        const now = new Date();

        const posts = [
            {
                type: 'lost',
                title: 'Student ID Card',
                category: 'ID Cards',
                description: 'Lost my ID card near the canteen. It has a blue lanyard.',
                location: 'Canteen',
                datetime: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
                status: 'open',
                isUrgent: true,
                author: userMap['Ananya Singh']
            },
            {
                type: 'found',
                title: 'Scientific Calculator (Casio FX-991ES)',
                category: 'Electronics',
                description: 'Found on the 3rd bench in Physics Lab.',
                location: 'Department Lab',
                datetime: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
                status: 'open',
                imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=500&h=500&fit=crop',
                author: userMap['Rahul Verma']
            },
            {
                type: 'borrow',
                title: 'Engineering Drafter',
                category: 'Stationery',
                description: 'Need a drafter for my EG class in 30 mins!',
                location: '1st Year Block',
                datetime: new Date(now.getTime() - 10 * 60 * 1000), // 10 mins ago
                needUntil: new Date(now.getTime() + 2 * 60 * 60 * 1000), // need for 2 hrs
                status: 'open',
                isUrgent: true,
                author: userMap['Priya Nair']
            },
            {
                type: 'lost',
                title: 'Black Backpack',
                category: 'Others',
                description: 'Puma backpack with 2 notebooks and a water bottle.',
                location: 'Cafeteria',
                datetime: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
                status: 'claimed',
                author: userMap['Kiran Sharma']
            },
            {
                type: 'found',
                title: 'Blue Notebook',
                category: 'Books',
                description: 'Spiral notebook with "Mechanics" written on front.',
                location: 'Central Library / Admin Block',
                datetime: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
                status: 'open',
                imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5448c9033f8?w=500&h=500&fit=crop',
                author: userMap['Ananya Singh']
            },
            {
                type: 'borrow',
                title: 'Lab Coat (Size M)',
                category: 'Clothing',
                description: 'Forgot my lab coat, need one for Chem Lab ASAP.',
                location: 'Department Lab',
                datetime: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
                status: 'open',
                author: userMap['Rahul Verma']
            },
            {
                type: 'lost',
                title: 'Wireless Earphones',
                category: 'Electronics',
                description: 'White OnePlus buds in a silicone case.',
                location: 'Canteen',
                datetime: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
                status: 'open',
                author: userMap['Priya Nair']
            },
            {
                type: 'found',
                title: 'Wallet (Brown)',
                category: 'Others',
                description: 'Leather wallet found near the main entrance.',
                location: 'Main Gate',
                datetime: new Date(now.getTime() - 48 * 60 * 60 * 1000), // 2 days ago
                status: 'returned',
                imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop',
                author: userMap['Kiran Sharma']
            },
            {
                type: 'borrow',
                title: 'Scientific Calculator',
                category: 'Electronics',
                description: 'Need for mid-sem exam!',
                location: 'Central Library / Admin Block',
                datetime: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
                status: 'claimed',
                author: userMap['Ananya Singh']
            },
            {
                type: 'lost',
                title: 'Engineering Drawing Book',
                category: 'Books',
                description: 'A3 size drawing book.',
                location: 'Department Lab',
                datetime: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
                status: 'open',
                author: userMap['Rahul Verma']
            },
            {
                type: 'found',
                title: 'Student ID',
                category: 'ID Cards',
                description: 'Found a student ID card.',
                location: 'Central Library / Admin Block',
                datetime: new Date(now.getTime() - 8 * 60 * 60 * 1000), // 8 hours ago
                status: 'open',
                isAnonymous: true,
                author: userMap['Priya Nair']
            },
            {
                type: 'borrow',
                title: 'Highlighters Set',
                category: 'Stationery',
                description: 'Need for a quick presentation prep.',
                location: 'Other (specify)',
                datetime: new Date(now.getTime() - 30 * 60 * 1000), // 30 mins ago
                status: 'open',
                author: userMap['Kiran Sharma']
            },
            {
                type: 'lost',
                title: 'Phone Charger',
                category: 'Electronics',
                description: 'Type-C white adapter.',
                location: 'Cafeteria',
                datetime: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
                status: 'open',
                author: userMap['Ananya Singh']
            },
            {
                type: 'found',
                title: 'Lab Coat',
                category: 'Clothing',
                description: 'Left hanging outside lab 3.',
                location: 'Department Lab',
                datetime: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
                status: 'open',
                author: userMap['Rahul Verma']
            },
            {
                type: 'lost',
                title: 'Set Square',
                category: 'Stationery',
                description: 'Left in the EG hall.',
                location: '1st Year Block',
                datetime: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
                status: 'open',
                author: userMap['Priya Nair']
            }
        ];

        const createdPosts = await Post.insertMany(posts);
        console.log(`Seeded ${createdPosts.length} posts.`);

        console.log('Database seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
