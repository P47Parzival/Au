const express = require('express');
const cors = require('cors');
const connectToDb = require('./db/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
const startDb = async () => {
    await connectToDb();
};
startDb();

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

// Handle undefined routes
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

module.exports = app;