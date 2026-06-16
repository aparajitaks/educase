require('dotenv').config();

const express = require('express');
const cors = require('cors');
const profileRoutes = require('./routes/profileRoutes');
const { healthCheck } = require('./controllers/profileController');
const errorHandler = require('./utils/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Health Check ──────────────────────────────────────────
app.get('/health', healthCheck);

// ─── API Routes ────────────────────────────────────────────
app.use('/api/profiles', profileRoutes);

// ─── Root Route ────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: 'GitHub Profile Analyzer API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      analyzeProfile: 'POST /api/profiles/:username',
      getAllProfiles: 'GET /api/profiles',
      getProfile: 'GET /api/profiles/:username',
    },
  });
});

// ─── 404 Handler ───────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ──────────────────────────────────
app.use(errorHandler);

// ─── Start Server ──────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
