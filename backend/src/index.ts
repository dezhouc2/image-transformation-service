// Load environment variables FIRST (before any other imports)
import dotenv from 'dotenv';
import path from 'path';

// Load .env from the backend directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Debug: Check if env vars loaded
console.log('ENV Check - REMOVE_BG_API_KEY:', process.env.REMOVE_BG_API_KEY ? '✅ Loaded' : '❌ Missing');

import express from 'express';
import cors from 'cors';
import { initCloudinary } from './services/cloudinary';
import imageRoutes from './routes/images';

// Initialize Cloudinary
initCloudinary();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/images', imageRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📸 Image API available at http://localhost:${PORT}/api/images`);
});
