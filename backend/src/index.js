import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { authMiddleware } from './middleware/authMiddleware.js';
import { initDb } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ResuMatch AI API', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', authMiddleware, resumeRoutes);
app.use('/api/jobs', authMiddleware, jobRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error('Unhandled API Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Initialize DB and launch server
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 ResuMatch AI Backend Server running on http://localhost:${PORT}`);
  });
});
