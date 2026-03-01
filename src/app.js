
require('dotenv').config();
const express = require('express');
const createError = require('http-errors');
const path = require('path');

//TODO: const somethingRoute = require('./routers/Something.router');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/health', (req, res) => res.status(200).send('OK'));

// TODO: app.use('/api/messages', somethingRoute);

app.use((req, res, next) => {
  next(createError(404, `Unknown resource ${req.method} ${req.originalUrl}`));
});

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    error: error.message || 'Unknown Server Error!',
  });
});

module.exports = app;