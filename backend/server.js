require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const auth = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// For testing purposes
const createDefaultUser = async () => {
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');

    const existingUser = await User.findOne({ username: 'admin' });
    if (!existingUser) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await User.create({ username: 'admin', password: hashedPassword });
        console.log('👤 Default user created: admin / password123');
    } else {
        console.log('👤 Default user already exists');
    }
};

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB connected');
        await createDefaultUser(); // <- Run this once
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch(err => console.error('MongoDB connection error:', err));
