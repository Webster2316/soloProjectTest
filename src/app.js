require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require("path");

const { authMiddleware } = require('./middleware/auth.middleware.js');
const userRoutes = require('./routes/userRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const chatroomRoutes = require('./routes/chatroomRoutes');

const app = express();
app.use(express.json());
app.get('/', (req, res) => {
  res.status(200).send('OK');
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(cookieParser());
app.use(authMiddleware);

app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chatroom', chatroomRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;