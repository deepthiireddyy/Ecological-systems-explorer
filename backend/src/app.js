require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeGEE } = require('./services/gee.service');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json({ limit: '5mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/imagery', require('./routes/imagery'));
app.use('/api/index', require('./routes/index'));
app.use('/api/bluegreen', require('./routes/bluegreen'));
app.use('/api/download', require('./routes/download'));

// 404
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start after GEE initializes
async function start() {
  try {
    console.log('Initializing GEE...');
    await initializeGEE();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start:', err.message);
    process.exit(1);
  }
}

start();