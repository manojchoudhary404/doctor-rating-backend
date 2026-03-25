require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const reviewRoutes = require('./routes/reviews');
const doctorRoutes = require('./routes/doctors');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/reviews', reviewRoutes);
app.use('/doctors', doctorRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/', (_, res) => res.json({ message: '🩺 Doctor Rating API is running', version: '1.0.0' }));

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` }));

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
