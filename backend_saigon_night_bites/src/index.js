import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import placesRoutes from './routes/placesRoutes.js';
import favoritesRoutes from './routes/favoritesRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import testRoutes from './routes/testRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json({ limit: '10kb' }));

app.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/history', historyRoutes);

if (process.env.NODE_ENV !== 'production') {
  app.use('/api/test', testRoutes);
}

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint không tồn tại' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Server] SaigonNightBites backend đang chạy tại http://localhost:${PORT}`);
  console.log(`[Server] Môi trường: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
