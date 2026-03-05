require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

const { authMiddleware } = require('./middleware/auth.middleware.js');
const userRoutes = require('./routes/userRoutes.js');
const authRoutes = require('./routes/authRoutes.js');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(authMiddleware);

app.use('/api', authRoutes);
app.use('/api/users', userRoutes);

module.exports = app;